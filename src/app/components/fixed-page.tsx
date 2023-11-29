import styles from '../styles/FixedPage.module.scss';
import Footer from './gov-uk/footer';
import Header from './gov-uk/header';

const FixedPage = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className={styles.chatPage}>
                <Header/>
                <div className={'govuk-width-container ' + styles.mainContainer}>
                    <main className={'govuk-main-wrapper ' + styles.mainWrapper} id="main-content" role="main">
                        {children}
                    </main>
                </div>
                <Footer/>
            </div>
        </>
    );
};

export default FixedPage;
