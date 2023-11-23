'use client';
import { useChat } from 'ai/react';
import {
    Main,
    Footer,
    H1,
    Page,
    Button,
    Input,
    GridRow,
    GridCol,
    UnorderedList,
    ErrorSummary,
    ListItem,
} from 'govuk-react';
import styles from '../styles/Chat.module.scss';

export default function Chat() {
    const { messages, input, error, handleInputChange, handleSubmit } = useChat();

    return (
        <>
            <Page>
                <H1>TechLab Chat</H1>
                <Main>
                    {error != null && (
                        <section id="errorSection">
                            <ErrorSummary heading="There was an error" errors={[{ text: (error as any).toString() }]} />
                        </section>
                    )}
                    <GridRow>
                        <GridCol setWidth="full">
                            <section className={styles.chatHistory}>
                                <UnorderedList listStyleType="none">
                                    {messages.map((m) => (
                                        <ListItem className={styles.listItem + " " + (m.role === 'user' ? styles.right : styles.left)} key={m.id}>
                                            <section className={(m.role === 'user' ? styles.userMessage : styles.aiMessage)}>
                                                <div className={styles.icon + " " + (m.role === 'user' ? styles.user : styles.ai)}></div>
                                                <div>
                                                    <p className={styles.message + " " + (m.role === 'user' ? styles.user : styles.ai)}>{m.content}</p>
                                                    <p className={styles.from}>{m.role === 'user' ? 'User' : 'AI'}</p>
                                                </div>
                                            </section>
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                            </section>
                        </GridCol>
                    </GridRow>
                    <GridRow>
                        <GridCol setWidth="full">
                            <form className={styles.chatForm} onSubmit={handleSubmit}>
                                <Input value={input} onChange={handleInputChange} placeholder="Say something..." />
                                <Button className={styles.chatButton} type="submit">Chat</Button>
                            </form>
                        </GridCol>
                    </GridRow>
                </Main>
            </Page>
            <Footer />
        </>
    );
}
