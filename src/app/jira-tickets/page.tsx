'use client';
import {
    H1,
    GridRow,
    GridCol,
    Button,
    UnorderedList,
    ListItem,
    Label,
    Input,
    LabelText,
    SectionBreak,
    Details,
    ErrorSummary,
} from 'govuk-react';
import { useState, useEffect, FormEvent, FormEventHandler, ChangeEvent } from 'react';
import styles from '../styles/Chat.module.scss';
import jiraStyles from '../styles/Jira.module.scss';
import { useChat } from 'ai/react';
import FixedPage from '../components/fixed-page';
import ReactMarkdown from 'react-markdown';

const DEFAULT_STRING = '';

const JiraTickets = () => {
    const [ticketTitle, setTicketTitle] = useState(DEFAULT_STRING);
    const [description, setDescription] = useState(DEFAULT_STRING);
    const [formError, setFormError] = useState(DEFAULT_STRING);
    const [lastResponse, setLastResponse] = useState(DEFAULT_STRING);
    const [hasPromptBeenSubmitted, setHasPromptBeenSubmitted] = useState(false);
    const [isGherkinChecked, setIsGherkinChecked] = useState(false);

    const TITLE_DESCRIPTION_GUIDANCE = `For the title, if a title is not provided, one must be inferred from the description following the rules provided above. If one is, use that. 
    For the description; if one is provided, it must be expanded upon greatly to maximize accuracy, clarity, level of detail, and actionability for the user based on the key points. 
    If one isn’t provided, create a comprehensive description based on what the title implies. You must still keep the "Description" heading.
    The description must be in 3 sections:  
    1) The improved description text in the style of "As a <type of user>, I want <some goal> so that <some reason>".
    2) The acceptance criteria which must be inferred from the title or description provided.`;
    const PROMPT_INTRODUCTION = `Given a Jira ticket based on the following sections, a title and a description, your job is to take a Jira User Story title and description and make significant improvements to allow it to fit within Agile standards.`; 
    const OLD_TICKET = `Here is the ticket that must be improved upon: Title: ${ticketTitle}, Description: ${description}`;
    const PLAIN_RESPONSE = "Please do not include any pleasantries or human-like interaction before or after the improved ticket. Also ensure that the Title, Description and Acceptance Criteria heading are output as markdown headings";
    const INITIAL_PROMPT = `You are an Agile practitioner with over 10 years of experience in the project management field. 
    You are an expert in Jira and well versed in User Story conventions as well as Behavior-Driven Development processes and operations.`;

    const tailoredPrompt = `${PROMPT_INTRODUCTION} 
    ${TITLE_DESCRIPTION_GUIDANCE}
    The final output must be in Markdown Format and contain 3 headings: The title of the ticket, "Description" and "Acceptance Criteria" with 
    the Title using 2 #'s and Description and Acceptance Criteria using 3 #’s.
    ${OLD_TICKET}
    Remember to make the appropriate improvements to the given description and not just copy it from the input.
    ${PLAIN_RESPONSE}`;

    const gherkinPrompt = `${PROMPT_INTRODUCTION}    
    ${TITLE_DESCRIPTION_GUIDANCE}
    The acceptance criteria must be in Gherkin syntax, where it will adhere to proper Gherkin syntax rules. Some examples of this include:
    1) Correct indentation for each section heading.
    2) Adherence to the Feature: Scenario: Given When Then format.
    3) Only ONE feature per generation.
    4) Please suggest numerous scenarios for each feature.
    ${OLD_TICKET}
    The response should only contain a Title, Description and Acceptance Criteria in the form of correct Gherkin syntax.
    ${PLAIN_RESPONSE}`;

    const { messages, input, error, handleSubmit, setInput } = useChat({
        initialMessages: [
            {
                id: '0',
                role: 'user',
                content: INITIAL_PROMPT,
            },
        ],

        onFinish: (message) => {
            if (!hasPromptBeenSubmitted) {
                setHasPromptBeenSubmitted(true);
            }
        },
        api: '/api/models/chat/',
    });

    useEffect(() => {
        if (hasPromptBeenSubmitted && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
                setLastResponse(lastMessage.content);
            }
        }
    }, [messages, hasPromptBeenSubmitted]);

    /**
     * Toggles the hasGherkin state variable to
     * the opposite of its current value when
     * this handler is called.
     */
    const handleCheckbox = () => {
        setIsGherkinChecked(!isGherkinChecked);
    };

    /**
     * Handles form submission with validation.
     *
     * @param {FormEvent<HTMLFormElement>} event - The form submission event.
     */
    const handleSubmitWithValidation: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        // Check if both ticketTitle and description are empty
        if (!ticketTitle.trim() && !description.trim()) {
            setFormError('Please enter a title and/or description');
        } else {
            setFormError(DEFAULT_STRING); // Clear any existing errors
            handleInput(event); // Proceed with the original submit handler
        }
    };

    /**
     * Handles the input event for a textarea element by
     * removing the last message and resetting the input
     * to the initial prompt.
     *
     * @param {ChangeEvent<HTMLTextAreaElement>} event -
     * The event object from the textarea input change.
     * @return {void}
     */
    const handleInput: FormEventHandler<HTMLFormElement> = (event) => {
        messages.pop();
        event.preventDefault();
        if (!isGherkinChecked) {
            setInput(tailoredPrompt);
        } else {
            setInput(gherkinPrompt);
        }
    };

    /**
     * Resets the form fields and state variables to their default values.
     *
     * @param {Event} event - The form submit event.
     * @return {void} This function does not return anything.
     */
    const resetToDefaults: FormEventHandler<HTMLFormElement> = (event) => {
        setTicketTitle(DEFAULT_STRING);
        setDescription(DEFAULT_STRING);
        setFormError(DEFAULT_STRING);
        setLastResponse(DEFAULT_STRING);
        setHasPromptBeenSubmitted(false);
        setIsGherkinChecked(false);
        messages.splice(1);
    };

    useEffect(() => {
        if (input) {
            // Create a new event using the native Event constructor
            let event = new Event('submit', { cancelable: true });
            handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
        }
    }, [handleSubmit, input]);

    return (
        <>
            <FixedPage backButton={true}>
                {error != null && (
                    <section id="errorSection">
                        <ErrorSummary heading="There was an error" errors={[{ text: (error as any).toString() }]} />
                    </section>
                )}
                <H1>User Story Generator</H1>
                <main>
                    {formError && <ErrorSummary heading="There was a problem" description={formError} />}

                    <GridRow>
                        <GridCol setWidth="one-half">
                            <section className={jiraStyles.inputArea}>
                                <form className={styles.chatForm} onSubmit={handleSubmitWithValidation}>
                                    <LabelText className={jiraStyles.label}>Title</LabelText>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTicketTitle(e.target.value)}
                                        value={ticketTitle}
                                        className={jiraStyles.titleBox}
                                    />
                                    <LabelText className={jiraStyles.label}>Description</LabelText>
                                    <textarea
                                        rows={17}
                                        className={'govuk-textarea' + ' ' + jiraStyles.descBox}
                                        value={description}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                    <GridRow className={jiraStyles.checkbox}>
                                        <input type="checkbox" checked={isGherkinChecked} onChange={handleCheckbox}></input>
                                        <Label className={jiraStyles.checkLabel}>Use Gherkin Syntax</Label>
                                    </GridRow>
                                    <Button className={styles.button} type="submit">
                                        Generate
                                    </Button>
                                </form>
                            </section>
                        </GridCol>
                        <GridCol className={jiraStyles.previewGridCol} setWidth="one-half">
                            <GridRow>
                                <GridCol setWidth="60%">
                                    <Label>
                                        <LabelText>Ticket Preview</LabelText>
                                    </Label>
                                </GridCol>
                                <GridCol setWidth="40%">
                                    <div className={jiraStyles.divOutput}>
                                        {hasPromptBeenSubmitted && (
                                            <>
                                                <Button
                                                    className={jiraStyles.copyButton}
                                                    onClick={() => navigator.clipboard.writeText(lastResponse)}
                                                >
                                                    Copy
                                                </Button>
                                                <Button className={jiraStyles.copyButton} onClick={resetToDefaults}>
                                                    Reset
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </GridCol>
                            </GridRow>

                            <section className={styles.chatHistory}>
                                <UnorderedList listStyleType="none">
                                    {messages
                                        .filter((m) => m.role === 'assistant')
                                        .map((m) => (
                                            <ListItem
                                                className={
                                                    styles.listItem +
                                                    ' ' +
                                                    (m.role === 'user' ? styles.right : styles.left)
                                                }
                                                key={m.id}
                                            >
                                                <section
                                                    className={m.role === 'user' ? styles.userMessage : styles.response}
                                                >
                                                    <ReactMarkdown className={jiraStyles.historyResponse}>
                                                        {m.content}
                                                    </ReactMarkdown>
                                                </section>
                                            </ListItem>
                                        ))}
                                </UnorderedList>
                            </section>
                        </GridCol>
                    </GridRow>
                    <SectionBreak level="LARGE" visible />
                    <div>
                        {hasPromptBeenSubmitted && (
                            <Details summary="Display Raw Markdown">
                                {lastResponse}
                                <GridRow className={jiraStyles.rawMD}>
                                    <Button
                                        className={jiraStyles.button}
                                        onClick={() => navigator.clipboard.writeText(lastResponse)}
                                    >
                                        Copy
                                    </Button>
                                </GridRow>
                            </Details>
                        )}
                    </div>
                </main>
            </FixedPage>
        </>
    );
};

export default JiraTickets;
