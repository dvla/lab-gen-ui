'use client';
import { useState, useContext } from 'react';
import chatPageStyles from '../styles/ChatPage.module.scss';
import FixedPage from '../components/fixed-page';
import Generator, { Variable } from '../components/generator/generator';
import { modelContext } from '../config/model-context-config';
import ModelSelect from '../components/options/model-select';

const UserStory = () => {
    const [isGherkinChecked, setIsGherkinChecked] = useState(false);
    const [promptType, setPromptType] = useState('user-story');
    const [variables, setVariables] = useState<Variable[]>([
        { id: 'title', value: '' },
        { id: 'input', value: '', name: 'description' },
    ]);
    const [showSettings, setShowSettings] = useState(true);
    const { modelInfo } = useContext(modelContext);

    /**
     * Toggles the hasGherkin state variable to
     * the opposite of its current value when
     * this handler is called.
     */
    const handleCheckbox = () => {
        setIsGherkinChecked(!isGherkinChecked);
        setPromptType(isGherkinChecked ? 'user-story' : 'user-story-gherkin');
    };

    /**
     * Function to update the display settings.
     *
     * @param {boolean} display - the new display setting
     * @return {void}
     */
    const displaySettings = (display: boolean) => {
        setShowSettings(display);
    };

    return (
        <FixedPage backButton={true} modelBanner={true}>
            <main>
                <div className="govuk-grid-row">
                    <div className={showSettings ? 'govuk-grid-column-two-thirds' : 'govuk-grid-column-full'}>
                        <h1 className="govuk-heading-l">User Story Generator</h1>
                        <Generator
                            promptType={promptType}
                            variables={variables}
                            model={modelInfo}
                            showHistory={false}
                            displaySettings={displaySettings}
                        />
                    </div>
                    {showSettings && (
                        <div
                            className={'govuk-grid-column-one-third ' + chatPageStyles.gridRowHalf}
                            style={{ padding: '15px', backgroundColor: '#f3f2f1' }}
                        >
                            <fieldset className="govuk-fieldset">
                                <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                    <h1 className="govuk-fieldset__heading">Settings</h1>
                                </legend>
                                <div className="govuk-form-group">
                                    <ModelSelect />
                                </div>
                                <div className="govuk-form-group">
                                    <div className="govuk-checkboxes__item" data-module="govuk-checkboxes">
                                        <input
                                            className="govuk-checkboxes__input"
                                            type="checkbox"
                                            checked={isGherkinChecked}
                                            onChange={handleCheckbox}
                                        ></input>
                                        <label className="govuk-label govuk-checkboxes__label">
                                            Use Gherkin Syntax
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    )}
                </div>
            </main>
        </FixedPage>
    );
};

export default UserStory;
