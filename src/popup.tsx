import { useEffect, useRef, useState } from "react";

import "./style.css";

import copyToClipboard from "copy-to-clipboard";
import type { APIError } from "openai/error";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { FaCheck, FaRegClipboard } from "react-icons/fa";

import { Loading } from "./components/Loading";
import {
  getUserAudioPermission,
  startRecording,
  stopRecording,
} from "./helpers/audio";
import { retrieveApiKey, storeApiKey } from "./helpers/storage";
import { transcribeAudio } from "./helpers/transcription";

function Popup() {
  const [hasMicPermission, setHasMicPermission] = useState<boolean>();
  const [apiKey, setApiKey] = useState<string>();

  const [micOn, setMicOn] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const transcriptionInput = useRef<HTMLTextAreaElement>();
  const [hasCopied, setHasCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement>();

  const refreshMicPermission = async () => {
    setHasMicPermission(await getUserAudioPermission());
  };

  const toggleMic = async () => {
    if (!hasMicPermission || !apiKey) return openOptionsPage();

    if (!micOn) {
      await startRecording();
    } else {
      try {
        const blob = await stopRecording();
        audioRef.current.src = URL.createObjectURL(blob);

        setIsTranscribing(true);
        transcribeAudio(blob, apiKey)
          .then((result) => {
            transcriptionInput.current.value = result;
          })
          .catch((e: APIError) => {
            console.log(JSON.stringify(e));
            if (e.code === "invalid_api_key") {
              storeApiKey("");
              chrome.runtime.openOptionsPage();
            }
            console.error(e);
          })
          .finally(() => {
            setIsTranscribing(false);
          });
      } catch (error) {
        console.error("Error occurred during transcription:", error);
      }
    }
    setMicOn((v) => !v);
  };

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  const onClickClipboard = () => {
    setHasCopied(true);
    copyToClipboard(transcriptionInput.current.value);
  };

  useEffect(() => {
    refreshMicPermission();
    retrieveApiKey().then(setApiKey);
  }, []);

  return (
    <div className="flex flex-col p-10 min-w-[300px] min-h-[400px] justify-between gap-5 items-center">
      <h1 className="text-3xl font-bold">Awesome TTS</h1>
      <button
        onClick={toggleMic}
        className={`rounded-full border-4 h-20 w-20 shadow-md active:translate-y-0.5 transition-all ${
          !hasMicPermission || !apiKey || isTranscribing
            ? "bg-gray-200 border-gray-300"
            : micOn
            ? "bg-green-400 border-green-900"
            : "bg-red-400 border-red-600 hover:bg-[#F45B5B] active:bg-red-500 active:border-red-700"
        }`}
        disabled={isTranscribing}
      >
        <div className="mx-auto w-fit">
          {isTranscribing ? (
            <Loading />
          ) : micOn ? (
            <BsFillMicFill size={30} />
          ) : (
            <BsFillMicMuteFill size={30} />
          )}
        </div>
      </button>
      <div className="flex items-center border border-gray-200 px-3 py-2 rounded-lg">
        <textarea
          ref={transcriptionInput}
          className="focus:outline-none"
          onChange={() => setHasCopied(false)}
          rows={7}
        />
        {hasCopied ? (
          <FaCheck
            className="cursor-pointer"
            onClick={onClickClipboard}
            size={15}
          />
        ) : (
          <FaRegClipboard
            className="cursor-pointer"
            onClick={onClickClipboard}
            size={15}
          />
        )}
      </div>
      <audio className="w-full" ref={audioRef} controls />
      <button
        className="w-full rounded-lg bg-gray-100 border-2 border-gray-300 text-black px-3 py-1 hover:bg-gray-200 active:bg-gray-300 active:border-gray-400"
        onClick={openOptionsPage}
      >
        Options
      </button>
    </div>
  );
}

export default Popup;
