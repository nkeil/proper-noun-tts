import { createWhisperTranscription, sendGPTPrompt } from "./gpt";
import { retrieveDictionary } from "./storage";

const example =
  `Input: ${JSON.stringify({
    transcription: "Hello, my name is Nicholas and I am applying to Whisper.",
    dictionary: ["Nicolas", "Wispr"],
  })}\n` + "Output: Hello, my name is Nicolas and I am applying to Wispr.";

export const transcribeAudio = async (blob: Blob, apiKey: string) => {
  const dictionary = await retrieveDictionary();

  const transcription = await createWhisperTranscription(blob, apiKey);
  if (!transcription) return transcription;

  return await sendGPTPrompt({
    apiKey,
    messages: [
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
    ],
  });
};
