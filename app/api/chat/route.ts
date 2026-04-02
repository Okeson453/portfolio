import { NextRequest, NextResponse } from 'next/server';
import { mockOpenAIStream } from '@/lib/mocks';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Invalid messages format' },
                { status: 400 }
            );
        }

        // Use mock if not in production
        const lastMessage = messages[messages.length - 1]?.content;
        const response = await mockOpenAIStream(messages);

        let fullResponse = '';
        for await (const chunk of response) {
            fullResponse += chunk;
        }

        return NextResponse.json({ response: fullResponse });
    } catch (err) {
        console.error('[/api/chat]', err);
        return NextResponse.json(
            { error: 'Chat failed' },
            { status: 500 }
        );
    }
}
