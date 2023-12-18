import { StreamingTextResponse } from 'ai';
import { auth } from '@/app/lib/auth';
import type { NextApiResponse } from 'next';

const appHost = process.env['AZURE_APP_HOST'];
const appKey = process.env['AZURE_APP_API_KEY'] || 'no-api-key';

export const POST = async (req: Request, { params }: { params: { path: string } }, res: NextApiResponse) => {
    const session = await auth();
    if (session?.user) {
        const userEmail = session.user.email?.split('@')[0] as string;
        try {
            const path = params.path || 'chat';
            const requestBody = await req.json();
            const response = await fetch(appHost + path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-business-user': userEmail,
                    Authorization: appKey,
                },
                body: JSON.stringify(requestBody),
            });

            // Check if the response is successful (status code 2xx)
            if (response.ok) {
                // Check if the response has JSON content type
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const data = await response.json();
                    return Response.json(data);
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

    return Response.json({ message: 'Not authenticated' }, { status: 401 });
};
