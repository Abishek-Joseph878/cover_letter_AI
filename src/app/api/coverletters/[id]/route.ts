import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/mongodb";
import CoverLetter from "@/models/CoverLetter";

/**
 * GET /api/coverletters/[id]
 * Retrieves a single cover letter by ID, verifying user ownership.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const coverLetter = await CoverLetter.findById(id);
    if (!coverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (coverLetter.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this cover letter." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: coverLetter }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve cover letter" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/coverletters/[id]
 * Updates a cover letter by ID, verifying user ownership.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const coverLetter = await CoverLetter.findById(id);
    if (!coverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (coverLetter.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this cover letter." },
        { status: 403 }
      );
    }

    const updatedCoverLetter = await CoverLetter.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updatedCoverLetter }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update cover letter" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/coverletters/[id]
 * Deletes a cover letter by ID, verifying user ownership.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const coverLetter = await CoverLetter.findById(id);
    if (!coverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (coverLetter.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this cover letter." },
        { status: 403 }
      );
    }

    await CoverLetter.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Cover letter deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete cover letter" },
      { status: 500 }
    );
  }
}
