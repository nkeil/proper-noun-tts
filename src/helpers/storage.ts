import { Storage } from "@plasmohq/storage";

const storage = new Storage();

const KEYS = {
  openAI: "OPENAI_API_KEY",
};

export const storeApiKey = async (value: string) => {
  await storage.set(KEYS.openAI, value);
};
export const retrieveApiKey = () => {
  return storage.get(KEYS.openAI);
};
