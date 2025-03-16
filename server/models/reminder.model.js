// models/Note.js
import mongoose, { Schema } from "mongoose";

const ReminderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "amber-200",
    },
    type: {
      type: String,
      enum: ["note", "reminder"],
      default: "note",
    },
    reminderDate: {
      type: Date,
      required: function () {
        return this.type === "reminder";
      },
    },
    reminderStatus: {
      type: String,
      enum: ["pending", "completed", "missed"],
      default: "pending",
    },
    autoUpdated: {
      type: Boolean,
      default: false,
    },
    statusUpdateTime: {
      type: Date,
      default: null,
    },
    completionTime: {
      type: Date,
      default: null,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    notificationType: {
      type: String,
      enum: ["none", "sms", "email", "both", "browser"],
      default: "none",
    },
    scheduledMessageId: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ReminderSchema.index({ userId: 1, type: 1 });
ReminderSchema.index({ reminderDate: 1 }, { sparse: true });
ReminderSchema.index({ reminderStatus: 1 });

export const reminder = mongoose.model("Reminder", ReminderSchema);
