import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import jiraStyles from '../../styles/Jira.module.scss';
import changeResultStyles from '../../styles/ChangeResult.module.scss';
import { Spinner } from 'govuk-react';
import { getContinueCompletion, reloadHistory } from '@/app/lib/fetchers';
import Mermaid from '@/app/diagrams/mermaid';
import Error from '@/app/components/error';
import GherkinValidate from '../gherkinvalidate';

interface ChangeResultProps {
    conversationId: string | null;
    lastResult: string;
    promptType: string;
    hasChanged: () => void;
    getLastResult: (result: string) => void;
}

export interface ChangeBody {
    content: string;
}

const MERMAID_PATTERN = /```mermaid((?:[^`]|`(?!``))+)```?/s;

/**
 * Generate the ChangeResult component that handles result changes based on user interactions.
 *
 * @param {string} conversationId - the ID of the conversation
 * @param {string} lastResult - the last result from the conversation
 * @param {string} promptType - the type of prompt
 * @param {boolean} hasChanged - flag to indicate if a change has occurred
 * @param {function} getLastResult - function to get the last result
 * @return {JSX.Element} the ChangeResult component
 */
const ChangeResult = ({ conversationId, lastResult, promptType, hasChanged, getLastResult }: ChangeResultProps) => {
    const [tabError, setTabError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [changeText, setChangeText] = useState('');
    const [result, setResult] = useState(lastResult);

    useEffect(() => {
        setResult(lastResult);
        getLastResult(lastResult);
    }, [getLastResult, lastResult]);

    const change = useCallback(async () => {
        hasChanged();
        setIsLoading(true);
        setResult('');
        setTabError(null);

        if (conversationId) {
            let allTokens = '';
            for await (const token of getContinueCompletion({ content: changeText }, conversationId)) {
                setIsLoading(false);
                setIsStreaming(true);
                allTokens += token;
                if (promptType != 'diagram') {
                    setResult((d) => (d ? d + token : token));
                }
            }
            setResult(allTokens);
            setIsStreaming(false);
            reloadHistory(conversationId);

            if (allTokens) {
                getLastResult(allTokens);
            }
        }
        setIsLoading(false);
    }, [changeText, conversationId, getLastResult, hasChanged, promptType]);

    /**
     * Handle an error by setting the result error.
     *
     * @param {any} error - the error to be handled
     * @return {void}
     */
    const handleError = (error: string) => {
        setTabError(error);
    };

    /**
     * A function that displays the result based on the prompt type.
     *
     * @return {JSX.Element} The JSX element representing the displayed result.
     */
    const displayResult = () => {
        if (!result) return;

        switch (promptType) {
            case 'diagram':
                //finds mermaid code within a ```mermaid``` block
                const match = result.match(MERMAID_PATTERN);

                if (match && match[1]) {
                    const mermaidCode = match[1].trim();
                    return <Mermaid chart={mermaidCode} onError={handleError} />;
                } else {
                    //if mermaid is not in code block or not present
                    return <Mermaid chart={result} onError={handleError} />;
                }
            case 'user-story-gherkin':
                return <GherkinValidate content={result} />; 
            default:
                return <ReactMarkdown className={jiraStyles.historyResponse}>{result}</ReactMarkdown>;
        }
    };

    return (
        <>
            {(isLoading || isStreaming) && (
                <Spinner
                    fill="#b1b4b6"
                    height="56px"
                    title="Example Spinner implementation"
                    width="56px"
                    style={{ margin: '5px' }}
                />
            )}
            {!isLoading && (
                <>
                    <div className="govuk-grid-column-full">
                        {tabError && <Error error={tabError} />}
                        <div className="govuk-!-padding-bottom-2">{result && displayResult()}</div>
                    </div>
                    {!isStreaming && (
                        <div className="govuk-grid-column-full">
                            <details className="govuk-details" open>
                                <summary className="govuk-details__summary">
                                    <span className="govuk-details__summary-text">Change</span>
                                </summary>
                                <div className="govuk-details__text">
                                    <fieldset className="govuk-fieldset">
                                        <div className={`govuk-form-group ${changeResultStyles.form}`}>
                                            <label className="govuk-label" htmlFor="address-line-1">
                                                Make a change
                                            </label>
                                            <textarea
                                                className="govuk-textarea"
                                                rows={2}
                                                onChange={(e) => setChangeText(e.target.value)}
                                                autoFocus
                                            ></textarea>
                                            <button
                                                className={`govuk-button ${changeResultStyles.button}`}
                                                onClick={change}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </fieldset>
                                </div>
                            </details>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default ChangeResult;
