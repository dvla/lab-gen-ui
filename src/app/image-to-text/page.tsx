'use client';
import { useState, ChangeEvent, useContext } from 'react';
import chatPageStyles from '../styles/ChatPage.module.scss';
import FixedPage from '../components/fixed-page';
import Generator from '../components/generator/generator';
import ModelSelect from '../components/options/model-select';
import { modelContext } from '../config/model-context-config';

const ImageToText = () => {
    const [variables, setVariables] = useState([
        { id: 'input', value: '' },
    ]);
    const { modelInfo } = useContext(modelContext);


    return (
        <>
            <FixedPage backButton={true} modelBanner={true}>
                <main>
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <h1 className="govuk-heading-l">Diagram to Text</h1>
                            <Generator variables={variables} model={modelInfo} showFileUpload={true}/>
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
                                    <ModelSelect variantLock='MULTIMODAL'/>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </main>
            </FixedPage>
        </>
    );
};

export default ImageToText;
