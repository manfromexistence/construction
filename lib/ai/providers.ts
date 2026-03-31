import "server-only";

import { createGroq } from "@ai-sdk/groq";
import { customProvider } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const myProvider = customProvider({
  languageModels: {
    base: groq("llama-3.3-70b-versatile"),
    "theme-generation": groq("llama-3.3-70b-versatile"),
    "prompt-enhancement": groq("llama-3.3-70b-versatile"),
  },
});
