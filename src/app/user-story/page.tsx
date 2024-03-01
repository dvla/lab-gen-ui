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

    return (
        <FixedPage backButton={true} modelBanner={true}>
                <main>
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <h1 className="govuk-heading-l">User Story Generator</h1>
                            <Generator promptType={promptType} variables={variables} model={modelInfo} showHistory={false} />
                        </div>
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
                    </div>
                </main>
            </FixedPage>
    );
};

export default UserStory;
