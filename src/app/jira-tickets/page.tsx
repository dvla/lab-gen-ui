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

const JiraTickets = () => {
    const [ticketTitle, setticketTitle] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState('');
    const [lastResponse, setLastResponse] = useState('');
    const [hasPromptBeenSubmitted, setHasPromptBeenSubmitted] = useState(false);

    const initialPrompt = `You are an Agile practitioner with over 10 years of experience in the project management field. 
    You are an expert in Jira.`;

    const tailoredPrompt = `Your task is to refine a Jira ticket based on the following sections, a Title: ${ticketTitle}, 
    and a description: ${description}. 
    Feel free to suggest changes to make the title snappier or better structured. 
    Ensure that the description is rewritten as professionally as possible, making sure to flesh out any of the provided points.
    As part of the description, include a section called “Acceptance Criteria”.
    The output should be in the format: Title, Description, Acceptance Criteria and nothing else.
    Ensure that the response is provided in markdown format, with the title using 2 # and the description headings using 3 #.
    The only thing you should output is the markdown with no other text.`;

    const { messages, input, error, handleSubmit, setInput } = useChat({
        initialMessages: [
            {
                id: '0',
                role: 'user',
                content: initialPrompt,
            },
        ],
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
            setFormError(''); // Clear any existing errors
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
        setInput(tailoredPrompt);
    };

    useEffect(() => {
        if (input) {
            // Create a new event using the native Event constructor
            let event = new Event('submit', { cancelable: true });
            handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
            setHasPromptBeenSubmitted(true);
        }
    }, [handleSubmit, input]);

    return (
        <>
            <FixedPage>
                {error != null && (
                    <section id="errorSection">
                        <ErrorSummary heading="There was an error" errors={[{ text: (error as any).toString() }]} />
                    </section>
                )}
                <H1>Ticket Master</H1>
                <main>
                    {formError && <ErrorSummary heading="There was a problem" description={formError} />}
                    <GridRow>
                        <GridCol setWidth="one-half">
                            <section className={jiraStyles.inputArea}>
                                <form className={styles.chatForm} onSubmit={handleSubmitWithValidation}>
                                    <LabelText className={jiraStyles.label}>Title</LabelText>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setticketTitle(e.target.value)}
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

                                    <Button className={styles.button} type="submit">
                                        Generate
                                    </Button>
                                </form>
                            </section>
                        </GridCol>
                        <GridCol setWidth="one-half">
                            <Label className={jiraStyles.inputArea}>
                                <LabelText>Fresh Ticket</LabelText>
                            </Label>
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
                                                    className={
                                                        m.role === 'user' ? styles.userMessage : styles.aiMessage
                                                    }
                                                >
                                                    {m.content}
                                                </section>
                                            </ListItem>
                                        ))}
                                </UnorderedList>
                            </section>
                        </GridCol>
                    </GridRow>
                    <SectionBreak level="LARGE" visible />
                    <Details summary="Markdown Preview">
                        <ReactMarkdown>{lastResponse}</ReactMarkdown>
                    </Details>
                </main>
            </FixedPage>
        </>
    );
}

export default JiraTickets;
