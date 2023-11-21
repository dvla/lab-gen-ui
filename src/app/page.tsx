'use client';
import { BackLink, Footer, H1, Link, ListItem, Page, PhaseBanner, UnorderedList } from 'govuk-react';
import NextLink from 'next/link';

export default function Home() {
    return (
        <>
            <Page
                beforeChildren={
                    <>
                        {/* Phase banner for beta version */}
                        <PhaseBanner level="beta">
                            This is a new service – your <Link href="#">feeback</Link> will help us to improve it
                        </PhaseBanner>
                    </>
                }
            >
                <H1>Lab Gen AI Demos</H1>
                <UnorderedList>
                    <ListItem>
                        <NextLink href="/diagrams">Diagrams</NextLink>
                    </ListItem>
                    <ListItem>
                        <NextLink href="/jira-tickets">Jira Tickets</NextLink>
                    </ListItem>
                </UnorderedList>
            </Page>
            <Footer />
        </>
    );
}
