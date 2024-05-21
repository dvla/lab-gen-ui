import { Variable } from '@/app/components/generator/generator';
import { convertVariablesToContent } from '../../src/app/lib/utils';

describe('convertVariablesToContent', () => {
    it('should convert variables to a single input string for role-play prompt', () => {
        const variables: Variable[] = [
            { id: 'role', value: 'Doctor' },
            { id: 'name', value: 'John Doe' },
            { id: 'address', value: '123 Main St' },
            { id: 'registration', value: 'ABC123' },
            { id: 'situation', value: 'Patient is unwell' },
            { id: 'outcome', value: 'Diagnose the patient' },
        ];
        const promptID = 'role-play';

        const result = convertVariablesToContent(variables, promptID);

        expect(result).toEqual(`I will play the role of the DVLA. I want you to play the role of Doctor. Your name is John Doe. 
                        Your address is 123 Main St. Your registration number is ABC123. 
                        Situation: Patient is unwell. Desired Outcome: Diagnose the patient. 
                        Limit your answers to one sentence. Respond with "Yes I am ready" and I will start the conversation.`);
    });

    it('should return empty string if promptID does not match', () => {
        const variables: Variable[] = [
            { id: 'role', value: 'Doctor' },
            { id: 'name', value: 'John Doe' },
        ];
        const promptID = 'unknown';

        const result = convertVariablesToContent(variables, promptID);

        expect(result).toEqual('');
    });

    it('should return an empty string if variables is empty', () => {
        const variables: Variable[] = [];
        const promptID = 'role-play';

        const result = convertVariablesToContent(variables, promptID);

        expect(result).toEqual('');
    });
});
