import { useEffect, useState } from "react";

import "./style.css";

import { getUserMediaPermission } from "./helpers/audio";
import { retrieveApiKey } from "./helpers/storage";

function Popup() {
  const [data, setData] = useState("");

  const [hasMicPermission, setHasMicPermission] = useState<boolean>();
  const [apiKey, setApiKey] = useState<string>();

  const refreshMicPermission = async () => {
    setHasMicPermission(await getUserMediaPermission());
  };

  const recordAudio = async () => {
    // await startRecording();
    getUserMediaPermission().then((v) => console.log(v));
  };

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  useEffect(() => {
    refreshMicPermission();
    retrieveApiKey().then(setApiKey);
  }, []);

  return (
    <div className="flex flex-col p-10 min-w-[300px] min-h-[400px] justify-between">
      <h1 className="text-2xl">Awesome TTS</h1>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <button onClick={recordAudio}>Record</button>
      <button
        className="w-full rounded-lg bg-gray-500 border-2 border-gray-600 text-white px-3 py-1 hover:bg-gray-600 active:bg-gray-700 hover:border-gray-700 active:border-gray-800"
        onClick={openOptionsPage}
      >
        Options
      </button>
    </div>
  );
}

export default Popup;
