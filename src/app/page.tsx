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
                            This is an <NextLink href="/experimental">experimental</NextLink> service – your feedback will help us to improve it. Do not use with personal data.
                        </span>
                    </p>
                </div>
                <h1 className={'govuk-heading-xl' + ' ' + styles.h1XL}>DVLA Emerging Tech Lab</h1>
                <section className={styles.topBorder}>
                    <h2 className="govuk-heading-l">Generative AI Experiments</h2>
                    <ul className="govuk-list">
                        <li>
                            <NextLink className={styles.homeLinks} href="/text-to-diagram">
                                Diagram Generator
                            </NextLink>
                            <p className={styles.homeDescription}>
                                Streamline your diagram creation and editing process with our intuitive AI Diagram
                                Generator
                            </p>
                        </li>
                        <li>
                            <NextLink className={styles.homeLinks} href="/image-to-text">
                                Image to Text
                            </NextLink>
                            <p className={styles.homeDescription}>
                            Unlock the full potential of your visual data with our cutting-edge Image to Text conversion tool
                            </p>
                        </li>
                        <li>
                            <NextLink className={styles.homeLinks} href="/user-story">
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
                        <li>
                            <NextLink className={styles.homeLinks} href="/prompt-templates">
                                Instant Productivity
                            </NextLink>
                            <p className={styles.homeDescription}>
                                Try a range of pre-defined templates such as summary, alliteration, or keywords
                            </p>
                        </li>
                        <li className={styles.infoLink}>
                            <p className="govuk-body">  <a className="govuk-link" href="/model-info">Find out more about our models</a></p>
                        </li>
                    </ul>
                </section>
            </FixedPage>
        </>
    );
}
