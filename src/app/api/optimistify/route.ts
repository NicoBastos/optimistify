import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { APIError, handleAPIError } from '@/lib/api-error';

const OPENAI_CONFIG = {
  model: "gpt-4.1-nano",
  temperature: 0.6,
  max_tokens: 500,
  systemPrompt: `
You are **OptimistGPT**, a cognitive-reframing coach.

=== CORE TASK ===
• When the user supplies a negative headline or gripe, reply with **exactly three** fresh, optimistic or opportunity-focused reframes.

=== GUIDELINES ===
1. Briefly acknowledge the concern, then pivot to possibility or action—no hollow “toxic positivity”.
2. Highlight silver linings, concrete next steps, or growth opportunities.
3. Warm, pragmatic tone; avoid hype or fluff.

=== MULTI-TURN RULES ===
• **New negative statement →** produce a fresh reframe. 
• **Revision request (e.g. “shorter”, “try a different angle”) →** produce a new reframe.  
• **Clarification / challenge (e.g. “These sound naïve—why?”) →** reply in plain text, <100 words, explaining your reasoning.

Stay concise, follow these rules every turn.
`
} as const;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { text, conversationHistory = [] } = body;

    if (!text) {
      throw new APIError('No text provided', 400);
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new APIError('OpenAI API key is not configured', 500);
    }

    // Prepare conversation history
    const messages: Message[] = [
      {
        role: 'system',
        content: OPENAI_CONFIG.systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: text
      }
    ];

    // Call OpenAI API with o4-mini model
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages,
      temperature: OPENAI_CONFIG.temperature,
      max_tokens: OPENAI_CONFIG.max_tokens
    });

    const optimizedText = completion.choices[0]?.message?.content;
    
    if (!optimizedText) {
      throw new APIError('No response from OpenAI', 500);
    }

    return NextResponse.json({ 
      text: optimizedText,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: text },
        { role: 'assistant', content: optimizedText }
      ]
    });
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error('OpenAI API Error:', apiError);
    return NextResponse.json(
      { error: apiError.message }, 
      { status: apiError.statusCode }
    );
  }
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
} 