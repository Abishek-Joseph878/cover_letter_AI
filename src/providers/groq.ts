import { AIProvider, GenerateParams } from "./types";
import Groq from "groq-sdk";

export class GroqProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(params: GenerateParams): Promise<string> {
    const { position, company, tone, jobDescription, resumeText, senderName, senderEmail, senderPhone, senderAddress } = params;

    try {
      const groq = new Groq({ apiKey: this.apiKey });
      
      const senderInfoPrompt = senderName 
        ? `At the very beginning of the cover letter, you MUST output the sender's contact header exactly as follows (and nothing else before it):
${senderName}
${senderAddress || ""}
${senderPhone ? `Phone: ${senderPhone}` : ""}
${senderEmail ? `Email: ${senderEmail}` : ""}

Followed by a blank line, then the Date, then a blank line, then the hiring manager greeting.`
        : "";

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an expert career advisor and professional writer. Generate a highly tailored, ATS-optimized, professional cover letter. The tone must be ${tone}.
            
            ${senderInfoPrompt}
            
            Return ONLY the cover letter text. Do not include any introductory remarks, markdown formatting symbols (like triple backticks or code blocks), or additional instructions. Just the plain text cover letter starting with the sender details (if provided) or greeting.`,
          },
          {
            role: "user",
            content: `Please generate a cover letter for a ${position} position at ${company}.
            ${senderName ? `The sender's contact details are: Name: ${senderName}, Address: ${senderAddress}, Phone: ${senderPhone}, Email: ${senderEmail}.` : ""}
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
