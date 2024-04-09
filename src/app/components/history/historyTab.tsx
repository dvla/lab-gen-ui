import React from 'react';
import styles from '../../styles/History.module.scss';

interface HistoryTabProps {
    history: Message[] | undefined;
    streamingFinished: boolean;
    copyToClipboard: (text: string | null) => void;
    previewHistoricResult: (text: string | null) => void;
    UseDeleteHistoryEntries: (num_entries: number) => void;
}

interface Message {
    role: 'human' | 'ai';
    content: string;
}

const LARGE_USER_MESSAGE_LENGTH = 65;
const LARGE_AI_MESSAGE_LENGTH = 85;

/**
 * Renders the chat history with human and AI messages in a visually appealing manner.
 *
 * @param {HistoryTabProps} history - The array of chat messages.
 * @param {boolean} streamingFinished - Indicates if the streaming session has finished.
 * @param {Function} copyToClipboard - A function to copy text to the clipboard.
 * @param {Function} previewHistoricResult - A function to preview the historic result
 * @param {Function} UseDeleteHistoryEntries - A function to delete the historic result
 * @return {JSX.Element} The JSX element representing the chat history section.
 */
const HistoryTab = ({
    history,
    streamingFinished,
    copyToClipboard,
    previewHistoricResult,
    UseDeleteHistoryEntries,
}: HistoryTabProps) => {
    return (
        <section>
            {streamingFinished && history && (
                <table className="govuk-table">
                    <colgroup>
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '55%' }} />
                        <col style={{ width: '15%' }} />
                    </colgroup>
                    <thead className="govuk-table__head">
                        <tr className="govuk-table__row">
                            <th scope="col" className="govuk-table__header">
                                User
                            </th>
                            <th scope="col" className="govuk-table__header">
                                AI
                            </th>
                            <th scope="col" className="govuk-table__header"></th>
                        </tr>
                    </thead>
                    <tbody className="govuk-table__body">
                        {history.map((message, index) => {
                            if (message.role === 'human') {
                                let aiMessageIndex = history.slice(index + 1).findIndex((m) => m.role === 'ai');
                                let aiMessage = aiMessageIndex !== -1 ? history[index + 1 + aiMessageIndex] : null;

                                let numEntriesToDelete =
                                    history.slice(index + 1 + aiMessageIndex).filter((m) => m.role === 'ai').length - 1;
                                return (
                                    <tr className="govuk-table__row" key={`${index}-pair`}>
                                        <th scope="row" className="govuk-table__header">
                                            {message.content.length > LARGE_USER_MESSAGE_LENGTH
                                                ? message.content.slice(0, LARGE_USER_MESSAGE_LENGTH) + '...'
                                                : message.content}

                                            {message.content.length > LARGE_USER_MESSAGE_LENGTH && (
                                                <details className="govuk-details">
                                                    <summary
                                                        className={"govuk-details__summary" + ' ' + styles.userSummary}
                                                    >
                                                        {'View full message'}
                                                    </summary>
                                                    <div className="govuk-details__text">{message.content}</div>
                                                </details>
                                            )}
                                        </th>
                                        <td className="govuk-table__cell">
                                            {aiMessage ? (
                                                <>
                                                    <details className="govuk-details">
                                                        <summary className="govuk-details__summary">
                                                            {aiMessage.content.slice(0, LARGE_AI_MESSAGE_LENGTH) +
                                                                '...'}
                                                        </summary>
                                                        <div className="govuk-details__text">
                                                            {aiMessage.content}
                                                            <div>
                                                                <button
                                                                    className={
                                                                        'govuk-button govuk-button--secondary' +
                                                                        ' ' +
                                                                        styles.copyButton
                                                                    }
                                                                    onClick={() =>
                                                                        copyToClipboard(aiMessage?.content ?? null)
                                                                    }
                                                                >
                                                                    Copy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </details>
                                                </>
                                            ) : null}
                                        </td>
                                        <td className="govuk-table__cell">
                                            {aiMessage ? (
                                                <div className={styles.historyTable}>
                                                    {numEntriesToDelete == 0 ? (
                                                        <strong className="govuk-tag">Current</strong>
                                                    ) : (
                                                        <a
                                                            href="#"
                                                            className={"govuk-link govuk-link--no-visited-state" + ' ' + styles.previewButton}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                previewHistoricResult(aiMessage?.content ?? null);
                                                            }}
                                                        >
                                                            Preview
                                                        </a>
                                                    )}
                                                    {numEntriesToDelete > 0 && (
                                                        <a
                                                            className="govuk-link govuk-link--no-visited-state"
                                                            href="#history"
                                                            onClick={() => UseDeleteHistoryEntries(numEntriesToDelete)}
                                                        >
                                                            Rewind
                                                        </a>
                                                    )}
                                                </div>
                                            ) : null}
                                        </td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default HistoryTab;
