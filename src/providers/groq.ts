import { AIProvider, GenerateParams } from "./types";
import Groq from "groq-sdk";

export class GroqProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(params: GenerateParams): Promise<string> {
    const { position, company, tone, jobDescription, resumeText } = params;

    try {
      const groq = new Groq({ apiKey: this.apiKey });
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an expert career advisor and professional writer. Generate a highly tailored, ATS-optimized, professional cover letter. The tone must be ${tone}.
            
            Return ONLY the cover letter text. Do not include any introductory remarks, markdown formatting symbols (like triple backticks or code blocks), or additional instructions. Just the plain text cover letter starting with the candidate details or greeting.`,
          },
          {
            role: "user",
            content: `Please generate a cover letter for a ${position} position at ${company}.
            ${jobDescription ? `\nJob Description:\n${jobDescription}` : ""}
            ${resumeText ? `\nMy Resume / Achievements:\n${resumeText}` : ""}`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      return chatCompletion.choices[0]?.message?.content?.trim() || "";
    } catch (error: any) {
      throw new Error(`Groq generation failed: ${error.message}`);
    }
  }
}
