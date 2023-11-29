import { Message, useChat } from 'ai/react';
import styles from '../styles/Chat.module.scss';
import { useEffect, useRef } from 'react';
import { ErrorSummary } from 'govuk-react';

const DEFAULT_ROWS = 2;
const DEFAULT_SHOW_HISTORY = true;

/**
 * Represents the body of a chat.
 */
export interface ChatBody {
    /**
     * The name of the model.
     */
    modelName: string;
}

/**
 * The props for the Chat component.
 */
interface ChatProps {
    /**
     * Determines whether to show the chat history or not.
     */
    showHistory?: boolean;

    /**
     * A callback function that is called when a message is sent in the chat.
     * @param message The message sent in the chat.
     */
    onMessage?: (message: string) => void;

    /**
     * The initial messages to display in the chat.
     */
    initialMessages?: Message[];

    /**
     * The body of the chat.
     */
    body?: ChatBody;

    /**
     * The placeholder text for the chat input.
     */
    placeholder?: string;

    /**
     * The number of rows to show in chat input
     */
    rows?: number;

    /**
     * A callback function that is called to check when the response has finished loading
     * @param isLoading True or false depending on if the response has finished loading
     */
    messageLoading?: (isLoading: boolean) => void;
}

/**
 * Renders a chat component with a chat history, input form, and error section.
 *
 * @param {Object} props - The props for the Chat component.
 * @param {boolean} props.showHistory - Determines if the chat history should be displayed.
 * @param {Function} props.onMessage - Callback function to handle new chat messages.
 * @param {Array} props.initialMessages - An array of initial chat messages.
 * @param {string} props.body - The body of the chat component.
 * @param {string} props.placeholder - The placeholder text for the chat input.
 * @param {Function} props.messageLoading - Callback function to handle loading state.
 */
const Chat = ({
    showHistory = DEFAULT_SHOW_HISTORY,
    onMessage,
    initialMessages,
    body,
    placeholder,
    rows = DEFAULT_ROWS,
    messageLoading,
}: ChatProps) => {
    const { messages, input, error, handleInputChange, handleSubmit, isLoading } = useChat({
        onFinish: (message) => {
            if (onMessage) {
                onMessage(message.content);
            }

            if (messageLoading) {
                messageLoading(isLoading);
            }
        },
        initialMessages,
        body,
    });
    const chatHistoryBottom = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom of the chat history
        chatHistoryBottom.current?.scrollIntoView();
        if (messageLoading) {
            messageLoading(isLoading);
        }
    }, [messages, isLoading, messageLoading]);

    return (
        <>
            {/* Error Message */}
            {error != null && (
                <section id="errorSection">
                    <ErrorSummary heading="There was an error" errors={[{ text: (error as any).toString() }]} />
                </section>
            )}
            {/* Chat History */}
            {showHistory && (
                <section className={styles.chatHistory}>
                    <ul className="govuk-list">
                        {messages.map((m) => (
                            <li
                                className={styles.listItem + ' ' + (m.role === 'user' ? styles.right : styles.left)}
                                key={m.id}
                            >
                                <section className={m.role === 'user' ? styles.userMessage : styles.aiMessage}>
                                    <div
                                        className={styles.icon + ' ' + (m.role === 'user' ? styles.user : styles.ai)}
                                    ></div>
                                    <div>
                                        <p
                                            className={
                                                styles.message + ' ' + (m.role === 'user' ? styles.user : styles.ai)
                                            }
                                        >
                                            {m.content}
                                        </p>
                                        <p className={styles.from}>{m.role === 'user' ? 'User' : 'AI'}</p>
                                    </div>
                                </section>
                            </li>
                        ))}
                    </ul>
                    <div ref={chatHistoryBottom} />
                </section>
            )}
            {/* Chat Input */}
            <div className={'govuk-form-group ' + styles.formGroup}>
                <form onSubmit={handleSubmit} id="chat-form">
                    {!showHistory && (
                        <label className="govuk-label" htmlFor="chat-input">
                            {placeholder}
                        </label>
                    )}
                    <div className={styles.chatFormFieldInline}>
                        <textarea
                            value={input}
                            onChange={handleInputChange}
                            className={'govuk-textarea ' + styles.textArea}
                            id="chat-input"
                            name="chatInput"
                            rows={rows}
                            aria-describedby="chat-input-hint"
                            placeholder={showHistory ? placeholder : ''}
                            form="chat-form"
                        ></textarea>
                        <button className="govuk-button" data-module="govuk-button" type="submit">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Chat;