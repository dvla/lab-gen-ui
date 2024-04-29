import type { Session } from 'next-auth';
import { startCase, toLower } from 'lodash';
/**
 * Retrieves the business user email from the session object.
 *
 * @param {Session} session - The session object containing user information.
 * @return {string} The unique identifier for the business user.
 */
export const getBusinessUser = (session: Session): string => {
    return session?.user?.email?.split('@')[0] || '';
};

/**
 * Asynchronously reads the entire error stream from a Response object and returns it as a string.
 *
 * @param {ReadableStream<Uint8Array>} responseBody - The Response object to read the error stream from.
 * @return {Promise<string>} A Promise that resolves to the error stream as a string.
 */
export async function streamError(responseBody: ReadableStream<Uint8Array>): Promise<string> {
    const reader = responseBody.getReader();
    const decoder = new TextDecoder();
    let errorChunks = [];

    try {
        let readResult;
        do {
            readResult = await reader.read();
            if (readResult.done) break;
            errorChunks.push(readResult.value);
        } while (!readResult.done);
    } finally {
        reader.releaseLock();
    }

    let errorBodyString = errorChunks.map(chunk => decoder.decode(chunk)).join('');
    return errorBodyString;
}

/**
 * Converts a string to capital case.
 *
 * @param {string} str - The string to convert to capital case.
 * @return {string} The string in capital case.
 */
export const capitalCase = (str: string) => startCase(toLower(str));

export const TIMEZONE = 'Europe/London';
