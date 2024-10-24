import styles from '../../styles/Chat.module.scss';

/**
 * Represents a message from the AI in the chat history.
 */
interface AIMessageProps {
    /**
     * The content of the AI message.
     */
    content: string;
}

/**
 * Renders a message from the AI in the chat history.
 * @param content - The content of the AI message.
 * @returns The rendered AI message component.
 */
const AIMessage = ({ content }: AIMessageProps) => {
    return (
        <li className={`${styles.listItem} ${styles.left}`}>
            <section className={styles.aiMessage}>
                <div className={`${styles.icon} ${styles.ai}`}></div>
                <div>
                    <p className={`${styles.message} ${styles.ai}`}>{content}</p>
                    <p className={styles.from}>{'AI'}</p>
                </div>
            </section>
        </li>
    );
};

export default AIMessage;
