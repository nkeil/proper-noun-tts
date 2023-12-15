import {
  compareEmbeddings,
  createWhisperTranscription,
  getEmbedding,
  sendGPTPrompt,
} from "./gpt";
import { retrieveDictionary } from "./storage";

const MAX_NUM_RELEVANT_WORDS = 5;

const example =
  `Input: ${JSON.stringify({
    transcription: "Hello, my name is Nicholas and I am applying to Whisper.",
    dictionary: ["Nicolas", "Wispr"],
  })}\n` + "Output: Hello, my name is Nicolas and I am applying to Wispr.";

export const transcribeAudio = async (blob: Blob, apiKey: string) => {
  const dictionary = await retrieveDictionary();

  const transcription = await createWhisperTranscription(blob, apiKey);
  if (!transcription) return transcription;

  const transcriptionEmbedding = await getEmbedding(transcription, apiKey);

  const temp = dictionary
    .map((word) => ({
      text: word.text,
      distance: compareEmbeddings(transcriptionEmbedding, word.embedding),
    }))
    .sort((w1, w2) => w2.distance - w1.distance);
  console.log(temp);

  const dictionaryEmbeddingComparisons = temp
    .slice(0, MAX_NUM_RELEVANT_WORDS)
    .map((word) => word.text);

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
          dictionary: dictionaryEmbeddingComparisons,
        }),
      },
    ],
  });
};
