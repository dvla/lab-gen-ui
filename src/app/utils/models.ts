import OpenAI from 'openai';

let openaiClient: OpenAI;

export const getClient = () => {
    if (!openaiClient) {
        const model = process.env['AZURE_DEPLOYMENT'];
        const resource = process.env['AZURE_OPENAI_ENDPOINT'];
        const apiVersion = process.env['OPENAI_API_VERSION'];
        const apiKey = process.env['AZURE_OPENAI_API_KEY'];

        if (!apiKey) {
            throw new Error('The AZURE_OPENAI_API_KEY environment variable is missing or empty.');
        }
        console.log("Creating Client");
        openaiClient = new OpenAI({
            apiKey,
            baseURL: `${resource}/openai/deployments/${model}`,
            defaultQuery: { 'api-version': apiVersion },
            defaultHeaders: { 'api-key': apiKey },
        });
    }
    return openaiClient;
};
