import styles from '.././styles/Home.module.scss';
import FixedPage from '.././components/fixed-page';

const modelHeaders = [
    { text: "Model Name", key: "modelName" },
    { text: "Speed", key: "speed" },
    { text: "Cost Indicator", key: "costIndicator" },
    { text: "Training Data", key: "trainingData" },
    { text: "Context Size", key: "contextSize" },
    { text: "Capabilities", key: "capabilities" },
    { text: "Location", key: "location" },
    { text: "Summary", key: "summary" }
];
  
const modelInfo = [  
    {  
    modelName: "Azure General (GPT3.5 Turbo)",  
    speed: "Fast",  
    costIndicator: "$",  
    trainingData: "Sep 2021",  
    contextSize: "16,385 tokens",  
    capabilities: "Text generation, translation, summarization, Q&A, code generation",  
    location: "UK",  
    summary: "A faster and cheaper yet still very capable model"  
    },  
    {  
    modelName: "Azure Advanced (GPT4)",  
    speed: "Slow",  
    costIndicator: "$$$$$",  
    trainingData: "Apr 2023",  
    contextSize: "128,000 tokens",  
    capabilities: "Enhanced text generation, reasoning, understanding complex instructions",  
    location: "UK",  
    summary: "The cutting-edge in language models, offering premium capabilities at a higher cost"  
    },  
    {  
    modelName: "Azure MultiModal (GPT4 Vision)",  
    speed: "Slow",  
    costIndicator: "$$$$$",  
    trainingData: "Apr 2023",  
    contextSize: "128,000 tokens",  
    capabilities: "Image analysis, textual description, multimodal Q&A",  
    location: "Sweden (EU)",  
    summary: "Multimodal AI that blends visual and textual analysis for comprehensive understanding"  
    },  
    {  
    modelName: "Bedrock General (Claude Instant)",  
    speed: "Very Fast",  
    costIndicator: "$",  
    trainingData: "Early 2023",  
    contextSize: "100,000 tokens",  
    capabilities: "Rapid text generation, quick answers, basic Q&A",  
    location: "Frankfurt (EU)",  
    summary: "Designed for speed over depth, providing instant responses"  
    },  
    {  
    modelName: "Bedrock Advanced (Claude 2.1)",  
    speed: "Slow",  
    costIndicator: "$$$$",  
    trainingData: "Early 2023",  
    contextSize: "200,000 tokens",  
    capabilities: "Text generation, summarization, comparing and contrasting multiple documents, and analysis",  
    location: "Frankfurt (EU)",  
    summary: "High accuracy and context size for effective document analysis"  
    },  
    {  
    modelName: "Vertex General (Gemini Pro)",  
    speed: "Fast",  
    costIndicator: "$",  
    trainingData: "Feb 2023",  
    contextSize: "32,760 tokens",  
    capabilities: "Natural language tasks, multi-turn text, and code generation",  
    location: "US",  
    summary: "Fast and affordable AI for easy chat and quick code creation"  
    }  
];  

const costHeaders = [
    { text: "Cost Indicator", key: "costIndicator" },
    { text: "Cost Range (per 1000 prompt tokens)", key: "costRange" },
    { text: "Description", key: "description" }
];

const costDetails = [  
    {  
      costIndicator: "$",  
      costRange: "Less than $0.002",  
      description: "Very Low Cost"  
    },  
    {  
      costIndicator: "$$",  
      costRange: "$0.002 to $0.004",  
      description: "Low Cost"  
    },  
    {  
      costIndicator: "$$$",  
      costRange: "$0.004 to $0.006",  
      description: "Moderate Cost"  
    },  
    {  
      costIndicator: "$$$$",  
      costRange: "$0.006 to $0.008",  
      description: "High Cost"  
    },  
    {  
      costIndicator: "$$$$$",  
      costRange: "More than $0.008",  
      description: "Very High Cost"  
    }  
];  

export default function ModelInfo() {
    return (
        <>
            <FixedPage backButton={true}>
                <h1 className={'govuk-heading-xl' + ' ' + styles.h1XL}>Model Information</h1>
                <section className={styles.topBorder}>
                    <table className="govuk-table">
                        <thead className="govuk-table__head">
                            <tr className="govuk-table__row">
                                {modelHeaders.map( header => (
                                    <th scope="col" className="govuk-table__header" key={header.key}>
                                        {header.text}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="govuk-table__body">
                            {modelInfo.map( model => (
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
                                    {costHeaders.map( header => (
                                        <th scope="col" className="govuk-table__header" key={header.key}>
                                            {header.text}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="govuk-table__body">
                                {costDetails.map( cost => (
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