import { useCallback, useEffect, useRef, useState } from 'react';
import { Model, getContinueCompletion } from '../lib/fetchers';
import styles from '../styles/Chat.module.scss';
import useStream from '../hooks/useStream';
import { Spinner } from 'govuk-react';
import rolePlayStyles from '../styles/RolePlay.module.scss';
import ChatHistory from './chat-history/chat-history';

/**
 * Represents a chat message.
 */
export interface Message {
    role: string; // The role of the message (e.g. 'human' or 'ai')
    content: string; // The content of the message
}

/**
 * Props for the RolePlayChat component.
 */
interface RolePlayChatProps {
    modelInfo: Model;
    content: string;
    reset: () => void;
}

/**
 * Represents a role-play chat component.
 * @param modelInfo The model information.
 * @param content The content to use in the chat.
 * @param reset The reset function.
 */
const RolePlayChat = ({ modelInfo, content, reset }: RolePlayChatProps) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const streamingStarted = useRef(false);
    const { conversationId } = useStream({
        model: modelInfo,
        content: content,
    });

    /**
     * Handles the input change event for the text area.
     *
     * @param event - The change event object.
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    /**
     * Handles the change event when the user inputs a message.
     * Adds the user's message to the messages array and clears the input field.
     * Calls the getContinueCompletion function to generate AI responses based on the user's input.
     * Updates the messages array with the AI responses.
     *
     * @param {Event} event - The change event object.
     */
    const change = useCallback(
        async (event: any) => {
            event.preventDefault();
            setMessages((m) => [...m, { role: 'human', content: input }]);
            setInput('');

            try {
                if (conversationId) {
                    let allTokens = '';
                    streamingStarted.current = true;
                    setMessages((m) => [...m, { role: 'ai', content: '' }]);
                    for await (const token of getContinueCompletion({ content: input }, conversationId)) {
                        allTokens += token;

                        setMessages((m) => {
                            const newMessages = [...m];
                            newMessages[m.length - 1] = { role: 'ai', content: allTokens };
                            return newMessages;
                        });
                    }
                }
            } catch (error) {
                let errorMessage = '';
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }
            }
        },
        [conversationId, input]
    );

    return (
        <>
            {!conversationId && <Spinner fill="#b1b4b6" height="56px" width="56px" />}
            {conversationId && (
                <>
                    <ChatHistory messages={messages} />
                    <div className={'govuk-form-group ' + styles.formGroup}>
                        <form onSubmit={change} id="chat-form">
                            <div className={styles.chatFormFieldInline}>
                                <textarea
                                    value={input}
                                    onChange={handleInputChange}
                                    className={'govuk-textarea ' + rolePlayStyles.marginBottomTen}
                                    id="chat-input"
                                    name="chatInput"
                                    rows={4}
                                    aria-describedby="chat-input-hint"
                                    placeholder={'Start by asking "How can I help you today?"'}
                                    form="chat-form"
                                ></textarea>
                                <button className="govuk-button" data-module="govuk-button" type="submit">
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className={`govuk-button-group ${rolePlayStyles.marginBottomZero}`}>
                        <button
                            className={`govuk-button govuk-button--secondary ${rolePlayStyles.marginZero}`}
                            onClick={reset}
                        >
                            Reset
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default RolePlayChat;
