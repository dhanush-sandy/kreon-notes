import express from "express";
import {
  getReminderNotes,
  createReminderNote,
  updateReminderNote,
  deleteReminderNote,
  updateReminderStatus,
  sendReminderNotification,
  scheduleReminder,
  cancelReminder,
  triggerStatusUpdates,
  triggerCompletionUpdates,
} from "../controllers/reminder-notes.controller.js";

const router = express.Router();

// Get all reminder notes for a user
router.get("/", getReminderNotes);

// Create a new reminder note
router.post("/", createReminderNote);

// Update an existing reminder note
router.put("/:noteId", updateReminderNote);

// Delete a reminder note
router.delete("/:noteId", deleteReminderNote);

// Update reminder status
router.put("/status/:noteId", updateReminderStatus);

// Send a notification for a reminder
router.post("/notify/:noteId", sendReminderNotification);

// Schedule a reminder notification
router.post("/schedule/:noteId", scheduleReminder);

// Cancel a scheduled reminder notification
router.delete("/schedule/:noteId", cancelReminder);

// Manually trigger status updates (for testing)
router.post("/trigger-status-updates", triggerStatusUpdates);

// Manually trigger completion updates (for testing)
router.post("/trigger-completion-updates", triggerCompletionUpdates);

export default router;
