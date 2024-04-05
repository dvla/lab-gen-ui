import useSWR, { mutate } from 'swr';
import { ChangeBody } from '../components/generator/change-result';

/**
 * Interface representing the body of the request
 */
/**
 * Interface for the body of a request.
 */
export interface Body {
    /**
     * The content of the request.
     */
    content?: string;

    /**
     * Variables for the request with a dynamic structure
     */
    variables?: any;

    /**
     * Provider for the model
     */
    provider?: string;

    /**
     * Variant for the model
     */
    variant?: string;

    /**
     * Prompt ID for the prompt type
     */
    promptId?: string;
    
    /**
     * File to upload
     */
    file?: string;

    /**
     * File content type
     */
    fileContentType?: string;
}

/**
 * Represents a model with provider, variant, description, and location.
 */
export interface Model {
    /**
     * The provider of the model.
     */
    provider: string;
    /**
     * The variant of the model.
     */
    variant: string;
    /**
     * The description of the model.
     */
    description: string;
    /**
     * The location of the model.
     */
    location: string;
}

/**
 * Options for SWR
 */
export const SWR_OPTIONS = {
    /**
     * Disable revalidation when the data is stale
     */
    revalidateIfStale: false,
    /**
     * Disable revalidation when the window comes into focus
     */
    revalidateOnFocus: false,
    /**
     * Disable revalidation when the window reconnects to the network
     */
    revalidateOnReconnect: false,
    /**
     * Number of times to retry on error
     */
    errorRetryCount: 0,
};

/**
 * Fetches data from the specified URL and handles any potential errors in the response.
 *
 * @param {string} url - The URL to fetch data from
 * @return {Promise<any>} A Promise that resolves to the JSON data from the response
 */
export const fetcher = (url: string) =>
    fetch(url).then(async (res) => {
        if (!res.ok) {
            const response = await res.json();
            const error = new Error(response.error);
            throw error;
        }
        return await res.json();
    });

/**
 * Custom hook to start a conversation.
 *
 * @param {string} body - The body of the conversation
 * @return {object} An object containing data, error, isLoading, and isValidating
 */
export const useStartConversation = (body: Body | null) => {
    const { data, error, isLoading, isValidating } = useSWR(
        body ? '/api/start-conversation' : null, // Conditional on body being present
        (url: string) =>
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }).then(async (res) => {
                if (!res.ok) {
                    const response = await res.json();
                    const error = new Error(response.error);
                    throw error;
                }

                return await res.text();
            }),
        {
            revalidateOnFocus: false,
            errorRetryCount: 0,
        }
    );

    return { data, error, isLoading, isValidating };
};

/**
 * Asynchronous generator function to fetch completion tokens from the server.
 *
 * @param {Body} body - the request body for the API call
 * @return {AsyncIterable<string>} an asynchronous iterable of completion tokens
 */
export async function* getCompletion(body: Body): AsyncIterable<{ token: string; conversationId: string | null }> {
    const res = await fetch('/api/start-conversation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    const conversationId = res.headers.get('x-conversation-id');

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No reader');
    const decoder = new TextDecoder();

    let done, value;
    while (!done) {
        ({ done, value } = await reader.read());
        if (done) return {conversationId};
        const token = decoder.decode(value);
        yield { token, conversationId };
    }
}

/**
 * Generates an async iterator to retrieve continue completion tokens from the server.
 *
 * @param {Body} body - the body of the request
 * @param {string} conversationId - the conversation ID
 * @return {AsyncIterable<string>} an async iterator of continue completion tokens
 */
export async function* getContinueCompletion(body: Body, conversationId: string): AsyncIterable<string> {
    const res = await fetch(`/api/continue-conversation?conversationId=${conversationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No reader');
    const decoder = new TextDecoder();

    let done, value;
    while (!done) {
        ({ done, value } = await reader.read());
        if (done) return;
        const token = decoder.decode(value);
        yield token;
    }
}

/**
 * Generates a custom hook to fetch conversation history data based on the conversation ID.
 *
 * @param {string} conversationId - The ID of the conversation to fetch history for.
 * @return {object} An object containing data, error, and loading state for the conversation history.
 */
export const useConversationHistory = (conversationId: string) => {
    const { data, error, isLoading } = useSWR(conversationId ?
        `/api/get-history?conversationId=${conversationId}` : null,
        fetcher,
        SWR_OPTIONS
      );
 
    return { data, error, isLoading };
}

/**
* Reloads the history for a specific conversation.
*
* @param {string} conversationId - The ID of the conversation to reload history for
* @return {void}
*/
export const reloadHistory = (conversationId: string) => {
    mutate(`/api/get-history?conversationId=${conversationId}`);
};