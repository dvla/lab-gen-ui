import useSWR from 'swr';

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
export async function* getCompletion(body: Body) {
    const res = await fetch('/api/start-conversation', {
        method: 'POST',
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
