import { NextRequest, NextResponse } from 'next/server';
import { mockOpenAIStream } from '@/lib/mocks';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

export const runtime = 'edge';

export const POST = withErrorHandling(async (req: NextRequest): Promise<NextResponse> => {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
        throw ApiError.badRequest('Invalid messages format. Expected an array of messages');
    }

    // Use mock if not in production
    const response = await mockOpenAIStream(messages);

    let fullResponse = '';
    for await (const chunk of response) {
        fullResponse += chunk;
    }

    return createSuccessResponse({ response: fullResponse });
});
