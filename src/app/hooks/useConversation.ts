import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '../lib/fetchers';

interface Message {
    role: string;
    content: string;
}

interface UseConversationProps {
    conversationId: string;
}

interface UseConversationHelpers {
    messages: Message[];
    sendMessage: (message: string) => void;
}

/**
 * Generate a custom hook to manage conversation state and history.
 *
 * @param {UseConversationProps} conversationId - The ID of the conversation to retrieve history for.
 * @return {UseConversationHelpers} An object containing messages state and sendMessage function.
 */
const useConversation = ({ conversationId }: UseConversationProps): UseConversationHelpers => {
    const { data, error } = useSWR(
        conversationId ? `/api/get-history?conversationId=${conversationId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            errorRetryCount: 0,
        }
    );
    const [messages, setMessages] = useState<Message[]>([]);

    //Get Conversation History on initial render
    useEffect(() => {
        if (data) {
            setMessages(data);
        }
    }, [data]);
    //Handle submit to send a new message. Add message and response to messages
    const sendMessage = (message: string) => {
        console.log(message);
        setMessages([...messages, { role: 'human', content: message }]);
    };

    return {
        messages: messages,
        sendMessage,
    };
};

export default useConversation;
