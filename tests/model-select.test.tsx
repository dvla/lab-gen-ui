/// <reference types="jest" />
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ModelSelect from '../src/app/components/options/model-select';
import useSWR from 'swr';

// Mock the useSWR hook using jest.mock and providing a typed mock
jest.mock('swr');
const mockedUseSWR = useSWR as jest.Mock;

const mockModels = [
    {
        provider: 'AZURE',
        variant: 'ADVANCED',
        family: 'GPT',
        description: 'GPT-4 - The cutting-edge in language models, offering premium capabilities at a higher cost',
        location: 'London',
        key: 'AZUREGPTADVANCED',
    },
    {
        provider: 'AZURE',
        variant: 'GENERAL',
        family: 'GPT',
        description: 'GPT-3.5 - A faster and cheaper yet still great for the build',
        location: 'London',
        key: 'AZUREGPTGENERAL',
    },
    {
        provider: 'AZURE',
        variant: 'MULTIMODAL',
        family: 'GPT',
        description:
            'OpenAI GPT-4o, Multimodal model that blends visual and textual analysis for comprehensive understanding',
        location: 'Sweden',
        key: 'AZUREGPTMULTIMODAL',
    },
    {
        provider: 'AZURE',
        variant: 'EXPERIMENTAL',
        family: 'GPT',
        description:
            "OpenAI's newest AI model, GPT4o, elevates digital interactions with enhanced speed, intelligence, and multilingual voice features.",
        location: 'Sweden',
        key: 'AZUREGPTEXPERIMENTAL',
    },
    {
        provider: 'BEDROCK',
        variant: 'GENERAL',
        family: 'CLAUDE',
        description: "Claude 3 Haiku is Anthropic's fastest, most compact model for near-instant responsiveness",
        location: 'London',
        key: 'BEDROCKCLAUDEGENERAL',
    },
    {
        provider: 'BEDROCK',
        variant: 'ADVANCED',
        family: 'CLAUDE',
        description: 'Claude 3 Sonnet strikes the balance between intelligence and speed',
        location: 'London',
        key: 'BEDROCKCLAUDEADVANCED',
    },
    {
        provider: 'BEDROCK',
        variant: 'MULTIMODAL',
        family: 'CLAUDE',
        description: 'Claude 3 Sonnet strikes the balance between intelligence and speed',
        location: 'London',
        key: 'BEDROCKCLAUDEMULTIMODAL',
    },
    {
        provider: 'BEDROCK',
        variant: 'EXPERIMENTAL',
        family: 'CLAUDE',
        description: "Claude 3.5 Sonnet is Anthropic's next-level, powerful model",
        location: 'USA',
        key: 'BEDROCKCLAUDEEXPERIMENTAL',
    },
    {
        provider: 'VERTEX',
        variant: 'GENERAL',
        family: 'GEMINI',
        description: "Google's Gemini 1.0 Pro model",
        location: 'London',
        key: 'VERTEXGEMINIGENERAL',
    },
    {
        provider: 'VERTEX',
        variant: 'ADVANCED',
        family: 'GEMINI',
        description: "Google's Gemini 1.5 Pro Preview 0409",
        location: 'London',
        key: 'VERTEXGEMINIADVANCED',
    },
    {
        provider: 'VERTEX',
        variant: 'MULTIMODAL',
        family: 'GEMINI',
        description: "Google's Gemini Pro Vision (Multimodal)",
        location: 'London',
        key: 'VERTEXGEMINIMULTIMODAL',
    },
];

describe('ModelSelect', () => {
    beforeEach(() => {
        // Reset the mock before each test to ensure a clean slate
        mockedUseSWR.mockReset();

        // Set the default mock implementation before each test
        mockedUseSWR.mockReturnValue({
            data: mockModels,
            error: null,
            isLoading: false,
        });
    });

    it('renders Multimodal only', () => {
        const variantLock = ['MULTIMODAL'];
        const tree = render(<ModelSelect variantLock={variantLock} />);
        expect(tree.container).toMatchSnapshot();
    });

    it('renders default variant lock', () => {
        // No need to define variant lock
        const tree = render(<ModelSelect />);
        expect(tree.container).toMatchSnapshot();
    });

    it('renders EXPERIMENTAL variant lock', () => {
        const variantLock = ['EXPERIMENTAL'];
        const tree = render(<ModelSelect variantLock={variantLock} />);
        expect(tree.container).toMatchSnapshot();
    });

    it('does not render JOHN variant lock', () => {
        const variantLock = ['JOHN'];
        const tree = render(<ModelSelect variantLock={variantLock} />);
        expect(tree.container).toMatchSnapshot();
    });
});
