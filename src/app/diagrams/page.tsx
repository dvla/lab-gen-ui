'use client';
import Mermaid from './mermaid';
import { useState, ChangeEvent } from 'react';
import {
    H1,
    GridRow,
    GridCol,
    H3,
    Paragraph,
    SectionBreak,
    LoadingBox,
    Details,
    ErrorSummary,
} from 'govuk-react';
import diagramStyles from '../styles/Diagrams.module.scss';
import Chat from '../components/chat';
import FixedPage from '../components/fixed-page';

/**
 * A React functional component that renders a UI for a diagram generation tool
 * and display using a Mermaid component. It allows the user to select
 * different types of diagrams, input specifications, and view the
 * generated diagram.
 *
 * @return {JSX.Element} The rendered component elements.
 */
export default function Diagrams() {
    const [selectedMessage, setSelectedMessage] = useState('');
    const [diagramType, setDiagramType] = useState('sequence');
    let [isLoading, setIsLoading] = useState(false);
    const [firstMessageSent, setFirstMessageSent] = useState(false);
    const [mermaidError, setMermaidError] = useState<Error | null>(null);
    const DIAGRAM_ERROR_MESSAGE =
        'Error loading diagram: Please try amending your specifications or asking in the chat to generate a new diagram.';
    const initialPrompt = `
    You are part of a software development team. You are responsible for creating design documents for the project.

    Your mission is to create a ${diagramType} diagram in mermaid. The only thing you should output is the mermaid with no other text. 
    You should ensure that your output is a mermaid ${diagramType} diagram with a title. Only output the code and no other chat. 
  
    You should create the diagram for the following specifications:
    `;

    const modelName = diagramType.startsWith('c4') ? 'GPT4' : 'DEFAULT';

    /**
     * Displays the diagram content in the selected message.
     *
     * @param {string} content - The content to be displayed.
     * @return {void}
     */
    const displayDiagram = (content: string) => {
        setMermaidError(null);
        if (!firstMessageSent) {
            setFirstMessageSent(true);
        }
        setSelectedMessage(content);
    };

    /**
     * Stores the errors thrown by Mermaid diagram component.
     *
     * @param {any} error - The error object captured from
     *                       Mermaid.
     * @return {void}
     */
    const handleMermaidError = (error: any) => {
        setMermaidError(error);
    };

    return (
        <>
            <FixedPage>
                <H1>Dai O&apos;Gram</H1>{ mermaidError ?
                <>
                    <div>
                        <ErrorSummary heading="Diagram Generation Error" errors={[{ text: DIAGRAM_ERROR_MESSAGE }]} />
                    </div>
                </>
                : null}
                <H3>Diagram Settings</H3>
                <GridRow>
                    <GridCol setWidth="one-quarter">
                        <label className="govuk-label" htmlFor="chat-input">
                            {"Select a diagram type"}
                        </label>
                        <select
                            className={'govuk-select'}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setDiagramType(e.target.value)}
                        >
                            <option value="sequence">Sequence</option>
                            <option value="class">Class</option>
                            <option value="flowchart">Flowchart</option>
                            <option value="state">State</option>
                            <option value="enitity relationship">Entity Relationship</option>
                            <option value="user journey">User Journey</option>
                            <option value="gantt">Gantt</option>
                            <option value="pie chart">Pie Chart</option>
                            <option value="requirement">Requirement</option>
                            <option value="c4 - system context">C4 - System Context</option>
                            <option value="c4 - container">C4 - Container</option>
                            <option value="c4 - deployment">C4 - Deployment</option>
                            <option value="c4 - dynamic">C4 - Dynamic</option>
                        </select>
                    </GridCol>
                    <GridCol setWidth="two-thirds" className={diagramStyles.inputBox}>
                        <Chat
                            showHistory={false}
                            onMessage={displayDiagram}
                            body={{ modelName: modelName }}
                            rows={10}
                            messageLoading={(isLoading) => setIsLoading(isLoading)}
                            initialMessages={[
                                {
                                    id: '0',
                                    role: 'user',
                                    content: initialPrompt,
                                },
                            ]}
                            placeholder={
                                firstMessageSent
                                    ? 'What changes would you like to make?'
                                    : 'What are the specifications for your diagram?'
                            }
                        />
                    </GridCol>
                </GridRow>
                <SectionBreak level="LARGE" visible />
                <LoadingBox loading={isLoading}>
                    <GridRow className={diagramStyles.paddedDiagramRow}>
                        <GridCol>
                            {firstMessageSent ? (
                                <Mermaid
                                    chart={selectedMessage.replace('```mermaid', '').replaceAll('`', '')}
                                    onError={handleMermaidError}
                                />
                            ) : (
                                <div style={{ height: '100px' }}></div>
                            )}
                        </GridCol>
                    </GridRow>
                </LoadingBox>
                <SectionBreak level="LARGE" visible={!mermaidError && firstMessageSent} />
                <GridRow>
                    {firstMessageSent && !mermaidError ? (
                        <Details summary="View the Diagram Code">
                            <Paragraph>{selectedMessage}</Paragraph>
                        </Details>
                    ) : null}
                </GridRow>
            </FixedPage>
        </>
    );
}
