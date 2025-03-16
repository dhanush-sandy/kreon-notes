import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "amber-200",
    },
    // Type field for different note types
    type: {
      type: String,
      enum: ["text", "drawing", "reminder"],
      default: "text",
    },
    // Fields for drawing notes
    drawingData: {
      type: String, // Store drawing as SVG or canvas data URL
      default: null,
    },
    // Fields for reminder notes
    reminderDate: {
      type: Date,
      default: null,
    },
    reminderStatus: {
      type: String,
      enum: ["pending", "completed", "missed"],
      default: "pending",
    },
    // Fields for Twilio integration
    phoneNumber: {
      type: String,
      default: null,
    },
    scheduledMessageId: {
      type: String,
      default: null,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by type
notesSchema.index({ userId: 1, type: 1 });
// Index for reminder date queries
notesSchema.index({ reminderDate: 1, reminderStatus: 1 });

export const Notes = mongoose.model("Notes", notesSchema);
