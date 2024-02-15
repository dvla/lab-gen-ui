'use client';
import styles from '../styles/ChatPage.module.scss';
import FixedPage from '../components/fixed-page';
import Chat from '../components/chat';

const ChatPage = () => {
    return (
        <FixedPage backButton={true}>
            <h1 className={'govuk-heading-xl ' + styles.h1XL}>TechLab Chat</h1>
            <div className={'govuk-grid-row ' + ' ' + styles.gridRow}>
                <div className={'govuk-grid-column-full ' + styles.gridRowHalf}>
                    <Chat 
                        showHistory={true}
                        placeholder={"What would you like to know?"}
                        rows={4}
                   />
                </div>
            </div>
        </FixedPage>
    );
}

export default ChatPage;
