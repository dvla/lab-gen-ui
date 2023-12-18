import NextLink from 'next/link';
import styles from './styles/Home.module.scss';
import FixedPage from './components/fixed-page';

export default function Home() {
    return (
        <>
            <FixedPage>
                <div className="govuk-phase-banner">
                    <p className="govuk-phase-banner__content">
                        <strong className="govuk-tag govuk-phase-banner__content__tag">Beta</strong>
                        <span className="govuk-phase-banner__text">
                            This is a new service – your feedback will help us to improve it.
                        </span>
                    </p>
                </div>
                <h1 className={'govuk-heading-xl' + ' ' + styles.h1XL}>DVLA Emerging Tech Lab</h1>
                <section className={styles.topBorder}>
                    <h2 className="govuk-heading-l">Generative AI Experiments</h2>
                    <ul className="govuk-list">
                        <li>
                            <NextLink className={styles.homeLinks} href="/diagrams">
                                Diagram Generator
                            </NextLink>
                            <p className={styles.homeDescription}>
                                Streamline your diagram creation and editing process with our intuitive AI Diagram
                                Generator
                            </p>
                        </li>
                        <li>
                            <NextLink className={styles.homeLinks} href="/jira-tickets">
                                User Story Generator
                            </NextLink>
                            <p className={styles.homeDescription}>
                                Enhance your Jira ticket creation and refinement with our sophisticated User Story
                                Generator
                            </p>
                        </li>
                        <li>
                            <NextLink className={styles.homeLinks} href="/chat">
                                Chat
                            </NextLink>
                            <p className={styles.homeDescription}>
                                Experience the power of AI-driven conversation with our chatbot
                            </p>
                        </li>
                    </ul>
                </section>
            </FixedPage>
        </>
    );
}
