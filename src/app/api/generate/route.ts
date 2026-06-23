import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import aiGenerator from "@/services/ai-generator";

/**
 * POST /api/generate
 * Triggers cover letter generation based on inputs.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { position, company, tone, jobDescription, resumeText } = body;

    if (!position || !company) {
      return NextResponse.json(
        { success: false, error: "Position and Company Name are required" },
        { status: 400 }
      );
    }

    const content = await aiGenerator.generateCoverLetter({
      position,
      company,
      tone: tone || "Professional",
      jobDescription,
      resumeText,
    });

    return NextResponse.json({ success: true, data: content }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
