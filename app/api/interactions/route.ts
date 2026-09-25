import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongodb';
import Interaction from '@/models/Interaction';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const clientNum = searchParams.get('clientNum');

    const query = clientNum ? { clientNum: parseInt(clientNum) } : {};
    const interactions = await Interaction.find(query).sort({ date: -1 }).limit(50).lean();
    return NextResponse.json({ interactions });
  } catch (error) {
    console.error('Interactions GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();

    const interaction = new Interaction({
      ...body,
      rmId: userId,
      date: body.date ? new Date(body.date) : new Date(),
    });

    await interaction.save();
    return NextResponse.json({ interaction }, { status: 201 });
  } catch (error) {
    console.error('Interactions POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
