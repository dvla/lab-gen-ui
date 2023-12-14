import { Message, useChat } from 'ai/react';
import styles from '../styles/Chat.module.scss';
import { useEffect, useRef } from 'react';
import { ErrorSummary } from 'govuk-react';

const DEFAULT_ROWS = 2;
const DEFAULT_INITIAL_MESSAGES_LENGTH = 3;
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
     * A callback function that is called when a message is needed after an undo action from the chat history.
     * @param message The message sent in the chat.
     */
    onUndo?: (message: string) => void;

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
     * Determines whether an undo message was requested.
     */
    undoMessageRequested?: boolean;

    /**
     * A callback function that is called to check when the response has finished loading
     * @param isLoading True or false depending on if the response has finished loading
     */
    messageLoading?: (isLoading: boolean) => void;

    /**
     * The edited latest message
     */
    editedLatestMessage?: string;

    /**
     * Reset the chat to the initial prompt
     */
    resetChat?: boolean;
}

/**
 * Renders a chat component with a chat history, input form, and error section.
 *
 * @param {Object} props - The props for the Chat component.
 * @param {boolean} props.showHistory - Determines if the chat history should be displayed.
 * @param {Function} props.onMessage - Callback function to handle new chat messages.
 * @param {Function} props.onUndo - Callback function to handle the previous message after undo.
 * @param {Array} props.initialMessages - An array of initial chat messages.
 * @param {string} props.body - The body of the chat component.
 * @param {string} props.placeholder - The placeholder text for the chat input.
 * @param {number} props.rows - The number of rows to show in the chat input.
 * @param {boolean} props.undoMessageRequested - Whether an undo message was requested.
 * @param {Function} props.messageLoading - Callback function to handle loading state.
 * @param {string} props.editedLatestMessage - The edited latest message
 * @param {boolean} props.resetChat - Reset the chat to the initial prompt
 */
const Chat = ({
    showHistory = DEFAULT_SHOW_HISTORY,
    onMessage,
    onUndo,
    initialMessages,
    body,
    placeholder,
    rows = DEFAULT_ROWS,
    undoMessageRequested,
    messageLoading,
    editedLatestMessage,
    resetChat,
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

    useEffect(() => {
        if (undoMessageRequested) {
            //When undo message is requested, remove the last two messages as long it is not the initial AI response
            if (messages.length > DEFAULT_INITIAL_MESSAGES_LENGTH) {
                messages.pop();
                messages.pop();
                onUndo?.(messages[messages.length - 1].content);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [undoMessageRequested, onUndo]);

    // Set the latest message to the new edited message
    useEffect(() => {
        if(editedLatestMessage) {
            messages[messages.length - 1].content = editedLatestMessage
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editedLatestMessage]);

    // Reset the chat to the initial prompt
    useEffect(() => {
        if (resetChat) {
            messages.splice(0);
            if (initialMessages) {
                for (let i = 0; i < initialMessages.length; i++) {
                  messages.push(initialMessages[i]);
                }
              }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetChat, initialMessages]);

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
