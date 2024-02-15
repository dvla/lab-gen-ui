import {
    validateUniqueScenarioTitles,
    validateScenarioSteps,
    validateStepKeywords,
    fullValidation,
} from '../../src/app/api/gherkin/gherkinValidators';
import { GherkinDocument } from '@cucumber/messages';

describe('Gherkin Validators', () => {
    describe('validateUniqueScenarioTitles', () => {
        it('should return true for unique scenario titles', () => {
            const doc: GherkinDocument = {
                feature: {
                    location: { line: 1, column: 1 },
                    tags: [],
                    language: '',
                    keyword: '',
                    description: '',
                    name: 'My Feature',
                    children: [
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Scenario 1',
                                steps: [],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Scenario 2',
                                steps: [],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                    ],
                },
                comments: [],
            };
            expect(validateUniqueScenarioTitles(doc)).toBe(true);
        });

        it('should return false for non-unique scenario titles', () => {
            const doc: GherkinDocument = {
                feature: {
                    location: { line: 1, column: 1 },
                    tags: [],
                    language: '',
                    keyword: '',
                    description: '',
                    name: 'My Feature',
                    children: [
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Scenario 1',
                                steps: [],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Scenario 1',
                                steps: [],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                    ],
                },
                comments: [],
            };
            expect(validateUniqueScenarioTitles(doc)).toBe(false);
        });
    });

    describe('validateScenarioSteps', () => {
        it('should return true of all of the scenarios have steps', () => {
            const doc: GherkinDocument = {
                feature: {
                    location: { line: 1, column: 1 },
                    tags: [],
                    language: '',
                    keyword: '',
                    description: '',
                    name: 'My Feature',
                    children: [
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Scenario 1',
                                steps: [
                                    {
                                        id: '0',
                                        keyword: 'Given',
                                        text: 'The Pizza is ready to cook',
                                        location: { line: 1, column: 1 },
                                    },
                                    {
                                        id: '1',
                                        keyword: 'When',
                                        text: 'the pizza has all the toppings on it',
                                        location: { line: 1, column: 1 },
                                    },
                                ],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Scenario 2',
                                steps: [
                                    {
                                        id: '0',
                                        keyword: 'Given',
                                        text: 'I have something to eat',
                                        location: { line: 1, column: 1 },
                                    },
                                ],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                    ],
                },
                comments: [],
            };
            expect(validateScenarioSteps(doc)).toBe(true);
        });

        it("should return false if any of the scenarios don't have steps", () => {
            const gherkinDoc = {
                feature: {
                    location: { line: 1, column: 1 },
                    tags: [],
                    language: '',
                    keyword: '',
                    description: '',
                    name: 'My Feature',
                    children: [
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Scenario 1',
                                steps: [],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Scenario 2',
                                steps: [
                                    {
                                        id: '1',
                                        keyword: 'Given',
                                        text: 'I have something to eat',
                                        location: { line: 1, column: 1 },
                                    },
                                ],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                    ],
                },
                comments: [],
            };
            expect(validateScenarioSteps(gherkinDoc)).toBe(false);
        });
    });

    describe('validateStepKeywords', () => {
        it('should return true if all steps use valid keywords', () => {
            const doc: GherkinDocument = {
                feature: {
                    location: { line: 1, column: 1 },
                    tags: [],
                    language: '',
                    keyword: '',
                    description: '',
                    name: 'My Feature',
                    children: [
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Scenario 1',
                                steps: [
                                    {
                                        id: '0',
                                        keyword: 'Given',
                                        text: 'I have something to eat',
                                        location: { line: 1, column: 1 },
                                    },
                                    {
                                        id: '1',
                                        keyword: 'When',
                                        text: "I'm hungry",
                                        location: { line: 1, column: 1 },
                                    },
                                    {
                                        id: '2',
                                        keyword: 'And',
                                        text: "I've been out all day",
                                        location: { line: 1, column: 1 },
                                    },
                                    {
                                        id: '3',
                                        keyword: 'Then',
                                        text: 'I should feel better',
                                        location: { line: 1, column: 1 },
                                    },
                                ],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                    ],
                },
                comments: [],
            };
            expect(validateStepKeywords(doc)).toBe(true);
        }),
            it("should return false if any of the steps don't use valid keywords", () => {
                const doc: GherkinDocument = {
                    feature: {
                        location: { line: 1, column: 1 },
                        tags: [],
                        language: '',
                        keyword: '',
                        description: '',
                        name: 'My Feature',
                        children: [
                            {
                                scenario: {
                                    location: { line: 1, column: 1 },
                                    name: 'Scenario 1',
                                    steps: [
                                        {
                                            id: '0',
                                            keyword: 'INVALID',
                                            text: 'I have something to eat',
                                            location: { line: 1, column: 1 },
                                        },
                                        {
                                            id: '1',
                                            keyword: 'When',
                                            text: "I'm hungry",
                                            location: { line: 1, column: 1 },
                                        },
                                        {
                                            id: '2',
                                            keyword: 'And',
                                            text: "I've been out all day",
                                            location: { line: 1, column: 1 },
                                        },
                                        {
                                            id: '3',
                                            keyword: 'Then',
                                            text: 'I should feel better',
                                            location: { line: 1, column: 1 },
                                        },
                                    ],
                                    tags: [],
                                    keyword: 'Scenario',
                                    description: '',
                                    id: '1',
                                    examples: [],
                                },
                            },
                        ],
                    },
                    comments: [],
                };
                expect(validateStepKeywords(doc)).toBe(false);
            });
    });

    describe('fullValidation', () => {
        it('should return true when all validations pass', () => {
            const doc: GherkinDocument = {
                feature: {
                    location: { line: 1, column: 1 },
                    tags: [],
                    language: '',
                    keyword: '',
                    description: '',
                    name: 'My Feature',
                    children: [
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Prep the pizza',
                                steps: [
                                    {
                                        id: '0',
                                        keyword: 'Given',
                                        text: 'The Pizza is ready to cook',
                                        location: { line: 1, column: 1 },
                                    },
                                    {
                                        id: '1',
                                        keyword: 'When',
                                        text: 'the pizza has all the toppings on it',
                                        location: { line: 1, column: 1 },
                                    },
                                    {
                                        id: '2',
                                        keyword: 'Then',
                                        text: 'the pizza needs to go into the oven',
                                        location: { line: 1, column: 1 },
                                    },
                                ],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                        {
                            scenario: {
                                location: { line: 1, column: 1 },
                                name: 'Serve the pizza',
                                steps: [
                                    {
                                        id: '0',
                                        keyword: 'Given',
                                        text: 'The pizza has been cooked',
                                        location: { line: 1, column: 1 },
                                    },
                                    {
                                        id: '2',
                                        keyword: 'When',
                                        text: 'the pizza is nice and golden brown',
                                        location: { line: 1, column: 1 },
                                    },
                                    {
                                        id: '3',
                                        keyword: 'Then',
                                        text: 'the pizza is ready to remove',
                                        location: { line: 1, column: 1 },
                                    },
                                ],
                                tags: [],
                                keyword: 'Scenario',
                                description: '',
                                id: '1',
                                examples: [],
                            },
                        },
                    ],
                },
                comments: [],
            };
            expect(fullValidation(doc)).toBe(true);
        });

        it('should return false when scenario title validation fails', () => {
          const doc: GherkinDocument = {
            feature: {
                location: { line: 1, column: 1 },
                tags: [],
                language: '',
                keyword: '',
                description: '',
                name: 'My Feature',
                children: [
                    {
                        scenario: {
                            location: { line: 1, column: 1 },
                            name: 'Scenario 1',
                            steps: [],
                            tags: [],
                            keyword: 'Scenario',
                            description: '',
                            id: '1',
                            examples: [],
                        },
                    },
                    {
                        scenario: {
                            location: { line: 1, column: 1 },
                            name: 'Scenario 1',
                            steps: [],
                            tags: [],
                            keyword: 'Scenario',
                            description: '',
                            id: '1',
                            examples: [],
                        },
                    },
                ],
            },
            comments: [],
        };
            expect(fullValidation(doc)).toBe(false);
        });

        it('should return false when step validation fails', () => {
          const doc: GherkinDocument = {
            feature: {
                location: { line: 1, column: 1 },
                tags: [],
                language: '',
                keyword: '',
                description: '',
                name: 'My Feature',
                children: [
                    {
                        scenario: {
                            location: { line: 1, column: 1 },
                            name: 'Scenario 1',
                            steps: [],
                            tags: [],
                            keyword: 'Scenario',
                            description: '',
                            id: '1',
                            examples: [],
                        },
                    },
                ],
            },
            comments: [],
        };
            expect(fullValidation(doc)).toBe(false);
        });

        it('should return false when keyword validation fails', () => {
          const doc: GherkinDocument = {
            feature: {
                location: { line: 1, column: 1 },
                tags: [],
                language: '',
                keyword: '',
                description: '',
                name: 'My Feature',
                children: [
                    {
                        scenario: {
                            location: { line: 1, column: 1 },
                            name: 'Scenario 1',
                            steps: [
                                {
                                    id: '0',
                                    keyword: 'INVALID',
                                    text: 'I have something to eat',
                                    location: { line: 1, column: 1 },
                                },
                                {
                                    id: '1',
                                    keyword: 'When',
                                    text: "I'm hungry",
                                    location: { line: 1, column: 1 },
                                },
                                {
                                    id: '2',
                                    keyword: 'And',
                                    text: "I've been out all day",
                                    location: { line: 1, column: 1 },
                                },
                                {
                                    id: '3',
                                    keyword: 'Then',
                                    text: 'I should feel better',
                                    location: { line: 1, column: 1 },
                                },
                            ],
                            tags: [],
                            keyword: 'Scenario',
                            description: '',
                            id: '1',
                            examples: [],
                        },
                    },
                ],
            },
            comments: [],
        };
            expect(fullValidation(doc)).toBe(false);
        });
    });
});
