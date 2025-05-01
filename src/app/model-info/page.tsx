import styles from '.././styles/Home.module.scss';
import FixedPage from '.././components/fixed-page';

const modelHeaders = [
    { text: 'Model Name', key: 'modelName' },
    { text: 'Speed', key: 'speed' },
    { text: 'Cost Indicator', key: 'costIndicator' },
    { text: 'Training Data', key: 'trainingData' },
    { text: 'Context Size', key: 'contextSize' },
    { text: 'Capabilities', key: 'capabilities' },
    { text: 'Location', key: 'location' },
    { text: 'Summary', key: 'summary' },
];

const modelInfo = [
    {
        modelName: 'GPT General Azure (GPT-4o Mini)',
        speed: 'Fast',
        costIndicator: '$',
        trainingData: 'October 2024',
        contextSize: '128,000 tokens',
        capabilities: 'Text generation, translation, summarization, Q&A, code generation,image analysis, textual description, multimodal Q&A ,sound and vision capabilities.',
        location: 'UK',
        summary: 'A faster and cheaper multimodal model yet still very capable',
    },
    {
        modelName: 'GPT Advanced Azure (GPT-4o)',
        speed: 'Mid-Speed',
        costIndicator: '$$$$$',
        trainingData: 'October 2024',
        contextSize: '128,000 tokens',
        capabilities: 'Enhanced text generation, reasoning, understanding complex instructions,image analysis, textual description, multimodal Q&A ,sound and vision capabilities.',
        location: 'UK',
        summary: 'Multimodal AI that blends visual and textual analysis for comprehensive understanding',
    },
    {
        modelName: 'GPT MultiModal Azure (GPT4o)',
        speed: 'Mid-Speed',
        costIndicator: '$$$$$',
        trainingData: 'October 2024',
        contextSize: '128,000 tokens',
        capabilities: 'Enhanced text generation, reasoning, understanding complex instructions,image analysis, textual description, multimodal Q&A ,sound and vision capabilities.',
        location: 'UK',
        summary: 'Multimodal AI that blends visual and textual analysis for comprehensive understanding',
    },
    {
        modelName: 'GPT Experimental Azure (GPT4.1)',
        speed: 'Fast',
        costIndicator: '$$$$',
        trainingData: 'October 2024',
        contextSize: '1,000,000 tokens',
        capabilities: 'Enhanced text generation, reasoning, understanding complex instructions,image analysis, textual description, multimodal Q&A ,sound and vision capabilities.',
        location: 'Sweden (EU)',
        summary:
            'Next-level model with elevated digital interactions with enhanced speed, intelligence, and multilingual voice features.',
    },
    {
        modelName: 'Claude Advanced Bedrock (Claude 3.7 Sonnet)',
        speed: 'Fast',
        costIndicator: '$$$$$',
        trainingData: 'Oct 2024',
        contextSize: '200,000 tokens',
        capabilities: 'Instruction-following, general reasoning, multimodal capabilities, and agentic coding, with extended thinking providing a notable boost in math and science.',
        location: 'Germany (EU)',
        summary: 'Strikes the ideal balance between intelligence and speed for many applications',
    },
    {
        modelName: 'Claude Multimodal Bedrock (Claude 3.7 Sonnet)',
        speed: 'Fast',
        costIndicator: '$$$$$',
        trainingData: 'Oct 2024',
        contextSize: '200,000 tokens',
        capabilities: 'Instruction-following, general reasoning, multimodal capabilities, and agentic coding, with extended thinking providing a notable boost in math and science.',
        location: 'Germany (EU)',
        summary: 'Strikes the ideal balance between intelligence and speed for many applications',
    },
    {
        modelName: 'Gemini General Vertex (Gemini 2.0 Flash)',
        speed: 'Fast',
        costIndicator: '$',
        trainingData: 'November 2024',
        contextSize: '1,048,576 tokens',
        capabilities: 'Enhanced text generation,deep research support, reasoning, understanding complex instructions,image analysis, textual description, multimodal Q&A ,sound and vision capabilities.',
        location: 'Spain (EU)',
        summary: 'Fast and affordable AI for easy chat and quick code creation and multimodal tasks',
    },
    {
        modelName: 'Gemini Advanced Vertex (Gemini 2.5 Flash)',
        speed: 'Fast',
        costIndicator: '$',
        trainingData: 'January 2025',
        contextSize: '1,048,576 tokens',
        capabilities: 'Natural language tasks, analysis, and expert code generation',
        location: 'USA',
        summary: 'Latest AI from Google for complex chat, analysis, and expert code creation and more',
    },
    {
        modelName: 'Gemini Multimodal Vertex (Gemini 2.0 Flash)',
        speed: 'Fast',
        costIndicator: '$',
        trainingData: 'November 2024',
        contextSize: '1,048,576 tokens',
        capabilities: 'Enhanced text generation,deep research support, reasoning, understanding complex instructions,image analysis, textual description, multimodal Q&A ,sound and vision capabilities.',
        location: 'Spain (EU)',
        summary: 'Fast and affordable AI for easy chat and quick code creation and multimodal tasks',
    },
];

