import styles from '../styles/FixedPage.module.scss';
import Footer from './gov-uk/footer';
import Header from './gov-uk/header';

interface FixedPageProps {
    children: React.ReactNode;
    backButton?: boolean;
}

const FixedPage = ({ children, backButton }: FixedPageProps) => {
    return (
        <>
            <div className={styles.chatPage}>
                <Header />
                <div className={'govuk-width-container ' + styles.mainContainer}>
                    <main className={'govuk-main-wrapper ' + styles.mainWrapper} id="main-content" role="main">
                        {backButton && (
                            <a href="/" className={'govuk-back-link' + ' ' + styles.backLink}>
                                Back
                            </a>
                        )}
                        {children}
                    </main>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default FixedPage;
