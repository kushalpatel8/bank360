import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongodb';
import FollowUp from '@/models/FollowUp';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const clientNum = searchParams.get('clientNum');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status) query.status = status;
    if (clientNum) query.clientNum = parseInt(clientNum);

    const followUps = await FollowUp.find(query).sort({ dueDate: 1 }).limit(50).lean();
    return NextResponse.json({ followUps });
  } catch (error) {
    console.error('FollowUps GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();

    const followUp = new FollowUp({
      ...body,
      assignedBy: userId,
      dueDate: new Date(body.dueDate),
    });

    await followUp.save();
    return NextResponse.json({ followUp }, { status: 201 });
  } catch (error) {
    console.error('FollowUps POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { id, ...updates } = await req.json();

    const followUp = await FollowUp.findByIdAndUpdate(
      id,
      { ...updates, ...(updates.status === 'completed' ? { completedAt: new Date() } : {}) },
      { new: true }
    );

    if (!followUp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ followUp });
  } catch (error) {
    console.error('FollowUps PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
