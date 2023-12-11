'use client';
import { useState } from 'react';
import styles from '../styles/ChatPage.module.scss';
import FixedPage from '../components/fixed-page';
import Chat from '../components/chat';

const ChatPage = () => {
    return (
        <FixedPage>
            <h1 className={'govuk-heading-xl ' + styles.h1XL}>TechLab Chat</h1>
            <div className={'govuk-grid-row ' + ' ' + styles.gridRow}>
                <div className={'govuk-grid-column-full ' + styles.gridRowHalf}>
                    <Chat 
                        showHistory={true}
                        placeholder={"What would you like to know?"}
                        rows={2}
                   />
                </div>
            </div>
        </FixedPage>
    );
}

export default ChatPage;
