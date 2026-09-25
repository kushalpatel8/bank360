import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import connectToDatabase from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Interaction from '@/models/Interaction';
import AIConversation from '@/models/AIConversation';
import redis, { rateLimit } from '@/lib/redis';

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'openai/gpt-oss-safeguard-20b',
  temperature: 0.3,
});

function buildCustomerContext(customer: Record<string, unknown>, interactions: Record<string, unknown>[]): string {
  return `
CUSTOMER PROFILE:
- Name: ${customer.fullName}
- Age: ${customer.age}, Gender: ${customer.gender}
- Occupation: ${customer.occupation || 'N/A'}
- Province: ${customer.originProvince || 'N/A'}
- Income Category: ${customer.incomeCategory || 'N/A'}
- Education: ${customer.educationLevel || 'N/A'}
- Marital Status: ${customer.maritalStatus || 'N/A'}

FINANCIAL PROFILE:
- Balance: ${customer.balance ? `$${Number(customer.balance).toLocaleString()}` : 'N/A'}
- Credit Score: ${customer.creditScore || 'N/A'}
- Credit Limit: ${customer.creditLimit ? `$${Number(customer.creditLimit).toLocaleString()}` : 'N/A'}
- Monthly Income: ${customer.monthlyIncome ? `$${Number(customer.monthlyIncome).toLocaleString()}` : 'N/A'}
- Avg Utilization Ratio: ${customer.avgUtilizationRatio ?? 'N/A'}

ENGAGEMENT:
- Customer Segment: ${customer.customerSegment || 'N/A'}
- Engagement Score: ${customer.engagementScore ?? 'N/A'}/100
- Loyalty Level: ${customer.loyaltyLevel || 'N/A'}
- Digital Behavior: ${customer.digitalBehavior || 'N/A'}
- Active Member: ${customer.isActiveMember ? 'Yes' : 'No'}
- Months on Book: ${customer.monthsOnBook || 'N/A'}
- Months Inactive (last 12): ${customer.monthsInactive12Mon ?? 'N/A'}
- Contacts in last 12 months: ${customer.contactsCount12Mon ?? 'N/A'}

CHURN & RISK:
- Attrition Status: ${customer.attritionFlag || 'N/A'}
- Churn Probability: ${customer.churnProbability ?? 'N/A'}
- Risk Score: ${customer.riskScore ?? 'N/A'}
- Risk Segment: ${customer.riskSegment || 'N/A'}

PRODUCTS:
- Card Category: ${customer.cardCategory || 'N/A'}
- Number of Cards: ${customer.numsCards ?? 'N/A'}
- Number of Services: ${customer.numsServices ?? 'N/A'}
- Total Relationship Count: ${customer.totalRelationshipCount ?? 'N/A'}

RECENT INTERACTIONS (last ${interactions.length}):
${interactions.length > 0
  ? interactions.map((i) => `  - ${i.type?.toString().toUpperCase()} on ${new Date(i.date as string).toLocaleDateString()}: ${i.notes}`).join('\n')
  : '  No recent interactions recorded.'}
`.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Rate limiting
    const { success } = await rateLimit(`ai:${userId}`, 30, 60);
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { message, sessionId, clientNum } = await req.json();

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Missing message or sessionId' }, { status: 400 });
    }

    await connectToDatabase();

    // Build context
    let customerContext = '';
    if (clientNum) {
      const cacheKey = `ai_ctx:${clientNum}`;
      const cached = await redis.get<string>(cacheKey);
      if (cached) {
        customerContext = cached;
      } else {
        const customer = await Customer.findOne({ clientNum }).lean();
        if (customer) {
          const interactions = await Interaction.find({ clientNum }).sort({ date: -1 }).limit(5).lean();
          customerContext = buildCustomerContext(
            customer as unknown as Record<string, unknown>,
            interactions as unknown as Record<string, unknown>[]
          );
          await redis.setex(cacheKey, 300, customerContext);
        }
      }
    }

    // Load conversation history
    let conversation = await AIConversation.findOne({ sessionId });
    if (!conversation) {
      conversation = new AIConversation({
        sessionId,
        userId,
        clientNum,
        messages: [],
      });
    }

    const systemPrompt = `You are Bank360 AI, an intelligent banking relationship management assistant. 
You help relationship managers understand their customers better and make informed decisions.
Be concise, professional, and data-driven in your responses.
Always base your insights on the provided customer data.

When analyzing a customer's risk, evaluate them against these Key Risk Indicators (KRIs):
1. Credit Risk: Score, debt-to-income, LTV.
2. Liquidity: Overdraft frequency, balances.
3. Behavioral: Unusual activity, transaction spikes.
4. Compliance: KYC/AML flags.
5. Product Usage: Concentration in one product, high utilization.
6. Geographic/Economic: High-risk region/industry vulnerability.

Highlight any triggering KRIs explicitly and suggest actionable mitigation strategies.

CRITICAL FORMATTING RULES:
- Do NOT use markdown tables.
- Do NOT use asterisks (*) for bold, italic, or bullet points. Use standard dashes (-) or plain numbers for lists.
- Output clean, readable plain text ONLY.
${customerContext ? `\n\nCURRENT CUSTOMER CONTEXT:\n${customerContext}` : '\nNo specific customer selected. Answer general banking CRM questions.'}`;

    const messages = [
      new SystemMessage(systemPrompt),
      ...conversation.messages.slice(-10).map((m) =>
        m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
      ),
      new HumanMessage(message),
    ];

    const response = await model.invoke(messages);
    const assistantMessage = response.content as string;

    // Save to conversation
    conversation.messages.push({ role: 'user', content: message, timestamp: new Date() });
    conversation.messages.push({ role: 'assistant', content: assistantMessage, timestamp: new Date() });
    await conversation.save();

    return NextResponse.json({ message: assistantMessage, sessionId });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) return NextResponse.json({ messages: [] });

    const conversation = await AIConversation.findOne({ sessionId, userId }).lean();
    return NextResponse.json({ messages: conversation?.messages || [] });
  } catch (error) {
    console.error('AI history GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
