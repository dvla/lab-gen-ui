import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { getBusinessUser } from '@/app/lib/utils';

const appHost = process.env['AZURE_APP_HOST'];
const appKey = process.env['AZURE_APP_API_KEY'] || 'no-api-key';

/**
 * Authenticate the user and then perform a DELETE request to delete a number of entries from the message history for a given conversation.
 *
 * @param {string} conversationId - The ID of the conversation from which to delete the history entries.
 * @param {number} numEntries - The number of entries to delete.
 * @return {Promise} A Promise that resolves with the result of the deletion operation or rejects with an error.
 */
export const DELETE = async (request: Request) => {
    // Authenticate the user and get their session
    const session = await auth();

    // Extract the conversation ID and the number of entries to delete from the request URL
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');
    const numEntries = url.searchParams.get('numEntries');

    if (session?.user && conversationId && numEntries) {
        try {
            const response = await fetch(`${appHost}conversations/${conversationId}/history/${numEntries}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-business-user': getBusinessUser(session),
                    Authorization: appKey,
                }
            });

            if (response.ok) {
                return NextResponse.json({ message: 'History entries deleted successfully' }, { status: response.status });
            } else {
                // Handle non-successful response
                console.error('Error deleting history entries:', response.status, response.statusText);
                return NextResponse.json({ error: 'Failed to delete history entries' }, { status: response.status });
            }
        } catch (error) {
            console.error('Error deleting history entries:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    } else {
        // Handle case where user is not authenticated, session is not available, or required parameters are missing
        return NextResponse.json({ error: 'Authentication required and/or missing parameters' }, { status: 401 });
    }
};