import { Storage } from "@plasmohq/storage";

const storage = new Storage();

const KEYS = {
  openAI: "OPENAI_API_KEY",
  dictionary: "DICTIONARY",
};

export const storeApiKey = async (value: string) => {
  await storage.set(KEYS.openAI, value);
};
export const retrieveApiKey = () => {
  return storage.get(KEYS.openAI);
};

export const storeDictionary = async (value: string[]) => {
  await storage.set(KEYS.dictionary, JSON.stringify(value));
};
export const retrieveDictionary = async (): Promise<string[]> => {
  const dictionaryString = await storage.get(KEYS.dictionary);
  if (!dictionaryString) return [];
  return JSON.parse(dictionaryString);
};
