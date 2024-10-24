'use client';
import { useEffect, useState } from 'react';
import styles from '../styles/FixedPage.module.scss';
import ModelBanner from './banner/banner';
import Footer from './gov-uk/footer';
import Header from './gov-uk/header';

import { loginAction } from '../lib/actions';
import { getSession } from 'next-auth/react';
import { Spinner } from 'govuk-react';

interface FixedPageProps {
    children: React.ReactNode;
    backButton?: boolean;
    modelBanner?: boolean;
    backLink?: string;
    isAuthenticated?: boolean;
}

const FixedPage = ({ children, backButton, modelBanner, backLink, isAuthenticated = true }: FixedPageProps) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (!session) {
                loginAction();
            } else {
                setIsLoading(false);
            }
        };
        if (isAuthenticated) {
            fetchSession();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    if (isLoading) {
        // While loading, don't render children or anything else
        return (
            <div className={styles.spinner}>
                <Spinner />
            </div>
        ); // Show a spinner or any loading indicator
    }

    return (
        <>
            <div className={styles.chatPage}>
                <Header />
                <div className={'govuk-width-container ' + styles.mainContainer}>
                    <main className={'govuk-main-wrapper ' + styles.mainWrapper} id="main-content" role="main">
                        {modelBanner && <ModelBanner></ModelBanner>}
                        {backButton && (
                            <a
                                href={backLink ? backLink : '/'}
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
