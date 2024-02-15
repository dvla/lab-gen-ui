import { NextResponse } from 'next/server';
import * as Gherkin from '@cucumber/gherkin';
import { IdGenerator } from '@cucumber/messages';
import { fullValidation } from './gherkinValidators';

/**
 * Extracts Gherkin code from a string containing Gherkin code blocks.
 *
 * Splits the input string on '```gherkin' to extract the Gherkin code block,
 * then splits on '```' again to remove any trailing delimiter.
 *
 * @param inputText - The string containing Gherkin code blocks.
 * @returns The extracted Gherkin code string.
 */
const extractGherkin = (inputText: string) => {
    if (inputText) {
        const gherkinCodeblock = inputText.split('```gherkin');
        if (gherkinCodeblock.length > 1) {
            return gherkinCodeblock[1].split('```')[0];
        }
    }
    return '';
}

/**
 * Parses the input text using Gherkin parser.
 *
 * @param inputText - The text to be parsed.
 * @returns The parsed Gherkin AST (Abstract Syntax Tree).
 */
const getParser = (inputText: string) => {
    var uuidFn = IdGenerator.uuid();
    var builder = new Gherkin.AstBuilder(uuidFn);
    var matcher = new Gherkin.GherkinClassicTokenMatcher();

    try {
        const parser = new Gherkin.Parser(builder, matcher);
        return parser.parse(inputText);
    } catch (error) {
        console.log('PARSER ERROR');
        throw error;
    }
}

export const POST = async (req: Request, res: NextResponse) => {
    try {
        const jsonBody = await req.json();
        const gherkinDocument = getParser(extractGherkin(jsonBody));

        const validation = fullValidation(gherkinDocument);
        if (validation.valid) {
            return NextResponse.json({ message: 'Gherkin data is valid', validation: validation, content: jsonBody }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Gherkin data is invalid', validation: validation, content: jsonBody }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Error Processing Gherkin' }, { status: 500 });
    }
};
