interface GeneratorHistoryProps {
    history: string[];
}

/**
 * Renders the GeneratorHistory component with the given history data.
 *
 * @param {GeneratorHistoryProps} history - the history data to be displayed
 * @return {JSX.Element} the rendered history component
 */
const GeneratorHistory = ({ history }: GeneratorHistoryProps) => {
    return (
        <div>
            {history.length > 0 && (
                <>
                    {/* <h2 className="govuk-heading-m">Previous Results</h2> */}
                    <table className="govuk-table">
                        <caption className="govuk-table__caption govuk-table__caption--m">Results</caption>
                        <tbody className="govuk-table__body">
                            {history.map((item, index) => (
                                <tr key={index} className="govuk-table__row">
                                    <td className="govuk-table__cell">
                                        {item}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default GeneratorHistory;
