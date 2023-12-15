import OpenAI, { toFile } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";

export function getOpenAI(apiKey: string) {
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

export interface GPTParams {
  apiKey: string;
  messages: ChatCompletionMessageParam[];
}
export const sendGPTPrompt = async (input: GPTParams) => {
  console.log(`Sending prompt:`, JSON.stringify(input.messages));
  const response = await getOpenAI(input.apiKey).chat.completions.create({
    model: "gpt-4",
    messages: input.messages,
  });
  const reply = response.choices[0];
  const replyContent = reply.message.content.trim();
  console.log(`Received reply: ${replyContent}`);
  return replyContent;
};

export const createWhisperTranscription = async (
  blob: Blob,
  apiKey: string,
) => {
  const { text: transcription } = await getOpenAI(
    apiKey,
  ).audio.transcriptions.create({
    model: "whisper-1",
    file: await toFile(blob, "audio.wav"),
  });
  return transcription;
};
