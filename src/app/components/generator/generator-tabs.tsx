import { useEffect, useState } from 'react';
import { Spinner } from 'govuk-react';
import { Tabs } from 'govuk-frontend';
import ReactMarkdown from 'react-markdown';
import jiraStyles from '../../styles/Jira.module.scss';
import generatorStyles from '../../styles/Generator.module.scss';
import { Model, useConversationHistory, useDeleteConversationHistoryEntries } from '@/app/lib/fetchers';
import GherkinValidate from '../gherkinvalidate';
import { Variable } from './generator';
import Mermaid from '@/app/diagrams/mermaid';
import useStream from '@/app/hooks/useStream';
import ErrorComponent from '@/app/components/error';
import HistoryTab from '../history/historyTab';
import ChangeResult from './change-result';
import TokenCounter from '../token-counter/token-counter';

interface GeneratorTabsProps {
    reset: () => void;
    variables: Variable[];
    promptType: string;
    model: Model;
    streamingEnabled: boolean;
    conversationId?: string | null;
}

const MERMAID_PATTERN = /```mermaid((?:[^`]|`(?!``))+)```?/s;

/**
 * Generates tabs for the given input parameters and handles streaming data and errors.
 *
 * @param {() => void} reset - function to reset the tabs
 * @param {Variable[]} variables - array of variables
 * @param {string} promptType - type of prompt
 * @param {Model} model - model object
 * @param {boolean} streamingEnabled - flag indicating if streaming is enabled
 * @return {JSX.Element} the rendered tabs component
 */
