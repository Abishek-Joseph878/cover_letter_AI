import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, error: "Messages array is required" }, { status: 400 });
    }

    const apiKey = process.env.CHATBOT_API_KEY;
    if (!apiKey || apiKey === "placeholder_key") {
      return NextResponse.json({ success: false, error: "Chatbot API Key not configured" }, { status: 500 });
    }

    const groq = new Groq({ apiKey });
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a helpful and professional career coach and assistant for CoverLetter AI. 
          Your goals:
          1. Assist users with questions about cover letters, resumes, interview preparation, and job searching.
          2. Explain how CoverLetter AI works (it tailoring cover letters based on resume highlights and job descriptions to beat ATS screeners).
          
          Keep your responses clean, formatted in markdown where helpful, concise (under 3-4 paragraphs), encouraging, and professional.`,
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || "";
    return NextResponse.json({ success: true, reply }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to generate reply" }, { status: 500 });
  }
}
