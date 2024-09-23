'use client';
import styles from '../styles/ChatPage.module.scss';
import FixedPage from '../components/fixed-page';
import Chat from '../components/chat';
import ModelSelect from '../components/options/model-select';
import { useContext } from 'react';
import { modelContext } from '../config/model-context-config';

const ChatPage = () => {
    const { modelInfo } = useContext(modelContext);

    return (
        <FixedPage backButton={true} modelBanner={true}>
            <h1 className={'govuk-heading-xl ' + styles.h1XL}>TechLab Chat</h1>
            <div className={'govuk-grid-row ' + ' ' + styles.gridRow}>
                <div className={'govuk-grid-column-three-quarters ' + styles.gridRowHalf}>
                    <Chat
                        showHistory={true}
                        placeholder={'What would you like to know?'}
                        rows={4}
                        body={{ modelKey: modelInfo.key }}
                    />
                </div>
                <div
                    className={'govuk-grid-column-one-quarter ' + styles.gridRowHalf}
                    style={{ padding: '15px', backgroundColor: '#f3f2f1' }}
                >
                    <fieldset className="govuk-fieldset">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                            <h1 className="govuk-fieldset__heading">Settings</h1>
                        </legend>
                        <div className="govuk-form-group">
                            <ModelSelect />
                        </div>
                    </fieldset>
                </div>
            </div>
        </FixedPage>
    );
};

export default ChatPage;
