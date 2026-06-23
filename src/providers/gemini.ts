import { AIProvider, GenerateParams } from "./types";

export class GeminiProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(params: GenerateParams): Promise<string> {
    const { position, company, tone, jobDescription, resumeText } = params;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert career advisor and professional writer. Generate a highly tailored, ATS-optimized, professional cover letter. The tone must be ${tone}.
                    
                    Please generate a cover letter for a ${position} position at ${company}.
                    ${jobDescription ? `\nJob Description:\n${jobDescription}` : ""}
                    ${resumeText ? `\nMy Resume / Achievements:\n${resumeText}` : ""}
                    
                    Return ONLY the cover letter text. Do not include any introductory remarks, markdown formatting symbols (like triple backticks or code blocks), or additional instructions. Just the plain text cover letter starting with the candidate details or greeting.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text.trim();
    } catch (error: any) {
      throw new Error(`Gemini generation failed: ${error.message}`);
    }
  }
}
