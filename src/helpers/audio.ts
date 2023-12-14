let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

export async function startRecording(): Promise<void> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
    recordedChunks.push(event.data);
  });
  mediaRecorder.start();
}

export async function stopRecording(): Promise<Blob> {
  return new Promise((resolve) => {
    if (!mediaRecorder) throw new Error("MediaRecorder is not initialized.");
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
      recordedChunks = [];
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      resolve(audioBlob);
    });
    mediaRecorder.stop();
  });
}

export async function getUserAudioPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