const GeneratorTabs = ({
    reset,
    variables,
    promptType,
    model,
    streamingEnabled,
    conversationId,
}: GeneratorTabsProps) => {
    const [tabError, setTabError] = useState<string | null>(null);
    const [hasChanged, setHasChanged] = useState(false);
    const [lastResponse, setLastResponse] = useState<string | null>(null);
    const {
        data,
        isLoading,
        streamingFinished,
        error,
        conversationId: id,
    } = useStream(!conversationId ? { model, promptType, variables } : {});
    const [isHistoryTabOpen, setIsHistoryTabOpen] = useState(window.location.hash === '#history');
    const [renderPreview, setRenderPreview] = useState(false);
    const [hasDeleted, setHasDeleted] = useState(false);
    const [preview, setPreview] = useState('');

    if (!conversationId) {
        conversationId = id;
    }

    const { data: history } = useConversationHistory((streamingFinished && conversationId) || '');
    // useEffect hook to initialize tabs
    useEffect(() => {
        if (typeof window !== 'undefined') {
            let config: any;
            config = typeof config !== 'undefined' ? config : {};
            var $scope = config.scope instanceof HTMLElement ? config.scope : document;
            let $tabs: HTMLElement[] = $scope.querySelectorAll('[data-module="govuk-tabs"]');
            for (let tab of $tabs) {
                new Tabs(tab).init();
            }
        }

        // Handle hash changes to check whether the history tab is open
        const handleHashChange = () => {
            setIsHistoryTabOpen(window.location.hash === '#history');
            // Reset the result to the latest message if the history tab is opened
            if (window.location.hash === '#history') {
                setRenderPreview(false);
                setPreview('');
            }
        };

        // Add event listener for hash changes
        window.addEventListener('hashchange', handleHashChange);

        // Clean up event listener
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

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
     * Copies the given text to the clipboard if it's not undefined.
     *
     * @param {string | undefined} text - the text to be copied to the clipboard
     * @return {void}
     */
    const copyToClipboard = (text: string | null) => {
        if (text) {
            navigator.clipboard.writeText(text);
        }
    };

    /**
     * Sets the preview text and renders it if the input text is not null.
     *
     * @param {string | null} text - The text to be set as the preview.
     */
    const previewHistoricResult = (text: string | null) => {
        if (text) {
            setPreview(text);
            setRenderPreview(true);
            window.location.hash = '#result';
        }
    };

    /**
     * Handles the delete of the history entries.
     *
     * @param {number} num_entries - the number of entries to delete
     * @return {void}
     */
    const UseDeleteHistoryEntries = (num_entries: number) => {
        useDeleteConversationHistoryEntries(conversationId || '', num_entries);
        setHasDeleted(true);
    };

    /**
     * Retrieves the tab result based on the provided prompt type.
     *
     * @param {string} promptType - the chosen prompt type
     * @return {ReactNode} the tab result based on the provided prompt type
     */
    const getTabResult = (type: string) => {
        // If loading or streaming not enabled, keep displaying spinner
        if (isLoading || (!streamingEnabled && !streamingFinished)) {
            return <Spinner fill="#b1b4b6" height="56px" width="56px" />;
        }

        // If streaming, return current streaming data in markdown
        if (!streamingFinished && data) {
            return <ReactMarkdown className={jiraStyles.historyResponse}>{data}</ReactMarkdown>;
        }

        // If streaming has finished display final result
        if (streamingFinished && data) {
            const resultToBeRendered = renderPreview ? preview : lastResponse ? lastResponse : data;
            switch (type) {
                case 'user-story-gherkin':
                    return <GherkinValidate content={resultToBeRendered} />;
                case 'diagram':
                    //finds mermaid code within a ```mermaid``` block
                    const match = resultToBeRendered.match(MERMAID_PATTERN);

                    if (match && match[1]) {
                        const mermaidCode = match[1].trim();
                        return <Mermaid chart={mermaidCode} onError={handleError} />;
                    } else {
                        //if mermaid is not in code block or not present
                        return <Mermaid chart={resultToBeRendered} onError={handleError} />;
                    }
                default:
                    return <ReactMarkdown className={jiraStyles.historyResponse}>{resultToBeRendered}</ReactMarkdown>;
            }
        }
    };

    /**
     * A function that generates a ChangeResult component based on certain conditions.
     *
     * @return {JSX.Element} The ChangeResult component with specific props.
     */
    const getChangeResult = () => {
        if (conversationId) {
            let lastResult = '';
            if (data && !hasDeleted) {
                lastResult = history && history.length > 2 ? history[history.length - 1].content : null;
            } else {
                lastResult = history && history.length > 1 ? history[history.length - 1].content : null;
            }

            if (renderPreview && hasChanged) {
                lastResult = preview;
            }

            return (
                <ChangeResult
                    conversationId={conversationId}
                    lastResult={lastResult}
                    hasChanged={() => setHasChanged(true)}
                    promptType={promptType}
                    getLastResult={handleGetLastResult}
                    renderPreview={renderPreview}
                />
            );
        }
    };

    /**
     * Handle getting the last result.
     *
     * @param {string} result - the result to set as the last response
     */
    const handleGetLastResult = (result: string) => {
        setLastResponse(result);
    };

    // Render tabs component
    return (
        <>
            {(error || tabError) && <ErrorComponent error={error || tabError} reset={reset} />}
            <div className="govuk-tabs" data-module="govuk-tabs">
                <h2 className="govuk-tabs__title">Contents</h2>
                <ul className="govuk-tabs__list">
                    <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
                        <a className={`govuk-tabs__tab ${generatorStyles.tabLoading}`} href="#result">
                            Content
                            {!streamingFinished && (
                                <Spinner
                                    fill="#b1b4b6"
                                    height="20px"
                                    title="Example Spinner implementation"
                                    width="20px"
                                    style={{ marginLeft: '5px' }}
                                />
                            )}
                        </a>
                    </li>
                    <li className="govuk-tabs__list-item">
                        <a className="govuk-tabs__tab" href="#code">
                            Source
                        </a>
                    </li>
                    <li className="govuk-tabs__list-item">
                        <a className="govuk-tabs__tab" href="#history">
                            History
                        </a>
                    </li>
                </ul>
                <div className="govuk-tabs__panel" id="result">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            {renderPreview ? <strong className="govuk-tag">Preview</strong> : null}{' '}
                            {!hasChanged && getTabResult(promptType)}
                        </div>
                        {data && streamingFinished && !hasChanged && (
                            <div className="govuk-grid-column-full">
                                <TokenCounter text={renderPreview ? preview : lastResponse ? lastResponse : data} />
                            </div>
                        )}
                        {streamingFinished && getChangeResult()}
                    </div>
                </div>
                <div className="govuk-tabs__panel govuk-tabs__panel--hidden" id="code">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            <p className={`govuk-body ${generatorStyles.code}`}>
                                {renderPreview ? preview : lastResponse ? lastResponse : data}
                            </p>
                        </div>
                        {data && streamingFinished && (
                            <div className="govuk-grid-column-full">
                                <TokenCounter text={renderPreview ? preview : lastResponse ? lastResponse : data} />
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className={`govuk-tabs__panel govuk-tabs__panel--hidden ${generatorStyles.historyTab}`}
                    id="history"
                >
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            <HistoryTab
                                history={history}
                                streamingFinished={streamingFinished}
                                copyToClipboard={copyToClipboard}
                                previewHistoricResult={previewHistoricResult}
                                UseDeleteHistoryEntries={UseDeleteHistoryEntries}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="govuk-button-group">
                <button className="govuk-button govuk-button--secondary" onClick={reset}>
                    Reset
                </button>
                {!isHistoryTabOpen && (
                    <button
                        className="govuk-button govuk-button--secondary"
                        onClick={() => copyToClipboard(renderPreview ? preview : lastResponse ? lastResponse : data)}
                    >
                        Copy
                    </button>
                )}
            </div>
        </>
    );
};

export default GeneratorTabs;
