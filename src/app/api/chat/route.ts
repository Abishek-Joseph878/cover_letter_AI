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
          content: `You are a warm, friendly, and highly intelligent career coach assistant named CovaLet. 
          Respond in the style of ChatGPT—be encouraging, highly conversational, and exceptionally clear.
          Keep your responses very short, concise, and straight to the point (no unnecessary fluff, ideally under 1-2 paragraphs or brief bullet points). 
          Explain that CovaLet helps draft tailored cover letters, run ATS compatibility checks, and perform letter format conversions (like romantic or serious CV translation).`,
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
