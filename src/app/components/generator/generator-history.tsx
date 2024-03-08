import ReactMarkdown from 'react-markdown';
import chatPageStyles from '../../styles/ChatPage.module.scss';
import jiraStyles from '../../styles/Jira.module.scss';
import { ResponseHistory } from './generator';
import { Model } from '@/app/lib/fetchers';
import { Spinner } from 'govuk-react';

interface GeneratorHistoryProps {
    history: ResponseHistory[];
}

/**
 * Renders the GeneratorHistory component with the given history data.
 *
 * @param {GeneratorHistoryProps} history - the history data to be displayed
 * @return {JSX.Element} the rendered history component
 */
const GeneratorHistory = ({ history }: GeneratorHistoryProps) => {
    /**
     * Returns the color class for a given model based on its provider and variant.
     *
     * @param {Model} model - the model object containing provider and variant information
     * @return {string} the color class for the given model
     */
    const getTagColour = (model: Model) => {
        const modelType = `${model.provider} ${model.variant}`;
        switch(modelType) {
            case 'AZURE GENERAL':
                return 'govuk-tag--blue';
            case 'AZURE ADVANCED':
                return 'govuk-tag--purple';
            case 'AZURE MULTIMODAL':
                return 'govuk-tag--yellow';
            case 'BEDROCK GENERAL':
                return 'govuk-tag--green';
            case 'BEDROCK ADVANCED':
                return 'govuk-tag--orange';
            case 'VERTEX GENERAL':
                return 'govuk-tag--red';
            default:
                return 'govuk-tag--grey';
        }
    }

    return (
        <div>
            {history.length > 0 && (
                <>
                    <table className={"govuk-table " + chatPageStyles.historyTable}>
                        <caption className="govuk-table__caption govuk-table__caption--m">Results</caption>
                        <tbody className="govuk-table__body">
                            {history.map((item, index) => (
                                <tr key={index} className="govuk-table__row">
                                    <td className="govuk-table__cell">
                                        <ReactMarkdown className={jiraStyles.historyResponse}>{item.data}</ReactMarkdown>
                                        <div className={jiraStyles.tagLoading}>
                                            <strong className={`govuk-tag ${jiraStyles.govTagSmall} ${getTagColour(item.model)}`}>{item.model.provider} {item.model.variant}</strong>
                                            {!item.streamingFinished && <Spinner fill="#b1b4b6" height="20px" title="One Shot Spinner" width="20px" style={{ padding: '0 10px' }} />}
                                        </div>
                                        
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
