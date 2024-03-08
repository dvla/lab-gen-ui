import { useEffect, useState } from 'react';
import { Spinner } from 'govuk-react';
import { Tabs } from 'govuk-frontend';
import ReactMarkdown from 'react-markdown';
import jiraStyles from '../../styles/Jira.module.scss';
import generatorStyles from '../../styles/Generator.module.scss';
import { Model } from '@/app/lib/fetchers';
import GherkinValidate from '../gherkinvalidate';
import { Variable } from './generator';
import Mermaid from '@/app/diagrams/mermaid';
import useStream from '@/app/hooks/useStream';
import Error from '@/app/components/error';

interface GeneratorTabsProps {
    reset: () => void;
    variables: Variable[];
    promptType: string;
    model: Model;
    streamingEnabled: boolean;
}

const MERMAID_PATTERN = /```mermaid((?:[^`]|`(?!``))+)```?/s

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
const GeneratorTabs = ({ reset, variables, promptType, model, streamingEnabled }: GeneratorTabsProps) => {
    const [tabError, setTabError] = useState<string | null>(null);
    const { data, isLoading, streamingFinished, error } = useStream({model, promptType, variables});

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
     * Retrieves the tab result based on the provided prompt type.
     *
     * @param {string} promptType - the chosen prompt type
     * @return {ReactNode} the tab result based on the provided prompt type
     */
    const getTabResult = (type: string) => {
        // If loading or streaming not enabled, keep displaying spinner
        if (isLoading || !streamingEnabled && !streamingFinished) {
            return <Spinner fill="#b1b4b6" height="56px" width="56px" />;
        }

        // If streaming, return current streaming data in markdown
        if (!streamingFinished && data) {
            return <ReactMarkdown className={jiraStyles.historyResponse}>{data}</ReactMarkdown>;
        }

        // If streaming has finished display final result
        if (streamingFinished && data) {
            switch (type) {
                case 'user-story-gherkin':
                    return <GherkinValidate content={data} />;
                case 'diagram':
                    //finds mermaid code within a ```mermaid``` block
                    const match = data.match(MERMAID_PATTERN);

                    if (match && match[1]) {  
                        const mermaidCode = match[1].trim();  
                        return <Mermaid chart={mermaidCode} onError={handleError} />;
                    } else {
                        //if mermaid is not in code block or not present
                        return <Mermaid chart={data} onError={handleError} />;
                    }
                default:
                    return <ReactMarkdown className={jiraStyles.historyResponse}>{data}</ReactMarkdown>;
            }
        }
    };

    // Render tabs component
    return (
        <>
            {(error || tabError) && (
                <Error error={error} reset={reset} />
            )}
            <div className="govuk-tabs" data-module="govuk-tabs">
                <h2 className="govuk-tabs__title">Contents</h2>
                <ul className="govuk-tabs__list">
                    <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
                        <a className={`govuk-tabs__tab ${generatorStyles.tabLoading}`} href="#result">
                            Result
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
                            Code
                        </a>
                    </li>
                </ul>
                <div className="govuk-tabs__panel" id="result">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            {getTabResult(promptType)}
                        </div>
                    </div>
                </div>
                <div className="govuk-tabs__panel govuk-tabs__panel--hidden" id="code">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            <p className={`govuk-body ${generatorStyles.code}`}>{data}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="govuk-button-group">
                <button className="govuk-button govuk-button--secondary" onClick={reset}>
                    Reset
                </button>
                <button className="govuk-button govuk-button--secondary" onClick={() => copyToClipboard(data)}>
                    Copy
                </button>
            </div>
        </>
    );
};

export default GeneratorTabs;
