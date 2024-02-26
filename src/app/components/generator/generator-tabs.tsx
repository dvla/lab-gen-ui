import useSWR from 'swr';
import { Model, Variable } from './generator';
import { Spinner } from 'govuk-react';

interface GeneratorTabsProps {
    reset: () => void;
    variables: Variable[];
    type: string;
    model: Model;
    updateHistory: (history: string) => void;
}

export interface Body {
    variables: any;
    provider: string;
    variant: string;
    promptId: string;
}

/**
 * Custom hook to start a conversation.
 *
 * @param {string} body - The body of the conversation
 * @return {object} An object containing data, error, isLoading, and isValidating
 */
export const useStartConversation = (body: Body) => {
    const { data, error, isLoading, isValidating } = useSWR(
        '/api/start-conversation',
        (url: string) =>
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }).then((res) => res.text()),
        {
            revalidateOnFocus: false,
        }
    );

    return { data, error, isLoading, isValidating };
};

/**
 * Generates tabs based on the provided variables and type.
 *
 * @param {boolean} reset - function to reset the tabs
 * @param {Array<Variable>} variables - list of variables to be used in generating tabs
 * @param {string} type - the type of tabs to be generated
 * @param {Model} model - the model object
 * @param {Function} updateHistory - function to update the conversation history
 * @return {JSX.Element} the generated tabs component
 */
const GeneratorTabs = ({ reset, variables, type, model, updateHistory }: GeneratorTabsProps) => {
    // Create body object with default values
    const body: Body = {
        variables: {},
        provider: model.provider,
        variant: model.variant,
        promptId: type,
    };

    // Populate variables in the body object
    for (let v of variables) {
        body.variables[v.id] = v.value;
    }

    // Call useStartConversation API to get data and error states
    const { data, error, isLoading, isValidating } = useStartConversation(body);

    // If there is an error, display error message
    if (error) {
        return (
            <div className="govuk-error-summary" data-module="govuk-error-summary">
                <div role="alert">
                    <h2 className="govuk-error-summary__title">There is a problem</h2>
                    <div className="govuk-error-summary__body">
                        <ul className="govuk-list govuk-error-summary__list">
                            <li>
                                <a href="#">Could not get response</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // If data is available and not loading or validating, update history
    if (!isLoading && !isValidating && data) {
        updateHistory(data);
    }

    // Render tabs component
    return (
        <div className="govuk-tabs" data-module="govuk-tabs">
            <h2 className="govuk-tabs__title">Contents</h2>
            <ul className="govuk-tabs__list">
                <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
                    <a className="govuk-tabs__tab" href="#result">
                        Result
                    </a>
                </li>
            </ul>
            <div className="govuk-tabs__panel" id="result">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        {isLoading || isValidating ? (
                            // Render spinner if loading or validating
                            <Spinner fill="#b1b4b6" height="56px" title="Example Spinner implementation" width="56px" />
                        ) : (
                            // Render data if not loading or validating
                            <p className="govuk-body">{data}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneratorTabs;
