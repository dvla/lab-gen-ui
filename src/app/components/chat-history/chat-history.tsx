import { useEffect, useRef } from 'react';
import styles from '../../styles/Chat.module.scss';
import { Message } from '../role-play-chat';
import UserMessage from './user-message';
import AIMessage from './ai-message';

interface ChatHistoryProps {
    messages: Message[];
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

    return (
        <section className={styles.chatHistory}>
            <ul className="govuk-list">
                {messages.map((m, index) =>
                    checkUserOrHuman(m.role) ? <UserMessage key={index} content={m.content} /> : <AIMessage key={index} content={m.content} />
                )}
            </ul>
            <div ref={chatHistoryBottom} />
        </section>
    );
};

export default ChatHistory;