import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { getBusinessUser } from '@/app/lib/utils';

const appHost = process.env['AZURE_APP_HOST'];
const appKey = process.env['AZURE_APP_API_KEY'] || 'no-api-key';

/**
 * Authenticate the user and then perform a GET request to retrieve the message history for a given conversation.
 *
 * @param {string} conversationId - The ID of the conversation to get the history for.
 * @return {Promise} A Promise that resolves with the fetched message history data or rejects with an error.
 */
export const GET = async (request: Request) => {
    // Authenticate the user and get their session
    const session = await auth();

    // Extract the conversation ID from the request URL
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');

    if (session?.user) {
        try {
            const response = await fetch(`${appHost}conversations/${conversationId}/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-business-user': getBusinessUser(session),
                    Authorization: appKey,
                },
                cache: 'no-store',
            });

            if (response.ok) {
                const history = await response.json();
                return NextResponse.json(history, { status: response.status });
            } else {
                // Handle non-successful response
                console.error('Error fetching message history:', response.status, response.statusText);
                return NextResponse.json(
                    { error: 'Failed to fetch conversation history' },
                    { status: response.status }
                );
            }
        } catch (error) {
            console.error('Error fetching conversation history:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    } else {
        // Handle case where user is not authenticated or session is not available
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
};
