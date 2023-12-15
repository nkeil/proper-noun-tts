import { Storage } from "@plasmohq/storage";

const storage = new Storage({
  area: "local",
});

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

export interface DictionaryWord {
  text: string;
  embedding: number[];
}

export const storeDictionary = async (value: DictionaryWord[]) => {
  await storage.set(KEYS.dictionary, JSON.stringify(value));
};
export const retrieveDictionary = async (): Promise<DictionaryWord[]> => {
  const dictionaryString = await storage.get(KEYS.dictionary);
  if (!dictionaryString) return [];
  return JSON.parse(dictionaryString);
};
