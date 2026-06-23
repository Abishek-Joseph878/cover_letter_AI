import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoverLetter extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  position: string;
  company: string;
  jobDescription?: string;
  resumeText?: string;
  content: string;
  status: "Draft" | "Generated" | "Archived";
  tone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoverLetterSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    jobDescription: {
      type: String,
      trim: true,
    },
    resumeText: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Cover letter content is required"],
    },
    status: {
      type: String,
      enum: ["Draft", "Generated", "Archived"],
      default: "Generated",
    },
    tone: {
      type: String,
      trim: true,
      default: "Professional",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent compiling model multiple times during Next.js hot reloads
const CoverLetter: Model<ICoverLetter> =
  mongoose.models.CoverLetter ||
  mongoose.model<ICoverLetter>("CoverLetter", CoverLetterSchema);

export default CoverLetter;
