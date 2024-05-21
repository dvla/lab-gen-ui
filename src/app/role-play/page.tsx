'use client';
import { ChangeEvent, FormEventHandler, useContext, useState } from 'react';
import { startCase, toLower } from 'lodash';
import FixedPage from '../components/fixed-page';
import ModelSelect from '../components/options/model-select';
import chatPageStyles from '../styles/ChatPage.module.scss';
import { Variable } from '../components/generator/generator';
import { modelContext } from '../config/model-context-config';
import TokenCounter from '../components/token-counter/token-counter';
import generatorStyles from '../styles/Generator.module.scss';
import styles from '../styles/ChatPage.module.scss';
import RolePlayChat from '../components/role-play-chat';
import rolePlayStyles from '../styles/RolePlay.module.scss';
import { convertVariablesToContent } from '../lib/utils';

const INFO_TEXT = 'Role play works better with advanced models';

/**
 * Represents a role-play page.
 */
const RolePlay = () => {
    const [variables, setVariables] = useState<Variable[]>([
        { id: 'role', value: '', name: 'Play the role of' },
        { id: 'name', value: '', name: 'Name' },
        { id: 'address', value: '', name: 'Address' },
        { id: 'registrationNumber', value: '', name: 'Registration Number' },
        { id: 'input', value: '', name: 'Situation' },
        { id: 'outcome', value: '', name: 'Customer Desired Outcome' },
    ]);
    const [content, setContent] = useState<string>('');
    const [formData, setFormData] = useState(variables);
    const { modelInfo } = useContext(modelContext);
    const [showSettings, setShowSettings] = useState(true);
    const [showChat, setShowChat] = useState(false);

    /**
     * Function to update the display settings.
     *
     * @param {boolean} display - the new display setting
     * @return {void}
     */
    const displaySettings = (display: boolean) => {
        setShowSettings(display);
    };

    /**
     * Resets the state of the page by hiding the chat and showing the settings.
     */
    const reset = () => {
        setShowChat(false);
        setShowSettings(true);
    };

    /**
     * Handles the form submission event.
     *
     * @param event - The form submission event.
     */
    const handleInput: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        if (displaySettings) {
            displaySettings(false);
        }

        setContent(convertVariablesToContent(variables, 'role-play'));
        setShowChat(true);
    };

    /**
     * Handles the input change event for a specific form field.
     * Updates the corresponding value in the form data state.
     *
     * @param event - The input change event.
     * @param index - The index of the form field in the form data array.
     */
    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
        index: number
    ) => {
        let newFormData = [...formData];
        newFormData[index].value = event.target.value;
        setFormData(newFormData);
    };

    /**
     * Renders the generator fields based on the provided form data.
     *
     * @param formData - An array of Variable objects representing the form data.
     * @returns An array of JSX elements representing the generator fields.
     */
    const showGeneratorFields = (formData: Variable[]) => {
        return formData.map(({ id, value, show, name }, index) =>
            show === false ? null : (
                <div className="govuk-form-group" key={id}>
                    <label className="govuk-label" htmlFor={id}>
                        {startCase(toLower(name ? name : id))}
                    </label>
                    {id === 'input' || id === 'description' ? (
                        <div>
                            <textarea
                                className={`govuk-textarea ${generatorStyles.textareaToken}`}
                                id={id}
                                name={id}
                                value={value}
                                rows={10}
                                onChange={(e) => handleInputChange(e, index)}
                            />
                            <TokenCounter text={value} />
                        </div>
                    ) : (
                        <input
                            className="govuk-input"
                            id={id}
                            name={id}
                            value={value}
                            type="text"
                            onChange={(e) => handleInputChange(e, index)}
                        />
                    )}
                </div>
            )
        );
    };

    return (
        <FixedPage backButton={true} modelBanner={true}>
            <div className={'govuk-grid-row ' + ' ' + styles.gridRow}>
                <div
                    className={
                        showSettings ? 'govuk-grid-column-two-thirds' : `govuk-grid-column-full ${styles.gridRowHalf}`
                    }
                >
                    <h1 className={`govuk-heading-l ${rolePlayStyles.marginBottomTen}`}>Role Play</h1>
                    {/* Role Play Setup */}
                    {!showChat && (
                        <>
                            <div className="govuk-inset-text">{INFO_TEXT}</div>
                            <form onSubmit={handleInput}>
                                <fieldset className="govuk-fieldset">{showGeneratorFields(formData)}</fieldset>
                                <button type="submit" className="govuk-button" data-module="govuk-button">
                                    Generate
                                </button>
                            </form>
                        </>
                    )}
                    {/* Role Play Chat */}
                    {showChat && (
                        <>
                            <RolePlayChat modelInfo={modelInfo} content={content} reset={reset} />
                        </>
                    )}
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
                        </fieldset>
                    </div>
                )}
            </div>
        </FixedPage>
    );
};

export default RolePlay;
