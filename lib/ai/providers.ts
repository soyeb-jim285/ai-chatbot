import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { fal } from "@ai-sdk/fal";
import { google } from "@ai-sdk/google";
import { isTestEnvironment } from "../constants";
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test";

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        "chat-model": google("gemini-2.0-flash-001"),
        "chat-model-reasoning": wrapLanguageModel({
          model: groq("deepseek-r1-distill-llama-70b"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": google("gemini-2.0-flash-001"),
        "artifact-model": google("gemini-2.0-flash-001"),
      },
      imageModels: {
        "small-model": fal.image("fal-ai/fast-sdxl"),
      },
    });
