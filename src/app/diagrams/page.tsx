'use client';
import Mermaid from './mermaid';
import { useState, ChangeEvent, useRef } from 'react';
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
    Button,
} from 'govuk-react';
import diagramStyles from '../styles/Diagrams.module.scss';
import styles from '../styles/Chat.module.scss';
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
const Diagrams = () => {
    const [selectedMessage, setSelectedMessage] = useState('');
    const [diagramType, setDiagramType] = useState('sequence');
    const [isLoading, setIsLoading] = useState(false);
    const [firstMessageSent, setFirstMessageSent] = useState(false);
    const [firstChangeMade, setFirstChangeMade] = useState(false);
    const [undoMessageRequested, setUndoMessageRequested] = useState(false);
    const [editMessage, setEditMessage] = useState(false);
    const [mermaidError, setMermaidError] = useState<Error | null>(null);
    const [resetChatRequested, setResetChatRequested] = useState(false);
    const mermaidRef = useRef<HTMLDivElement>(null);
    const DIAGRAM_ERROR_MESSAGE =
        'Error loading diagram: Please try amending your specifications or if the option is available, use the button below to regenerate the previous diagram.';
    const initialPrompt = `
    You are part of a software development team. You are responsible for creating design documents for the project.

    Your mission is to create a ${diagramType} diagram in mermaid. The only thing you should output is the mermaid with no other text. 
    You should ensure that your output is a mermaid ${diagramType} diagram with a title. Only output the code and no other chat. 
    You should only ever produce one mermaid diagram at a time even if requested to do multiple.
    It is IMPORTANT that you prevent the diagram being too big by summarising the diagram if it is going to be too large.

    You should create the diagram for the following specifications:
    `;

    const provider = 'AZURE';
    const variant = diagramType.startsWith('c4') ? 'ADVANCED' : 'BASIC';

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

        if (!firstChangeMade && firstMessageSent) {
            setFirstChangeMade(true);
        }

        if (undoMessageRequested) {
            setUndoMessageRequested(false);
        }

        if (resetChatRequested) {
            setResetChatRequested(false);
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

    /**
     * Resets the form fields and state variables to their default values.
     */
    const resetToDefaults = () => {
        setSelectedMessage('');
        setIsLoading(false);
        setFirstMessageSent(false);
        setFirstChangeMade(false);
        setUndoMessageRequested(false);
        setEditMessage(false);
        setMermaidError(null);
        setResetChatRequested(true);
    };

    return (
        <>
            <FixedPage backButton={true}>
                <H1>Diagram Generator</H1>
                {mermaidError ? (
                    <>
                        <div>
                            <ErrorSummary
                                heading="Diagram Generation Error"
                                errors={[{ text: DIAGRAM_ERROR_MESSAGE }]}
                            />
                        </div>
                    </>
                ) : null}
                <GridRow>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setUndoMessageRequested(true);
                        }}
                    >
                        <GridCol>
                            {firstChangeMade && mermaidError ? <Button type="submit">Regenerate Diagram</Button> : null}
                        </GridCol>
                    </form>
                </GridRow>
                <H3>Diagram Settings</H3>
                <GridRow>
                    <GridCol setWidth="one-quarter">
                        <label className="govuk-label" htmlFor="chat-input">
                            {'Select a diagram type'}
                        </label>
                        <select
                            className={'govuk-select'}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setDiagramType(e.target.value)}
                            disabled={firstMessageSent}
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
                        <GridRow className={diagramStyles.resetButton}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                resetToDefaults();
                            }}
                        >
                            <GridCol>
                                {!resetChatRequested && firstMessageSent ? <Button type="submit">Reset</Button> : null}
                            </GridCol>
                        </form>
                        </GridRow>
                    </GridCol>
                    <GridCol setWidth="two-thirds" className={diagramStyles.inputBox}>
                        <Chat
                            showHistory={false}
                            onMessage={displayDiagram}
                            onUndo={displayDiagram}
                            body={{ provider: provider, variant: variant }}
                            rows={10}
                            undoMessageRequested={undoMessageRequested}
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
                            editedLatestMessage={firstMessageSent ? selectedMessage : undefined}
                            resetChat={resetChatRequested}
                        />
                    </GridCol>
                </GridRow>
                <SectionBreak level="LARGE" visible />
                <LoadingBox loading={isLoading}>
                    <GridRow ref={mermaidRef} className={diagramStyles.paddedDiagramRow}>
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setUndoMessageRequested(true);
                        }}
                    >
                        <GridCol>
                            {firstChangeMade && !mermaidError ? (
                                <Button type="submit">Undo Latest Change</Button>
                            ) : null}
                        </GridCol>
                    </form>
                </GridRow>
                <GridRow>
                    {firstMessageSent && !mermaidError ? (
                        <Details summary="View the Diagram Code">
                            {!editMessage ? (
                                <Paragraph>{selectedMessage}</Paragraph>
                            ) : (
                                <textarea
                                    className={'govuk-textarea ' + styles.textArea}
                                    value={selectedMessage}
                                    onChange={(e) => setSelectedMessage(e.target.value)}
                                    rows={13}
                                    cols={50}
                                />
                            )}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!editMessage) {
                                        setEditMessage(true);
                                    } else {
                                        setEditMessage(false);
                                        mermaidRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                <GridCol>
                                    {firstMessageSent && !mermaidError ? (
                                        !editMessage ? (
                                            <Button type="submit">Edit Mermaid Code</Button>
                                        ) : (
                                            <Button type="submit">Confirm Changes</Button>
                                        )
                                    ) : null}
                                </GridCol>
                            </form>
                        </Details>
                    ) : null}
                </GridRow>
            </FixedPage>
        </>
    );
};

export default Diagrams;
