import useSWR, { mutate } from 'swr';
import { ModelFamily } from '../config/model-context-config';

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
     * The unique key for the model
     */
    modelKey?: string;

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
     * The family of the model.
     */
    family: ModelFamily;
    /**
     * The description of the model.
     */
    description: string;
    /**
     * The location of the model.
     */
    location: string;
    /**
     * The unique identifier for the model.
     */
    key: string;
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
 * Asynchronous generator function to fetch completion tokens from the server.
 *
 * @param {Response} res - the response object from the API call
 * @param {string | null} conversationId - the conversation ID
 * @return {AsyncIterable<{ token: string; conversationId: string | null }>} an async iterable of completion tokens
 */
async function* streamTokens(
    res: Response,
    conversationId: string | null
): AsyncIterable<{ token: string; conversationId: string | null }> {
    if (!res.ok) {
        const response = await res.json();
        const error = new Error(response.error || 'Request failed');
        throw error;
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No reader');
    const decoder = new TextDecoder();

    try {
        let readResult;
        do {
            readResult = await reader.read();
            if (readResult.done) break;
            const token = decoder.decode(readResult.value, { stream: true });
            yield { token, conversationId };
        } while (!readResult.done);
    } catch (error) {
        console.error('Error processing stream:', error);
    } finally {
        reader.releaseLock();
    }
}

/**
 * Asynchronous generator function to fetch completion tokens from the server.
 *
 * @param {Body} body - the request body for the API call
 * @return {AsyncIterable<{ token: string; conversationId: string | null }>} an async iterable of completion tokens
 */
export async function* getCompletion(
    body: Body,
    url = '/api/gen/conversations'
): AsyncIterable<{ token: string; conversationId: string | null }> {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const conversationId = res.headers.get('x-conversation-id');

    yield* streamTokens(res, conversationId);
}

/**
 * Generates an async iterator to retrieve continue completion tokens from the server.
 *
 * @param {Body} body - the body of the request
 * @param {string} conversationId - the conversation ID
 * @return {AsyncIterable<string>} an async iterator of continue completion tokens
 */
export async function* getContinueCompletion(body: Body, conversationId: string): AsyncIterable<string> {
    const res = await fetch(`/api/gen/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    for await (const { token } of streamTokens(res, conversationId)) {
        yield token;
    }
}

/**
 * Asynchronous function that deletes conversation history entries.
 *
 * @param {string | null} conversationId - The ID of the conversation
 * @param {number} numEntries - The number of entries to delete
 * @return {Promise<void>} A Promise that resolves when the history entries are deleted
 */
export const useDeleteConversationHistoryEntries = async (conversationId: string | null, numEntries: number) => {
    if (conversationId) {
        const response = await fetch(
            `/api/delete-history-entry?conversationId=${conversationId}&numEntries=${numEntries}`,
            {
                method: 'DELETE',
            }
        );

        mutate(`/api/get-history?conversationId=${conversationId}`);

        if (!response.ok) {
            const error = new Error('Failed to delete history entries');
            throw error;
        }
    } else {
        const error = new Error('No conversation ID provided');
        throw error;
    }
};

/**
 * Generates a custom hook to fetch conversation history data based on the conversation ID.
 *
 * @param {string} conversationId - The ID of the conversation to fetch history for.
 * @return {object} An object containing data, error, and loading state for the conversation history.
 */
export const useConversationHistory = (conversationId: string) => {
    const { data, error, isLoading } = useSWR(
        conversationId ? `/api/get-history?conversationId=${conversationId}` : null,
        fetcher,
        SWR_OPTIONS
    );

    return { data, error, isLoading };
};

/**
 * Reloads the history for a specific conversation.
 *
 * @param {string} conversationId - The ID of the conversation to reload history for
 * @return {void}
 */
export const reloadHistory = (conversationId: string) => {
    mutate(`/api/get-history?conversationId=${conversationId}`);
};
