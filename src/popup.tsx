import { useEffect, useRef, useState } from "react";

import "./style.css";

import copyToClipboard from "copy-to-clipboard";
import { BsFillMicFill, BsFillMicMuteFill, BsThreeDots } from "react-icons/bs";
import { FaCheck, FaRegClipboard } from "react-icons/fa";

import {
  getUserAudioPermission,
  startRecording,
  stopRecording,
} from "./helpers/audio";
import { retrieveApiKey } from "./helpers/storage";
import { transcribeAudio } from "./helpers/transcription";

function Popup() {
  const [hasMicPermission, setHasMicPermission] = useState<boolean>();
  const [apiKey, setApiKey] = useState<string>();

  const [micOn, setMicOn] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const transcriptionInput = useRef<HTMLInputElement>();
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
            setIsTranscribing(false);
            transcriptionInput.current.value = result;
          })
          .catch((e) => console.error(e));
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
    <div className="flex flex-col p-10 min-w-[300px] min-h-[400px] justify-between items-center">
      <h1 className="text-3xl font-rubik-doodle">Awesome TTS</h1>
      <button
        onClick={toggleMic}
        className={`rounded-full border-2 h-20 w-20 ${
          !hasMicPermission || !apiKey || isTranscribing
            ? "bg-gray-200 border-gray-300"
            : micOn
            ? "bg-green-400 border-green-900"
            : "bg-red-400 border-red-900"
        }`}
        disabled={isTranscribing}
      >
        <div className="mx-auto w-fit">
          {isTranscribing ? (
            <BsThreeDots size={30} />
          ) : micOn ? (
            <BsFillMicFill size={30} />
          ) : (
            <BsFillMicMuteFill size={30} />
          )}
        </div>
      </button>
      <div className="flex items-center border border-gray-200 px-3 py-2 rounded-lg">
        <input
          ref={transcriptionInput}
          className="focus:outline-none"
          onChange={() => setHasCopied(false)}
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
