import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/mongodb";
import CoverLetter from "@/models/CoverLetter";

/**
 * GET /api/coverletters
 * Retrieves cover letters belonging to the logged-in user.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const coverLetters = await CoverLetter.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, data: coverLetters }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve cover letters" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/coverletters
 * Creates a new cover letter associated with the logged-in user.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.position || !body.company || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, position, company, or content",
        },
        { status: 400 }
      );
    }

    // Attach user ID and save
    const newCoverLetter = await CoverLetter.create({
      ...body,
      userId: session.user.id,
      status: body.status || "Generated",
    });

    return NextResponse.json({ success: true, data: newCoverLetter }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create cover letter" },
      { status: 500 }
    );
  }
}
