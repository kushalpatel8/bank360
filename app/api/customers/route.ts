import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getOrSet } from '@/lib/redis';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const segment = searchParams.get('segment') || '';
    const riskSegment = searchParams.get('riskSegment') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const skip = (page - 1) * limit;

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { originProvince: { $regex: search, $options: 'i' } },
      ];
    }
    if (segment) query.customerSegment = segment;
    if (riskSegment) query.riskSegment = riskSegment;
    if (status) query.status = status;

    const cacheKey = `customers:${JSON.stringify({ query, skip, limit, sortBy, sortOrder })}`;
    const result = await getOrSet(
      cacheKey,
      async () => {
        const [customers, total] = await Promise.all([
          Customer.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          Customer.countDocuments(query),
        ]);
        return { customers, total };
      },
      60 // 60s cache
    );

    return NextResponse.json({
      customers: result.customers,
      total: result.total,
      page,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (error) {
    console.error('Customers API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
