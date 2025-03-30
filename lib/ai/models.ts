export const DEFAULT_CHAT_MODEL: string = "gemini-2.0-flash-001";

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: "gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    description: "Fast and efficient model for general chat",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Balanced performance for everyday conversations",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "Enhanced capabilities for complex tasks",
  },
  {
    id: "gemini-2.0-exp",
    name: "Gemini 2.0 Experimental",
    description: "Latest experimental features and capabilities",
  },
  {
    id: "llama-3.1-32B",
    name: "Llama 3.1 32B",
    description: "Open-source model with strong reasoning abilities",
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek Reasoning",
    description: "Specialized for step-by-step reasoning tasks",
  },
];
