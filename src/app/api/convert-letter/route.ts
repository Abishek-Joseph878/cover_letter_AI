import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import Groq from "groq-sdk";
// @ts-ignore
import { PDFParse } from "pdf-parse";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.ATS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "ATS/Conversion API key is not configured" }, { status: 500 });
    }

    const formData = await request.formData();
    const targetType = formData.get("targetType") as string;
    const file = formData.get("file") as File | null;
    const manualText = formData.get("text") as string | null;

    if (!targetType) {
      return NextResponse.json({ success: false, error: "Target conversion type is required" }, { status: 400 });
    }

    let sourceText = "";

    // 1. Extract text from uploaded file if present
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.name.endsWith(".pdf")) {
        try {
          const parser = new PDFParse({ data: buffer });
          const parsedData = await parser.getText();
          sourceText = parsedData.text || "";
          await parser.destroy();
        } catch (pdfError: any) {
          return NextResponse.json({ success: false, error: `Failed to parse PDF: ${pdfError.message}` }, { status: 400 });
        }
      } else if (file.name.endsWith(".txt")) {
        sourceText = buffer.toString("utf-8");
      } else {
        return NextResponse.json({ success: false, error: "Unsupported file format. Please upload a PDF or TXT file." }, { status: 400 });
      }
    } else if (manualText && manualText.trim().length > 0) {
      sourceText = manualText;
    }

    if (!sourceText || sourceText.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Please upload a document or enter the text manually" }, { status: 400 });
    }

    // 2. Perform letter conversion using Groq
    const groq = new Groq({ apiKey });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert copywriter and document editor.
Your task is to completely convert the provided letter text to match the requested format: "${targetType}".

The target formats can vary from:
- A romantic letter to an individual (personal, emotional, warm, loving).
- A serious CV / resume application (highly professional, achievement-oriented, formal).
- Other styles (casual, creative, academic).

Completely rewrite the introduction, tone, greeting, structure, and vocabulary to fit the "${targetType}" target. However, retain or adapt relevant core details (names, dates, positions, or accomplishments) if they fit the new style.
Return ONLY the converted letter text. Do not include markdown code fences (like \`\`\`), introductory greetings from yourself, or notes.`,
        },
        {
          role: "user",
          content: `Convert this letter to "${targetType}" format:\n\n${sourceText}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const convertedText = chatCompletion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ success: true, data: convertedText }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to convert letter format" }, { status: 500 });
  }
}
