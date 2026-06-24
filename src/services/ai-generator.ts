import { AIProvider, GenerateParams } from "../providers/types";
import { MockProvider } from "../providers/mock";
import { GeminiProvider } from "../providers/gemini";
import { OpenAIProvider } from "../providers/openai";
import { AnthropicProvider } from "../providers/anthropic";
import { GroqProvider } from "../providers/groq";

class AIGeneratorService {
  private getProvider(): AIProvider {
    const key = process.env.AI_PROVIDER_KEY;
    const providerType = (process.env.AI_PROVIDER || "mock").toLowerCase();

    // If key is set to placeholder_key, treat it as not configured
    if (!key || key === "placeholder_key" || providerType === "mock") {
      return new MockProvider();
    }

    switch (providerType) {
      case "gemini":
        return new GeminiProvider(key);
      case "openai":
        return new OpenAIProvider(key);
      case "anthropic":
        return new AnthropicProvider(key);
      case "groq":
        return new GroqProvider(key);
      default:
        return new MockProvider();
    }
  }

  async generateCoverLetter(params: GenerateParams): Promise<string> {
    const provider = this.getProvider();
    return provider.generate(params);
  }
}

export const aiGenerator = new AIGeneratorService();
export default aiGenerator;
