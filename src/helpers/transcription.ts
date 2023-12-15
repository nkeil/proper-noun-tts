import OpenAI, { toFile } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";

import { retrieveDictionary } from "./storage";

const example =
  `Input: ${JSON.stringify({
    transcription: "Hello, my name is Nicholas and I am applying to Whisper.",
    dictionary: ["Nicolas", "Wispr"],
  })}\n` + "Output: Hello, my name is Nicolas and I am applying to Wispr.";

export const transcribeAudio = async (blob: Blob, apiKey: string) => {
  const openAI = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const dictionary = await retrieveDictionary();

  const { text: transcription } = await openAI.audio.transcriptions.create({
    model: "whisper-1",
    file: await toFile(blob, "audio.wav"),
  });
  if (!transcription) return transcription;

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are correcting an automated transcript. You are given a transcription which may or may not be correct. Using the dictionary provided, provide a corrected transcript by updating ALL similar words to the value in the dictionary. Example:\n${example}`,
    },
    {
      role: "user",
      content: JSON.stringify({
        transcription,
        dictionary,
      }),
    },
  ];
  console.log(`Sending messages:\n${JSON.stringify(messages, null, 2)}`);

  const completion = await openAI.chat.completions.create({
    messages,
    model: "gpt-4",
  });

  const correctedTranscription = completion.choices[0].message.content;

  console.log({ transcription, correctedTranscription });

  return correctedTranscription;
};
