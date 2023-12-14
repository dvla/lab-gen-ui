'use client';
import { Footer, ListItem, Page, PhaseBanner, UnorderedList, H2, Paragraph } from 'govuk-react';
import NextLink from 'next/link';
import styles from './styles/Home.module.scss';

export default function Home() {
    return (
        <>
            <Page
                beforeChildren={
                    <>
                        {/* Phase banner for beta version */}
                        <PhaseBanner level="beta">
                            This is a new service – your feedback will help us to improve it
                        </PhaseBanner>
                    </>
                }
            >
                <h1 className={'govuk-heading-xl' + ' ' + styles.h1XL}>DVLA Emerging Tech Lab</h1>
                <section className={styles.topBorder}>
                    <H2>Generative AI Experiments</H2>
                    <UnorderedList listStyleType='none'>
                        <ListItem>
                            <NextLink className={styles.homeLinks} href="/diagrams">
                                Diagram Generator
                            </NextLink>
                            <Paragraph className={styles.homeDescription}>
                                Streamline your diagram creation and editing process with our intuitive AI Diagram
                                Generator
                            </Paragraph>
                        </ListItem>
                        <ListItem>
                            <NextLink className={styles.homeLinks} href="/jira-tickets">
                                User Story Generator
                            </NextLink>
                            <Paragraph className={styles.homeDescription}>
                                Enhance your Jira ticket creation and refinement with our sophisticated User Story
                                Generator
                            </Paragraph>
                        </ListItem>
                        <ListItem>
                            <NextLink className={styles.homeLinks} href="/chat">
                                Chat
                            </NextLink>
                            <Paragraph className={styles.homeDescription}>
                                Experience the power of AI-driven conversation with our chatbot
                            </Paragraph>
                        </ListItem>
                    </UnorderedList>
                </section>
            </Page>
            <Footer />
        </>
    );
}