const costHeaders = [
    { text: 'Cost Indicator', key: 'costIndicator' },
    { text: 'Cost Range (per 1M prompt tokens)', key: 'costRange' },
    { text: 'Description', key: 'description' },
];

const costDetails = [
    {
        costIndicator: '$',
        costRange: 'Less than $0.2',
        description: 'Very Low Cost',
    },
    {
        costIndicator: '$$',
        costRange: '$0.2 to $0.5',
        description: 'Low Cost',
    },
    {
        costIndicator: '$$$',
        costRange: '$0.5 to $1.0',
        description: 'Moderate Cost',
    },
    {
        costIndicator: '$$$$',
        costRange: '$1.0 to $2.0',
        description: 'High Cost',
    },
    {
        costIndicator: '$$$$$',
        costRange: 'More than $2.0',
        description: 'Very High Cost',
    },
];

export default function ModelInfo() {
    return (
        <>
            <FixedPage backButton={true} isAuthenticated={false}>
                <h1 className={'govuk-heading-xl' + ' ' + styles.h1XL}>Model Information</h1>
                <section className={styles.topBorder}>
                    <table className="govuk-table">
                        <thead className="govuk-table__head">
                            <tr className="govuk-table__row">
                                {modelHeaders.map((header) => (
                                    <th scope="col" className="govuk-table__header" key={header.key}>
                                        {header.text}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="govuk-table__body">
                            {modelInfo.map((model) => (
                                <tr className="govuk-table__row" key={model.modelName}>
                                    <th scope="row" className="govuk-table__header">
                                        {model.modelName}
                                    </th>
                                    <td className="govuk-table__cell">{model.speed}</td>
                                    <td className="govuk-table__cell">{model.costIndicator}</td>
                                    <td className="govuk-table__cell">{model.trainingData}</td>
                                    <td className="govuk-table__cell">{model.contextSize}</td>
                                    <td className="govuk-table__cell">{model.capabilities}</td>
                                    <td className="govuk-table__cell">{model.location}</td>
                                    <td className="govuk-table__cell">{model.summary}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <details className="govuk-details">
                        <summary className="govuk-details__summary">
                            <span className="govuk-details__summary-text">Cost Details</span>
                        </summary>
                        <table className="govuk-table">
                            <thead className="govuk-table__head">
                                <tr className="govuk-table__row">
                                    {costHeaders.map((header) => (
                                        <th scope="col" className="govuk-table__header" key={header.key}>
                                            {header.text}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="govuk-table__body">
                                {costDetails.map((cost) => (
                                    <tr className="govuk-table__row" key={cost.costIndicator}>
                                        <th scope="row" className="govuk-table__header">
                                            {cost.costIndicator}
                                        </th>
                                        <td className="govuk-table__cell">{cost.costRange}</td>
                                        <td className="govuk-table__cell">{cost.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </details>
                </section>
            </FixedPage>
        </>
    );
}
