import { NextResponse } from 'next/server';

const appHost = process.env['AZURE_APP_HOST'];

/**
 * Perform a GET request to retrieve models from the server and handle the response.
 *
 * @return {Promise} A Promise that resolves with the fetched models data or rejects with an error.
 */
export async function GET() {
    try {
        const response = await fetch(appHost + 'models/', { cache: 'no-store' });
        if (response.ok) {
            const models = await response.json();
            return NextResponse.json(models, { status: response.status });
        } else {
            // Handle non-successful response (e.g., error status code)
            console.error('Error:', response.status, response.statusText);
            return Response.json({ error: 'Failed to fetch data' }, { status: response.status });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
