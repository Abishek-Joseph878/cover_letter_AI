import { AIProvider, GenerateParams } from "./types";

export class OpenAIProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(params: GenerateParams): Promise<string> {
    const { position, company, tone, jobDescription, resumeText, senderName, senderEmail, senderPhone, senderAddress } = params;

    try {
      const senderInfoPrompt = senderName 
        ? `At the very beginning of the cover letter, you MUST output the sender's contact header exactly as follows (and nothing else before it):
${senderName}
${senderAddress || ""}
${senderPhone ? `Phone: ${senderPhone}` : ""}
${senderEmail ? `Email: ${senderEmail}` : ""}

Followed by a blank line, then the Date, then a blank line, then the hiring manager greeting.`
        : "";

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an expert career advisor and professional writer. Generate a highly tailored, ATS-optimized, professional cover letter. The tone must be ${tone}.
              
              ${senderInfoPrompt}
              
              Return ONLY the cover letter text, with no extra conversational formatting, intro, or explanations.`,
            },
            {
              role: "user",
              content: `Please generate a cover letter for a ${position} position at ${company}.
              ${senderName ? `The sender's details are: Name: ${senderName}, Address: ${senderAddress}, Phone: ${senderPhone}, Email: ${senderEmail}.` : ""}
              ${jobDescription ? `\nJob Description:\n${jobDescription}` : ""}
              ${resumeText ? `\nMy Resume / Achievements:\n${resumeText}` : ""}`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error: any) {
      throw new Error(`OpenAI generation failed: ${error.message}`);
    }
  }
}
