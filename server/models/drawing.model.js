import mongoose from "mongoose";

const DrawingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    drawingData: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "drawing",
      required: true,
    },
  },
  { timestamps: true }
);

export const Drawing = mongoose.model("Drawing", DrawingSchema);
