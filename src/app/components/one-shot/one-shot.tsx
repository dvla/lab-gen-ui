import { Spinner } from 'govuk-react';
import { Variable } from '../generator/generator';
import { Model } from '@/app/lib/fetchers';
import useStream from '@/app/hooks/useStream';
import ErrorComponent from '@/app/components/error';

interface OneShotProps {
    variables: Variable[];
    promptType: string;
    model: Model;
    updateHistory: (history: string, streamingFinished: boolean, conversationId: string | null) => void;
}

/**
 * Generate a one shot result using the given variables, prompt type, and model. Update the history with the returned data.
 *
 * @param {OneShotProps} variables - The variables to be used in the conversation
 * @return {JSX.Element} The JSX element representing the OneShot component
 */
const OneShot = ({ variables, promptType, model, updateHistory }: OneShotProps) => {
    const { isLoading, error } = useStream({model, promptType, variables, updateHistory});

    // If there is an error, display error message
    if (error) {
        return (
            <ErrorComponent error={error} reset={() => window.location.reload()}/>
        );
    }

    return (
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
                {(isLoading) && (
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
