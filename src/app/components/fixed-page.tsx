'use client';
import styles from '../styles/FixedPage.module.scss';
import ModelBanner from './banner/banner';
import Footer from './gov-uk/footer';
import Header from './gov-uk/header';

interface FixedPageProps {
    children: React.ReactNode;
    backButton?: boolean;
    modelBanner?: boolean;
}

const FixedPage = ({ children, backButton, modelBanner }: FixedPageProps) => {
    return (
        <>
            <div className={styles.chatPage}>
                <Header />
                <div className={'govuk-width-container ' + styles.mainContainer}>
                    <main className={'govuk-main-wrapper ' + styles.mainWrapper} id="main-content" role="main">
                        {modelBanner && <ModelBanner></ModelBanner>}
                        {backButton && (
                            <a
                                href="/"
                                className={'govuk-back-link' + ' ' + styles.backLink}
                                onClick={() => window.close()}
                            >
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
