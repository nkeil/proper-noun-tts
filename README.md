<h1>
  🎙️ Smart TTS &middot; Nicolas Keil
</h1>

A text-to-speech Chrome extension with support for a proper noun dictionary!

## Instructions

1. Install packages (using [pnpm](https://pnpm.io/))

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

This project went through a few iterations, but I eventually settled on using [Plasmo](https://www.plasmo.com), a browser extension framework that reduces a lot of the technical burden behind the scenes. Though I've never made a Chrome extension before, I knew that a website wouldn't cut it, since this is a tool best extended to every webpage you visit, rather than just a single webpage. After going through two rounds of trying to implement a Chrome extension from scratch, I decided that in the interest of time, Plasmo was the best option, providing sensible defaults like zero-configuration React/TypeScript support and hot-reload.

When implementing the transcription service, I considered using the native browser [SpeechRecognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), but after comparing results between that and OpenAI's Whisper, I felt that Whisper's accuracy was higher in many cases. Since I was already planning to collect the user's OpenAI key, this would be a simple addition. Since Chrome's SpeechRecognition API also calls an external server, the latency difference is hardly noticeable.

I chose GPT-4 for post-transcription processing, since it's currently the leading standard of commercially available LLM technology.

I chose to go without a backend server since for a project of this size, the code actions can easily be performed in the user's browser. For more ideas for moving to a server model with dedicated storage for vector embeddings, see the [extensibility](#Extensibility) section.

Data is stored in the browser's LocalStorage. I considered using Chrome's [sync storage](https://developer.chrome.com/docs/extensions/reference/api/storage), which maintains state across any Chrome browser the user is logged into. However, OpenAI embeddings are 1536-dimensional vectors, and that exceeded the storage capacity of sync. LocalStorage was the next best bet while avoiding an external system (again, see [extensibility](#Extensibility) for ideas on moving to such a system).

## Prompt Engineering

In order to maximize accuracy of results, I followed two primary prompt engineering strategies.

First, I created a chat completion query to update the raw transcription using a selection of dictionary values. The prompt uses common best practices such as clearly stating the task assigned, providing an example, and plainly demarking the user's input to prevent against prompt injection.

Second, in consideration of the possibility of massive dictionary sizes, I felt it was important to limit the number of dictionary values that would be sent with the query. I've found that when too much information is passed in an LLM query, it tends to disregard that data more readily; it's better to keep a prompt as short and direct as possible. In order to accomplish this, I save an embedding value with each dictionary entry, generated using OpenAI's [embeddings](https://platform.openai.com/docs/guides/embeddings) service. When a transcription is processed, the embedding for the transcription is compared to the embedding for each dictionary entry using [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity), and the 5 most similar entries are then used in the LLM prompt. In the [extensibility](#Extensibility) section, I talk about how this operation could be made more efficient with a vector database.

## Codebase Overview

- `/assets`: contains extension icon
- `/src`: contains main app component files
  - `/components`: miscellaneous React components that may be reused
  - `/helpers`: helper functions to access various services/apis
  - `options.tsx`: options page (what opens when you click "Options")
  - `popup.tsx`: popup menu

## Extensibility

There are endless ways to improve a project, but here are a few ideas I had.

First, I would allow the user to choose words directly from their transcription to add to the dictionary. In the transcription output, words could be highlighted, and when the user clicks on one, they can correct the mistake, and then the app would ask the user if they wanted to save the correction to their dictionary.

Second, I would integrate the extension into the page, rather than restricting the user to interaction through the popup menu. The extension could detect inputs in web pages and create a small icon in the bottom right of the input to add massive ease of use improvements.

Third, I would introduce an authentication system where the user could create an account, and instead of performing all actions itself within the browser, the extension would send requests to a server I managed. This server would have its own OpenAI API key to reduce the user's onboarding burden, and instead of storing dictionary values and embeddings in LocalStorage, I would use a vector database like ElasticSearch. A vector database would perform embedding comparison operations much more efficiently and easily scale to huge dictionaries.

Fourth, I would give the user more options to configure their experience. Users tend to have unique preferences, so giving them the option to change things like the color theme, whether or not the application modifies their current page, or the number of dictionary entries matched to their input at a time.
