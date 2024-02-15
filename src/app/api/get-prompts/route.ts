import { NextResponse } from 'next/server';

const appHost = process.env['AZURE_APP_HOST'];
const appKey = process.env['AZURE_APP_API_KEY'] || 'no-api-key';

/**
 * This function makes a GET request to retrieve prompts. 
 * 
 * @return {Response} The response object representing the result of the GET request.
 */
export const GET = async () => {
    try {
        const response = await fetch(appHost + 'prompts/', {
            headers: {
                cache: 'no-store',
                Authorization: appKey,
            },
        });
        // Check if the response is successful (status code 2xx)
        if (response.ok) {
            const prompts = await response.json();
            // Check if the response has JSON content type
            if (response.headers.get('content-type')?.includes('application/json')) {
                return NextResponse.json(prompts, { status: response.status });
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
};
