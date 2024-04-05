import { useEffect, useRef, useState } from 'react';
import { Body, Model, getCompletion } from '../lib/fetchers';
import { Variable } from '../components/generator/generator';

/**
 * Props for the useStream hook.
 */
interface UseStreamProps {
    /**
     * The list of variables to pass to the API.
     */
    variables?: Variable[];
    /**
     * The prompt type for the API.
     */
    promptType?: string;
    /**
     * The model (i.e. provider and variant) for the API.
     */
    model?: Model;
    /**
     * Base64 representation of the file
     */
    fileBase64?: string;

    /**
     * Type of the file
     */
    fileType?: string;
    /**
     * Function to update the history.
     * @param history - The new history
     */
    updateHistory?: (history: string, streamingFinished: boolean, conversationID: string | null) => void;
}

/**
 * The results from the useStream hook.
 */
interface UseStreamHelpers {
    /**
     * Indicates whether the streaming has finished or not.
     */
    streamingFinished: boolean;
    /**
     * Indicates whether the hook is currently loading or not.
     */
    isLoading: boolean;
    /**
     * The current data from the stream.
     */
    data: string | null;
    /**
     * Error messages from the stream if any
     */
    error: string | null;
    /**
     * The ID of the conversation
     */
    conversationId: string | null;
}

const useStream = ({
    model,
    promptType,
    variables,
    fileBase64,
    fileType,
    updateHistory,
}: UseStreamProps): UseStreamHelpers => {
    // Streamed result from the API
    const [data, setData] = useState<string | null>(null);
    // From the startConversation called until the first chunk of data received, isLoading is true
    const [isLoading, setIsLoading] = useState(false);
    // Set to true when startConversation is called,
    const streamingStarted = useRef(false);
    // Set to true when last chunk of data is received
    const [streamingFinished, setStreamingFinished] = useState(false);
    // Error message from the stream
    const [error, setError] = useState<string | null>(null);
    // ID of the conversation
    const [conversationId, setConversationId] = useState<string | null>(null);

    // useEffect to start conversation and handle streaming data
    useEffect((): any => {
        /**
         * Get the body of the data, including variables, provider, variant, and promptId.
         *
         * @return {Body} the body of the data
         */
        const getBody = () => {
            const body: Body = {};

            if (promptType) {
                body.promptId = promptType;
            }

            if (model) {
                body.provider = model.provider;
                body.variant = model.variant;
            }

            if (fileBase64 && fileType) {
                body.file = fileBase64;
                body.fileContentType = fileType;
            }

            if (variables) {
                body.variables = {};
                for (let v of variables) {
                    body.variables[v.id] = v.value;
                }
            }

            if (Object.keys(body).length === 0) {
                return null;
            }

            return body;
        };

        /**
         * A function that starts a conversation.
         */
        const startConversation = async () => {
            try {
                // Iterate through completion tokens and update data
                let allTokens = '';
                const body = getBody();
                if (body) {
                    streamingStarted.current = true;
                    setIsLoading(true);
                    // Initialize conversationId as null
                    let conversationId: string | null = null;
                    for await (const { token, conversationId: newConversationId } of getCompletion(body)) {
                        // Set conversationId if it's not already set
                        if (newConversationId && conversationId === null) {
                            setConversationId(newConversationId);
                        }
                        setIsLoading(false);
                        setData((d) => d ? d + token : token);
                        allTokens += token;
                        if (updateHistory) {
                            updateHistory(allTokens, false, newConversationId);
                            conversationId = newConversationId;
                        }
                    }
                    
                    // Set streaming finished flag
                    setStreamingFinished(true);
                    if (updateHistory) {
                        updateHistory(allTokens, true, conversationId);
                    }
                }
                else {
                    setIsLoading(false);
                    setStreamingFinished(true);
                }
            } catch (err) {
                setIsLoading(false);
                setStreamingFinished(true);
                if (err instanceof Error) {
                    setError(err.message);
                } else if (typeof err === 'string') {
                    setError(err);
                }
                console.log(err);
            }
        };
        // Check if streaming has not started and start conversation
        if (streamingStarted.current === false) {
            startConversation();
        }
    }, [promptType, variables, updateHistory, fileBase64, fileType, model, streamingFinished]);

    return {
        data,
        isLoading,
        streamingFinished,
        error,
        conversationId
    };
};

export default useStream;
