import OpenAI from 'openai';

// Map of cached OpenAI clients
const openaiClients = new Map();

/**
* Returns the OpenAI client for the specified model name.
*
* @param {string} modelName - The name of the model. If not provided, the default model will be used.
* @return {OpenAI} The OpenAI client.
*/
export const getClient = (modelName = 'DEFAULT') => {
    let client = openaiClients.get(modelName);
    if (client) {
        return client;
    }

    // Create client for the specified model
    const deployment = process.env[`AZURE_DEPLOYMENT_${modelName}`] || 'gpt-turbo-default';
    console.log(`Model name is ${modelName} and deployment is ${deployment}`);
    const resource = process.env['AZURE_OPENAI_ENDPOINT'];
    const apiVersion = process.env['OPENAI_API_VERSION'];
    const apiKey = process.env['AZURE_OPENAI_API_KEY'];

    if (!apiKey) {
        throw new Error('The AZURE_OPENAI_API_KEY environment variable is missing or empty.');
    }
    client = new OpenAI({
        apiKey,
        baseURL: `${resource}/openai/deployments/${deployment}`,
        defaultQuery: { 'api-version': apiVersion },
        defaultHeaders: { 'api-key': apiKey },
    });
    openaiClients.set(modelName, client);
    return client;
};
