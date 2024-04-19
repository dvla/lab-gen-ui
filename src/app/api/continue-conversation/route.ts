import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { StreamingTextResponse } from 'ai';
import { getBusinessUser, streamError } from '@/app/lib/utils';

const appHost = process.env['AZURE_APP_HOST'];
const appKey = process.env['AZURE_APP_API_KEY'] || 'no-api-key';

/**
 * Function to handle PUT requests. This function authenticates the session, retrieves necessary data from the request, 
 * sends a PUT request to update a conversation, processes the response, and returns the appropriate NextResponse.
 *
 * @param {NextRequest} req - The request object containing information about the request
 * @return {NextResponse} The response object based on the processing of the request
 */
export const PUT = async (req: NextRequest) => {
    const session = await auth();
    const url = new URL(req.url);
    const conversationId = url.searchParams.get('conversationId');
    if (session?.user) {
        try {
            const body = await req.json();
            const response = await fetch(appHost +`conversations/${conversationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-business-user': getBusinessUser(session),
                    Authorization: appKey,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const headers = {
                    'Content-Type': 'application/json',
                    'x-conversation-id': ''
                };
                
                // If the conversation-id header is present, add it to the headers
                if (conversationId) {
                    headers['x-conversation-id'] = conversationId;
                }

                // Check if the response has JSON content type
                if (response.headers.get('content-type')?.includes('application/json')) {
                    return new NextResponse(JSON.stringify(await response.json()), {
                        status: response.status,
                        headers: headers,
                    });
                } else {
                    // If not JSON, stream the response
                    if (response.body) {
                        const streamingResponse = new StreamingTextResponse(response.body);
                        if (conversationId) {
                            streamingResponse.headers.set('x-conversation-id', conversationId);
                        }
                        return streamingResponse;
                    } else {
                        return new Response();
                    }
                }
            } else {
                if (response.body) {
                    const errorBodyString = await streamError(response.body);
                    return NextResponse.json({ error: errorBodyString }, { status: response.status });
                }
                else {
                    return new NextResponse('Error in continuing the conversation', { status: response.status });
                }
            }
        } catch (error) {
            console.error('Failed to continue conversation', error);
            return new NextResponse('Internal Server Error', { status: 500 });
        }
    } else {
        return new NextResponse('Unauthorized', { status: 401 });
    }
};