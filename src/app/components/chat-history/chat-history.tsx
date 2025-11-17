import { useEffect, useRef } from 'react';
import styles from '../../styles/Chat.module.scss';
import UserMessage from './user-message';
import AIMessage from './ai-message';
import { TextUIMessage } from '@/app/api/models/[path]/route';
import { Message } from '../role-play-chat';

interface ChatHistoryProps {
    messages: TextUIMessage[] | Message[];
}

const ChatHistory = ({ messages }: ChatHistoryProps) => {
    const chatHistoryBottom = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatHistoryBottom.current?.scrollIntoView();
    }, [messages]);

    /**
     * Checks if the given role is either 'user' or 'human'.
     *
     * @param role - The role to check.
     * @returns True if the role is 'user' or 'human', false otherwise.
     */
    const checkUserOrHuman = (role: string) => {
        return role === 'user' || role === 'human';
    };

    /**
     * Gets all text parts from a message and concatenates them into a single string.
     * @param message - The message object containing parts.
     * @returns A string containing all text parts concatenated.
     */
    const getAllMessageParts = (message: TextUIMessage | Message) => {
        if ('parts' in message) {
            return message.parts
                .map((part) => {
                    if (part.type === 'text') {
                        return part.text;
                    } else if (part.type == 'data-text') {
                        return part.data.message;
                    }
                })
                .join('');
        }
        return message.content;
    };

    return (
        <section className={styles.chatHistory}>
            <ul className="govuk-list">
                {messages.map((m, index) =>
                    checkUserOrHuman(m.role) ? (
                        <UserMessage key={index} content={getAllMessageParts(m)} />
                    ) : (
                        <AIMessage key={index} content={getAllMessageParts(m)} />
                    )
                )}
            </ul>
            <div ref={chatHistoryBottom} />
        </section>
    );
};

export default ChatHistory;
