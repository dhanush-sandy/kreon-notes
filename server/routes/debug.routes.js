import express from "express";
import cronService from "../services/cron.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Trigger cron job manually
router.get("/trigger-cron", async (req, res) => {
  try {
    console.log("Manually triggering reminder check...");
    await cronService.checkUpcomingReminders();
    res.json({ success: true, message: "Reminder check triggered" });
  } catch (error) {
    console.error("Error triggering reminder check:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check models and database
router.get("/check-models", async (req, res) => {
  try {
    const results = {};

    // Check Notes model
    try {
      const { Notes } = await import("../models/notes.model.js");
      results.notesModelExists = !!Notes;

      if (Notes) {
        const allNotes = await Notes.find({});
        results.totalNotesCount = allNotes.length;
        results.reminderNotesCount = (
          await Notes.find({ type: "reminder" })
        ).length;

        if (allNotes.length > 0) {
          results.sampleNote = allNotes[0];
        }
      }
    } catch (notesError) {
      results.notesModelError = notesError.message;
    }

    // Check Reminder model
    try {
      const { reminder } = await import("../models/reminder.model.js");
      results.reminderModelExists = !!reminder;

      if (reminder) {
        const allReminders = await reminder.find({});
        results.totalRemindersCount = allReminders.length;

        if (allReminders.length > 0) {
          results.sampleReminder = allReminders[0];
        }
      }
    } catch (reminderError) {
      results.reminderModelError = reminderError.message;
    }

    // Check which model is used in cron service
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const cronServicePath = path.join(
        __dirname,
        "../services/cron.service.js"
      );
      const cronServiceCode = fs.readFileSync(cronServicePath, "utf8");

      results.cronServiceImports = cronServiceCode.match(/import.*from/g);
      results.notesModelImport = cronServiceCode.includes("import { Notes }");
      results.reminderModelImport = cronServiceCode.includes(
        "import { reminder }"
      );
    } catch (fsError) {
      results.fileReadError = fsError.message;
    }

    res.json(results);
  } catch (error) {
    console.error("Error checking models:", error);
    res.status(500).json({ error: error.message });
  }
});

// Test email sending
router.get("/test-email", async (req, res) => {
  try {
    const { email, type } = req.query;
    const testEmail = email || "test@example.com";
    const emailType = type || "regular"; // 'regular' or 'gmail'

    console.log(`Testing email service (type: ${emailType})...`);
    const emailService = await import("../services/email.service.js");

    // Force re-initialization of the transporter if testing Gmail specifically
    if (emailType === "gmail" && process.env.GMAIL_USER) {
      console.log("Testing Gmail OAuth2 specifically...");
      // Clear the existing transporter to force re-initialization
      await emailService.default.initializeTransporter();
    }

    const result = await emailService.sendEmail(
      testEmail,
      "Test Email from Kreon Notes",
      "This is a test email from Kreon Notes",
      "<h1>Test Email</h1><p>This is a test email from Kreon Notes</p>"
    );

    console.log("Email test result:", result);
    res.json({
      ...result,
      emailType,
      usingGmail:
        emailType === "gmail" ||
        (process.env.GMAIL_USER &&
          process.env.GMAIL_CLIENT_ID &&
          process.env.GMAIL_REFRESH_TOKEN),
    });
  } catch (error) {
    console.error("Error testing email:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a test reminder
router.post("/create-test-reminder", async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Create a reminder 5 minutes from now
    const reminderDate = new Date();
    reminderDate.setMinutes(reminderDate.getMinutes() + 5);

    // Determine which model to use
    let ReminderModel;
    try {
      const { reminder } = await import("../models/reminder.model.js");
      ReminderModel = reminder;
    } catch (error) {
      const { Notes } = await import("../models/notes.model.js");
      ReminderModel = Notes;
    }

    const newReminder = new ReminderModel({
      userId,
      title: "Test Reminder",
      description: "This is a test reminder created via debug endpoint",
      type: "reminder",
      reminderDate,
      reminderStatus: "pending",
      notificationSent: false,
      color: "blue-200",
      email: email || undefined,
      notificationType: email ? "email" : "none",
    });

    const savedReminder = await newReminder.save();

    res.json({
      success: true,
      message: "Test reminder created",
      reminder: savedReminder,
      willTriggerAt: reminderDate,
    });
  } catch (error) {
    console.error("Error creating test reminder:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
