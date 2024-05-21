import styles from '../../styles/Chat.module.scss';

/**
 * Represents a user message in the chat history.
 */
interface UserMessageProps {
    /**
     * The content of the user message.
     */
    content: string;
}

/**
 * A component that renders a user message in the chat history.
 * @param {UserMessageProps} props - The props for the UserMessage component.
 * @returns {JSX.Element} - The rendered UserMessage component.
 */
const UserMessage = ({ content }: UserMessageProps) => {
    return (
        <li className={`${styles.listItem} ${styles.right}`}>
            <section className={styles.userMessage}>
                <div className={`${styles.icon} ${styles.user}`}></div>
                <div>
                    <p className={`${styles.message} ${styles.user}`}>{content}</p>
                    <p className={styles.from}>{'User'}</p>
                </div>
            </section>
        </li>
    );
};

export default UserMessage;
