import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const result = await User.deleteOne({ email: session.user.email });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete account" }, { status: 500 });
  }
}
