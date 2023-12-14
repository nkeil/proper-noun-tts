export async function getUserMediaPermission() {
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
