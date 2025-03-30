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
        "gemini-2.0-flash-001": chatModel,
        "gemini-1.5-flash": chatModel,
        "gemini-1.5-pro": chatModel,
        "gemini-2.0-exp": chatModel,
        "llama-3.1-32B": reasoningModel,
        "deepseek-r1-distill-llama-70b": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        "gemini-2.0-flash-001": google("gemini-2.0-flash-001"),
        "gemini-1.5-flash": google("gemini-1.5-flash"),
        "gemini-1.5-pro": google("gemini-1.5-pro"),
        "gemini-2.0-exp": google("gemini-2.0-exp"),
        "llama-3.1-32B": groq("llama-3.1-32B"),
        "deepseek-r1-distill-llama-70b": wrapLanguageModel({
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
