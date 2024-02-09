import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { StreamingTextResponse } from 'ai';

const appHost = process.env['AZURE_APP_HOST'];
const appKey = process.env['AZURE_APP_API_KEY'] || 'no-api-key';

export const POST = async (req: NextRequest) => {
    const session = await auth();
    if (session?.user) {
        const userEmail = session.user.email?.split('@')[0] as string;
        try {
            const body = await req.json();
            const response = await fetch(appHost + 'conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-business-user': userEmail,
                    Authorization: appKey,
                },
                body: JSON.stringify(body),
            });
            // Check if the response is successful (status code 2xx)
            if (response.ok) {
                // Check if the response has JSON content type
                if (response.headers.get('content-type')?.includes('application/json')) {
                    return NextResponse.json({ result: response.body }, { status: response.status });
                } else {
                    // If not JSON, stream the response
                    if (response.body) {
                        return new StreamingTextResponse(response.body);
                    } else {
                        return new Response();
                    }
                }
            } else {
                // Handle non-successful response (e.g., error status code)
                console.error('Error:', response.status, response.statusText);
                return Response.json({ error: 'Failed to fetch data' }, { status: response.status });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return Response.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
};
