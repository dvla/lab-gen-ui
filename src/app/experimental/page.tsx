import NextLink from 'next/link';
import FixedPage from '../components/fixed-page';
import styles from '../styles/Home.module.scss';

const Legacy = () => {
    return (
        <FixedPage backButton={true}>
            <h1 className={'govuk-heading-xl' + ' ' + styles.h1XL}>DVLA Emerging Tech Lab</h1>
            <section className={styles.topBorder}>
                    <h2 className="govuk-heading-l">Legacy AI Experiments</h2>
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
                    </ul>
                </section>
        </FixedPage>
    );
};

export default Legacy;
