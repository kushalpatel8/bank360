import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';
import FollowUp from '@/models/FollowUp';
import { getOrSet } from '@/lib/redis';

export async function GET(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();

    const data = await getOrSet(
      'analytics:dashboard',
      async () => {
        const [
          totalCustomers,
          activeCustomers,
          highRiskCustomers,
          churnedCustomers,
          pendingFollowUps,
          segmentAgg,
          riskAgg,
          churnAgg,
          engagementAgg,
          cardAgg,
        ] = await Promise.all([
          Customer.countDocuments(),
          Customer.countDocuments({ status: 'active' }),
          Customer.countDocuments({ riskSegment: 'High' }),
          Customer.countDocuments({ attritionFlag: 'Attrited Customer' }),
          FollowUp.countDocuments({ status: 'pending' }),
          Customer.aggregate([
            { $group: { _id: '$customerSegment', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ]),
          Customer.aggregate([
            { $group: { _id: '$riskSegment', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ]),
          Customer.aggregate([
            { $group: { _id: '$attritionFlag', count: { $sum: 1 } } },
          ]),
          Customer.aggregate([
            {
              $bucket: {
                groupBy: '$engagementScore',
                boundaries: [0, 30, 60, 80, 101],
                default: 'Unknown',
                output: { count: { $sum: 1 } },
              },
            },
          ]),
          Customer.aggregate([
            { $group: { _id: '$cardCategory', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ]),
        ]);

        const avgEngagement = await Customer.aggregate([
          { $group: { _id: null, avg: { $avg: '$engagementScore' } } },
        ]);
        const avgCreditScore = await Customer.aggregate([
          { $group: { _id: null, avg: { $avg: '$creditScore' } } },
        ]);

        return {
          stats: {
            totalCustomers,
            activeCustomers,
            newCustomers: Math.round(totalCustomers * 0.08),
            highRiskCustomers,
            churnedCustomers,
            avgEngagementScore: Math.round(avgEngagement[0]?.avg ?? 0),
            pendingFollowUps,
            avgCreditScore: Math.round(avgCreditScore[0]?.avg ?? 0),
          },
          segmentDistribution: segmentAgg.map((s) => ({
            segment: s._id || 'Unknown',
            count: s.count,
            percentage: Math.round((s.count / totalCustomers) * 100),
          })),
          riskDistribution: riskAgg.map((r) => ({
            riskSegment: r._id || 'Unknown',
            count: r.count,
            percentage: Math.round((r.count / totalCustomers) * 100),
          })),
          churnDistribution: churnAgg.map((c) => ({
            label: c._id || 'Unknown',
            count: c.count,
            percentage: Math.round((c.count / totalCustomers) * 100),
          })),
          engagementDistribution: engagementAgg.map((e) => ({
            level:
              e._id === 0
                ? 'Very Low (0-30)'
                : e._id === 30
                ? 'Low (30-60)'
                : e._id === 60
                ? 'Medium (60-80)'
                : e._id === 80
                ? 'High (80-100)'
                : 'Unknown',
            count: e.count,
          })),
          productAdoption: cardAgg.map((c) => ({
            product: c._id || 'Unknown',
            count: c.count,
          })),
        };
      },
      300 // 5 min cache
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
