interface ErrorProps {
    error: string | null;
    reset?: () => void;
}

/**
 * Renders an error component with the provided error message and a reset button.
 *
 * @param {ErrorProps} error - the error message to display
 * @param {() => void} reset - the function to call when the reset button is clicked
 * @return {JSX.Element} the rendered error component
 */
const ErrorComponent = ({ error, reset }: ErrorProps) => {
    return (
        <>
            <div className="govuk-error-summary" data-module="govuk-error-summary">
                <div role="alert">
                    <h2 className="govuk-error-summary__title">There is a problem</h2>
                    <div className="govuk-error-summary__body">
                        <ul className="govuk-list govuk-error-summary__list">
                            <li>
                                <a href="#">{error}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {reset && (
                <button className="govuk-button" onClick={reset}>
                    Reset
                </button>
            )}
        </>
    );
};

export default ErrorComponent;
