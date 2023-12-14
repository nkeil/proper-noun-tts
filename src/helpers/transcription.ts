export const transcribeAudio = async (blob: Blob, apiKey: string) => {
  await new Promise((res) => setTimeout(res, 1000));
  return "test result";
};
