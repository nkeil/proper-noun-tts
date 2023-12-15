<img src="https://github.com/nkeil/proper-noun-tts/assets/26151586/03a5f80c-9c1e-400c-9422-c6ab80cbe576" width="150" style="text-color: white">
<h1>
  🎙️ Awsm TTS &middot; Nicolas Keil
</h1>

A text-to-speech Chrome extension with proper noun support!

## Instructions

1. **Install packages** (using [pnpm](https://pnpm.io/))

```bash
pnpm install
```

2. Start development server

```bash
pnpm dev
```

3. Add the extension to Chrome. First, navigate to `chrome://extensions`. Then click "Load unpacked" at the top left, and open the folder `build/chrome-mv3-dev`. Then, pin the extension to your extensions bar.

4. Configure the extension. Click on the extension to open the popup menu, then click "Options" to open the options page. Here, you should accept access to the microphone, and enter your [OpenAI API key](https://platform.openai.com/account/api-keys). Then, add as many words to your dictionary as needed.

5. Create a transcription. Open the popup menu again, and click the record button to start a recording. Click it again after you've finished talking to end the recording; you can play it back using the <audio> element near the bottom. After a recording is processed, the transcribed text will appear in the text input in the center. Here, it can be edited if needed and copied to any webpage!

## Design/Implementation Tradeoffs

<!-- TODO -->

## Prompt Engineering

<!-- TODO -->

## Codebase Overview

<!-- TODO -->

## Extensibility

<!-- TODO -->
