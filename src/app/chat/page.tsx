'use client';
import { useState } from 'react';
import styles from '../styles/ChatPage.module.scss';
import FixedPage from '../components/fixed-page';
import Chat from '../components/chat';
import { Message } from 'ai/react';

export default function ChatPage() {
    let [chatResponse, setChatResponse]: any = useState('');
    let [isLoading, setIsLoading]: any = useState(false);

    const handleMessage = (message: string) => {
        setChatResponse(message);
    };

    return (
        <FixedPage>
            <h1 className={'govuk-heading-xl ' + styles.h1XL}>TechLab Chat</h1>
            <div className={'govuk-grid-row ' + ' ' + styles.gridRow}>
                <div className={'govuk-grid-column-one-half ' + styles.gridRowHalf}>
                    <p>{isLoading ? 'Loading...' : 'Loaded'}</p>
                    <p className={styles.displayText}>{chatResponse}</p>
                </div>
                <div className={'govuk-grid-column-one-half ' + styles.gridRowHalf}>
                    <Chat 
                        showHistory={true}
                        onMessage={handleMessage}
                        placeholder={"What would you like to know?"}
                        rows={2}
                        messageLoading={(loading) => setIsLoading(loading)}
                   />
                </div>
            </div>
        </FixedPage>
    );
}
