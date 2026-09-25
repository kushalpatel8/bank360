import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Interaction from '@/models/Interaction';
import FollowUp from '@/models/FollowUp';
import { getOrSet } from '@/lib/redis';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { customerId } = await params;

    const cacheKey = `customer:${customerId}`;
    const customer = await getOrSet(
      cacheKey,
      () => Customer.findById(customerId).lean(),
      120
    );

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const [interactions, followUps] = await Promise.all([
      Interaction.find({ customerId }).sort({ date: -1 }).limit(10).lean(),
      FollowUp.find({ customerId }).sort({ dueDate: 1 }).lean(),
    ]);

    return NextResponse.json({ customer, interactions, followUps });
  } catch (error) {
    console.error('Customer detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
