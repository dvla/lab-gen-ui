import { getClient } from '@/app/utils/models';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { auth } from '@/app/lib/auth';

type ApiResponse = () => Response

export const POST = auth(async (req) => {
    if (req.auth) {
        const { messages, modelName } = await req.json();
        const response = await getClient(modelName).chat.completions.create({
            model: 'gpt-4',
            stream: true,
            temperature: 0.1,
            messages,
        });
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    }

    return Response.json({ message: 'Not authenticated' }, { status: 401 });
}) as ApiResponse;
