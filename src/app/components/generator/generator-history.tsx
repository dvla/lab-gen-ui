import ReactMarkdown from 'react-markdown';
import chatPageStyles from '../../styles/ChatPage.module.scss';
import jiraStyles from '../../styles/Jira.module.scss';
import generatorStyles from '../../styles/Generator.module.scss';
import { ResponseHistory } from './generator';
import { Model } from '@/app/lib/fetchers';
import { Spinner } from 'govuk-react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { modelContext } from '@/app/config/model-context-config';
import TokenCounter from '../token-counter/token-counter';
import CallSummary from '../calls/call-summary';

interface GeneratorHistoryProps {
    history: ResponseHistory[];
    promptType?: string;
}

/**
 * Renders the GeneratorHistory component with the given history data.
 *
 * @param {GeneratorHistoryProps} history - the history data to be displayed
 * @param promptType The type of prompt to use
 * @return {JSX.Element} the rendered history component
 */
const GeneratorHistory = ({ history, promptType }: GeneratorHistoryProps) => {
    const { setModelContext } = useContext(modelContext);
    const router = useRouter();

    /**
     * Returns the color class for a given model based on its provider and variant.
     *
     * @param {Model} model - the model object containing provider and variant information
     * @return {string} the color class for the given model
     */
    const getTagColour = (model: Model) => {
        const modelType = `${model.provider} ${model.variant}`;
        switch (modelType) {
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
            case 'VERTEX ADVANCED':
                return 'govuk-tag--pink';
            case 'VERTEX MULTIMODAL':
                return 'govuk-tag--light-blue';
            case 'HUGGINGFACE GENERAL':
                return 'govuk-tag--turquoise';
            default:
                return 'govuk-tag--grey';
        }
    };

    /**
     * Handles the click event for continuing a conversation.
     *
     * @param conversationID - The ID of the conversation to continue.
     * @param model - The model to use for the conversation.
     */
    const continueClick = (conversationID: string | null, model: Model) => {
        if (conversationID) {
            setModelContext({
                provider: model.provider,
                variant: model.variant,
                family: model.family,
                description: model.description,
                location: model.location,
                key: model.key,
            });
            router.push(`/continue-chat/${conversationID}`);
        }
    };

    return (
        <div>
            {history.length > 0 && (
                <>
                    <table className={'govuk-table ' + chatPageStyles.historyTable}>
                        <caption className="govuk-table__caption govuk-table__caption--m">Results</caption>
                        <tbody className="govuk-table__body">
                            {history.map((item, index) => (
                                <tr key={index} className="govuk-table__row">
                                    <td className="govuk-table__cell">
                                        { promptType && promptType === 'call_summary' ? (
                                            <CallSummary callData={item.data} />
                                        ) : (
                                            <ReactMarkdown className={jiraStyles.historyResponse}>
                                                {item.data}
                                            </ReactMarkdown>
                                        )}
                                        <div className={jiraStyles.continueTags}>
                                            <div className={jiraStyles.tagLoading}>
                                                <strong
                                                    className={`govuk-tag ${jiraStyles.govTagSmall} ${getTagColour(
                                                        item.model
                                                    )}`}
                                                >
                                                    {item.model.variant} {item.model.family}
                                                </strong>
                                                {!item.streamingFinished && (
                                                    <Spinner
                                                        fill="#b1b4b6"
                                                        height="20px"
                                                        title="One Shot Spinner"
                                                        width="20px"
                                                        style={{ padding: '0 10px' }}
                                                    />
                                                )}
                                            </div>
                                            {item.streamingFinished && <TokenCounter text={item.data} modelFamily={item.model.family}/>}
                                            {item.conversationId && (
                                                <a
                                                    onClick={() => continueClick(item.conversationId, item.model)}
                                                    data-testid="item.conversationID"
                                                    className={`govuk-link govuk-link--no-visited-state ${generatorStyles.continueLink}`}
                                                >
                                                    Continue
                                                </a>
                                            )}
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
