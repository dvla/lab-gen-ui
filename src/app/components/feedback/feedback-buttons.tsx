import styles from '../../styles/Feedback.module.scss';
import { ResponseHistory } from '../generator/generator';

interface FeedbackButtonsProps {
    item: ResponseHistory;
    promptType?: string;
}

const SCORE_API = '/api/models/scores';
const POSITIVE_SCORE = 1;
const NEGATIVE_SCORE = 0;

/**
 * Renders a set of feedback buttons.
 *
 * @component
 * @param {object} item - The item object.
 * @param {string} promptType - The prompt type.
 * @returns {JSX.Element} The rendered component.
 */
const FeedbackButtons = ({ item, promptType }: FeedbackButtonsProps) => {
    /**
     * Adds a positive or negative score to the result.
     *
     * @param score - The score to be added.
     */
    const addScore = (score: number) => {
        const body = {
            name: promptType,
            value: score,
            conversationId: item.conversationId,
        };

        fetch(SCORE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    };

    return (
        <>
            <div className={styles.feedbackButton} onClick={() => addScore(POSITIVE_SCORE)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M20.22 9.55c-.43-.51-1.05-.8-1.72-.8h-4.03V6c0-1.52-1.23-2.75-2.83-2.75c-.7 0-1.33.42-1.61 1.07l-2.54 5.93H5.62c-1.31 0-2.37 1.06-2.37 2.37v5.77c0 1.3 1.07 2.36 2.37 2.36h11.56c1.09 0 2.02-.78 2.21-1.86l1.32-7.5c.11-.66-.07-1.33-.5-1.84Zm-14.6 9.7c-.48 0-.87-.39-.87-.86v-5.77c0-.48.39-.87.87-.87h1.61v7.5zm12.3-.62c-.06.36-.37.62-.74.62H8.74v-8.1l2.67-6.25c.04-.09.13-.16.32-.16c.69 0 1.24.56 1.24 1.25v4.25h5.53c.23 0 .43.09.57.26s.2.39.16.62l-1.32 7.5Z"
                    />
                </svg>
            </div>
            <div className={`${styles.feedbackButton} ${styles.red}`} onClick={() => addScore(NEGATIVE_SCORE)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M18.38 3.25H6.81c-1.09 0-2.02.78-2.21 1.86l-1.31 7.5c-.11.66.07 1.33.49 1.84c.43.51 1.05.8 1.72.8h4.03V18c0 1.52 1.23 2.75 2.83 2.75c.7 0 1.33-.42 1.61-1.07l2.54-5.93h1.88c1.31 0 2.37-1.06 2.37-2.37V5.61c0-1.3-1.06-2.36-2.37-2.36Zm-3.12 9.6l-2.67 6.25c-.04.09-.13.16-.32.16c-.69 0-1.24-.56-1.24-1.25v-4.25H5.5c-.23 0-.43-.09-.57-.26a.72.72 0 0 1-.16-.62l1.31-7.5c.06-.36.37-.62.74-.62h8.44zm3.99-1.47c0 .48-.39.87-.87.87h-1.61v-7.5h1.61c.48 0 .87.39.87.86z"
                    />
                </svg>
            </div>
        </>
    );
};

export default FeedbackButtons;
