import { useEffect, useRef, useState } from "react";

import "./style.css";

import { getUserAudioPermission } from "~/helpers/audio";
import {
  retrieveApiKey,
  retrieveDictionary,
  storeApiKey,
  storeDictionary,
  type DictionaryWord,
} from "~/helpers/storage";

import { Dictionary } from "./components/Dictionary";
import { getEmbedding } from "./helpers/gpt";

function Options() {
  const [hasMicPermission, setHasMicPermission] = useState<boolean>();
  const [apiKey, setApiKey] = useState<string>();
  const [changeKeyOpen, setChangeKeyOpen] = useState(false);
  const apiKeyInput = useRef<HTMLInputElement>();
  const [dictionary, setDictionary] = useState<DictionaryWord[]>();

  const refreshMicPermission = async () => {
    setHasMicPermission(await getUserAudioPermission());
  };

  const focusApiKey = () => {
    apiKeyInput.current.focus();
  };

  const onSubmitApiKey = () => {
    storeApiKey(apiKeyInput.current.value);
    setChangeKeyOpen(false);
  };

  const onAddWord = async (word: string) => {
    const embedding = await getEmbedding(word, apiKey);
    const newDictionary = [...dictionary, { text: word, embedding }];
    setDictionary(newDictionary);
    storeDictionary(newDictionary);
  };

  const onDeleteWord = (i: number) => {
    if (i < 0 || i >= dictionary.length)
      throw new Error("Tried to delete a nonexistent entry");
    const newDictionary = [...dictionary];
    newDictionary.splice(i, 1);
    setDictionary(newDictionary);
    storeDictionary(newDictionary);
  };

  const onUpdateWord = async (i: number, newWord: string) => {
    if (i < 0 || i >= dictionary.length)
      throw new Error("Tried to delete a nonexistent entry");
    const newEmbedding = await getEmbedding(newWord, apiKey);
    const newDictionary = [...dictionary];
    if (newWord) newDictionary[i] = { text: newWord, embedding: newEmbedding };
    else newDictionary.splice(i, 1);
    setDictionary(newDictionary);
    storeDictionary(newDictionary);
  };

  useEffect(() => {
    refreshMicPermission();
    retrieveApiKey().then((k) => setApiKey(k ?? ""));
    retrieveDictionary().then((d) => setDictionary(d));
  }, []);

  return (
    <div className="w-full flex flex-col items-center text-xl gap-8">
      <div className="w-full text-center mt-10 text-4xl font-bold">
        <h1>Awsm TTS</h1>
      </div>

      <div className="flex gap-2">
        {hasMicPermission ? (
          <div className="bg-green-200 border-2 border-green-800 px-3 py-1 rounded-full text-green-950">
            🎤 Microphone Permission
          </div>
        ) : hasMicPermission === undefined ? (
          <div className="bg-gray-200 border-2 border-gray-800 px-3 py-1 rounded-full text-gray-950">
            🎤 Microphone Permission
          </div>
        ) : (
          <div
            className="bg-red-200 border-2 border-red-800 px-3 py-1 rounded-full text-red-950 cursor-pointer"
            onClick={refreshMicPermission}
          >
            🎤 Microphone Permission
          </div>
        )}
        {apiKey ? (
          <div
            className="bg-green-200 border-2 border-green-800 px-3 py-1 rounded-full text-green-950 cursor-pointer"
            onClick={() => setChangeKeyOpen((v) => !v)}
          >
            🔑 API Key
          </div>
        ) : apiKey === undefined ? (
          <div className="bg-gray-200 border-2 border-gray-800 px-3 py-1 rounded-full text-gray-950">
            🔑 API Key
          </div>
        ) : (
          <div
            onClick={focusApiKey}
            className="bg-red-200 border-2 border-red-800 px-3 py-1 rounded-full text-red-950 cursor-pointer"
          >
            🔑 API Key
          </div>
        )}
      </div>
      {(apiKey === "" || changeKeyOpen) && (
        <form className="flex flex-col gap-3" onSubmit={onSubmitApiKey}>
          <h3>Please enter your OpenAI API key below:</h3>
          <input
            ref={apiKeyInput}
            required
            className="border rounded-3xl p-3"
            placeholder="sk-..."
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 border-2 border-blue-600 text-white px-3 py-1 hover:bg-blue-600 active:bg-blue-700 hover:border-blue-700 active:border-blue-800"
          >
            Save
          </button>
        </form>
      )}
      {hasMicPermission === false && (
        <div>Please enable your microphone permission!</div>
      )}
      {apiKey && hasMicPermission && !changeKeyOpen && (
        <div>You're all set! Add some words to your dictionary below!</div>
      )}
      <Dictionary
        words={dictionary}
        onAddWord={onAddWord}
        onDeleteWord={onDeleteWord}
        onUpdateWord={onUpdateWord}
      />
    </div>
  );
}

export default Options;
