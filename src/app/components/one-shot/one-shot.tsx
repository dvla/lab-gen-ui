import { Spinner } from 'govuk-react';
import { Variable } from '../generator/generator';
import { Model, useStartConversation, Body } from '@/app/lib/fetchers';
import { useEffect } from 'react';

interface OneShotProps {
    variables: Variable[];
    promptType: string;
    model: Model;
    updateHistory: (history: string) => void;
}

/**
 * Generate a one shot result using the given variables, prompt type, and model. Update the history with the returned data.
 *
 * @param {OneShotProps} variables - The variables to be used in the conversation
 * @return {JSX.Element} The JSX element representing the OneShot component
 */
const OneShot = ({ variables, promptType, model, updateHistory }: OneShotProps) => {
    // Create body object with default values
    const body: Body = {
        variables: {},
        provider: model.provider,
        variant: model.variant,
        promptId: promptType,
    };

    // Populate variables in the body object
    for (let v of variables) {
        body.variables[v.id] = v.value;
    }

    // Call useStartConversation API to get data and error states
    const { data, error, isLoading, isValidating } = useStartConversation(body);

    useEffect(() => {
        // If data is available and not loading or validating, update history
        if (!isLoading && !isValidating && data) {
            updateHistory(data);
        }
    }, [data, isLoading, isValidating, updateHistory]);

    // If there is an error, display error message
    if (error) {
        return (
            <div className="govuk-error-summary" data-module="govuk-error-summary">
                <div role="alert">
                    <h2 className="govuk-error-summary__title">There is a problem</h2>
                    <div className="govuk-error-summary__body">
                        <ul className="govuk-list govuk-error-summary__list">
                            <li>
                                <a href="#">{error.message}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
                {(isLoading || isValidating) && (
                    // Render spinner if loading or validating
                    <Spinner
                        fill="#b1b4b6"
                        height="56px"
                        title="One Shot Spinner"
                        width="56px"
                        style={{ padding: '15px' }}
                    />
                )}
            </div>
        </div>
    );
};

export default OneShot;
