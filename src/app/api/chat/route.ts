import { getClient } from "@/app/utils/models";
import { OpenAIStream, StreamingTextResponse } from "ai";


export async function POST(req: Request) {
  const { messages, prompt } = await req.json();
  const response = await getClient().chat.completions.create({
      model: 'gpt-4',
      stream: true,
      temperature: 0.1,
      messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
