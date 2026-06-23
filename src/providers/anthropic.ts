import { AIProvider, GenerateParams } from "./types";

export class AnthropicProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(params: GenerateParams): Promise<string> {
    const { position, company, tone, jobDescription, resumeText } = params;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are an expert career advisor and professional writer. Generate a highly tailored, ATS-optimized, professional cover letter. The tone must be ${tone}.
              
              Please generate a cover letter for a ${position} position at ${company}.
              ${jobDescription ? `\nJob Description:\n${jobDescription}` : ""}
              ${resumeText ? `\nMy Resume / Achievements:\n${resumeText}` : ""}
              
              Return ONLY the cover letter text, with no extra conversational formatting, introduction, or explanations.`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Anthropic API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text.trim();
    } catch (error: any) {
      throw new Error(`Anthropic generation failed: ${error.message}`);
    }
  }
}
