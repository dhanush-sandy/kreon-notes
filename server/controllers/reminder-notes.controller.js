import { reminder as ReminderModel } from "../models/reminder.model.js";
import twilio from "twilio";
import dotenv from "dotenv";
import * as emailService from "../services/email.service.js";
import cronService from "../services/cron.service.js";

dotenv.config();

// Initialize Twilio client
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Get all reminder notes for a user
export const getReminderNotes = async (req, res) => {
  try {
    const { userId, status, reminderStatus, search, autoUpdated } = req.query;

    console.log("Query parameters:", {
      userId,
      status,
      reminderStatus,
      search,
      autoUpdated,
    });

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const query = { userId, type: "reminder" };

    // Add status filter if provided (support both status and reminderStatus for backward compatibility)
    const statusValue = reminderStatus || status;
    if (
      statusValue &&
      ["pending", "completed", "missed"].includes(statusValue)
    ) {
      query.reminderStatus = statusValue;
      console.log(`Filtering by reminderStatus: ${statusValue}`);
    }

    // Add autoUpdated filter if provided
    if (autoUpdated !== undefined) {
      // Convert string to boolean
      query.autoUpdated = autoUpdated === "true";
      console.log(`Filtering by autoUpdated: ${query.autoUpdated}`);
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
      console.log(`Searching for: ${search}`);
    }

    console.log("Final query:", JSON.stringify(query));

    const notes = await ReminderModel.find(query).sort({ reminderDate: 1 });
    console.log(`Found ${notes.length} reminders matching the query`);

    // Check for overdue reminders that are still pending
    const now = new Date();
    const processedNotes = notes.map((note) => {
      const noteObj = note.toObject();

      // Add isOverdue flag for pending reminders that are past their due date
      if (
        noteObj.reminderStatus === "pending" &&
        new Date(noteObj.reminderDate) < now
      ) {
        noteObj.isOverdue = true;
      }

      return noteObj;
    });

    return res.status(200).json({
      success: true,
      data: processedNotes,
      message: processedNotes.length
        ? "Reminder notes retrieved successfully"
        : "No reminder notes found for this user",
    });
  } catch (error) {
    console.error("Error fetching reminder notes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create a new reminder note
export const createReminderNote = async (req, res) => {
  try {
    let {
      title,
      description,
      userId,
      color,
      reminderDate,
      phoneNumber,
      email,
      notificationType,
    } = req.body;

    // Trim input values
    title = title?.trim();
    description = description?.trim();
    color = color?.trim();
    phoneNumber = phoneNumber?.trim();
    email = email?.trim();

    // Default notification type if not provided
    notificationType =
      notificationType || (phoneNumber ? "sms" : email ? "email" : "none");

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and description",
      });
    }

    if (!reminderDate) {
      return res.status(400).json({
        success: false,
        message: "Reminder date is required",
      });
    }

    const reminderDateObj = new Date(reminderDate);
    const now = new Date();

    // Set default status based on date
    let reminderStatus = "pending";
    if (reminderDateObj < now) {
      reminderStatus = "missed";
    }

    // Validate notification type and required fields
    if (notificationType === "sms" && !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required for SMS notifications",
      });
    }

    if (notificationType === "email" && !email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required for email notifications",
      });
    }

    const noteData = {
      userId,
      title,
      description,
      color: color || "green-200",
      type: "reminder",
      reminderDate: reminderDateObj,
      reminderStatus,
      phoneNumber, // Store phone number for SMS notifications
      email, // Store email for email notifications
      notificationType, // Store notification preference
    };

    const newNote = new ReminderModel(noteData);
    const savedNote = await newNote.save();

    // Schedule notification based on type if reminder is pending
    if (reminderStatus === "pending") {
      if (notificationType === "sms" && phoneNumber) {
        await scheduleReminder(req, res, savedNote._id);
      } else if (notificationType === "email" && email) {
        // Email notifications are handled by the cron job
        return res.status(201).json({
          success: true,
          data: savedNote,
          message: "Reminder note created successfully with email notification",
        });
      } else if (notificationType === "both" && phoneNumber && email) {
        await scheduleReminder(req, res, savedNote._id);
      } else {
        return res.status(201).json({
          success: true,
          data: savedNote,
          message: "Reminder note created successfully without notifications",
        });
      }
    } else {
      return res.status(201).json({
        success: true,
        data: savedNote,
        message: "Reminder note created successfully",
      });
    }
  } catch (error) {
    console.error("Error creating reminder note:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update an existing reminder note
export const updateReminderNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const {
      title,
      description,
      color,
      reminderDate,
      phoneNumber,
      email,
      notificationType,
    } = req.body;

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    const updateData = {
      title,
      description,
      color,
      phoneNumber,
      email,
    };

    if (notificationType) {
      updateData.notificationType = notificationType;
    }

    if (reminderDate) {
      const reminderDateObj = new Date(reminderDate);
      const now = new Date();

      updateData.reminderDate = reminderDateObj;

      // Update status based on new date
      if (reminderDateObj < now) {
        updateData.reminderStatus = "missed";
      } else {
        updateData.reminderStatus = "pending";
      }
    }

    const updatedNote = await ReminderModel.findOneAndUpdate(
      { _id: noteId, type: "reminder" },
      updateData,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Reminder note not found",
      });
    }

    // Reschedule notification based on type if reminder is pending
    if (updatedNote.reminderStatus === "pending") {
      const notificationType =
        updatedNote.notificationType ||
        (updatedNote.phoneNumber
          ? "sms"
          : updatedNote.email
          ? "email"
          : "none");

      if (
        (notificationType === "sms" || notificationType === "both") &&
        updatedNote.phoneNumber
      ) {
        // Cancel existing scheduled notification
        await cancelReminder(req, res, noteId, false);

        // Schedule new notification
        await scheduleReminder(req, res, noteId, false);
      }
    }

    return res.status(200).json({
      success: true,
      data: updatedNote,
      message: "Reminder note updated successfully",
    });
  } catch (error) {
    console.error("Error updating reminder note:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete a reminder note
export const deleteReminderNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    // Cancel any scheduled notifications
    await cancelReminder(req, res, noteId, false);

    const deletedNote = await ReminderModel.findOneAndDelete({
      _id: noteId,
      type: "reminder",
    });

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Reminder note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reminder note:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update reminder status
export const updateReminderStatus = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { reminderStatus } = req.body;

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    if (
      !reminderStatus ||
      !["pending", "completed", "missed"].includes(reminderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid reminder status is required (pending, completed, or missed)",
      });
    }

    // Find the reminder first to check its current state
    const reminder = await ReminderModel.findOne({
      _id: noteId,
      type: "reminder",
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder note not found",
      });
    }

    // Update the reminder with new status
    reminder.reminderStatus = reminderStatus;

    // If this is a manual update, mark it as such
    reminder.autoUpdated = false;
    reminder.statusUpdateTime = new Date();

    // If marking as completed, set the completion time
    if (reminderStatus === "completed") {
      reminder.completionTime = new Date();
    } else {
      // Reset completion time if changing from completed to another status
      reminder.completionTime = null;
    }

    // Save the updated reminder
    await reminder.save();

    // If status changed to completed or missed, cancel any scheduled notifications
    if (reminderStatus !== "pending") {
      await cancelReminder(req, res, noteId, false);
    }

    return res.status(200).json({
      success: true,
      data: reminder,
      message: "Reminder status updated successfully",
    });
  } catch (error) {
    console.error("Error updating reminder status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Send a notification for a reminder
export const sendReminderNotification = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { notificationType } = req.query || "sms";

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    const reminder = await ReminderModel.findOne({
      _id: noteId,
      type: "reminder",
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder note not found",
      });
    }

    // Determine notification type
    const notificationMethod =
      notificationType ||
      reminder.notificationType ||
      (reminder.phoneNumber ? "sms" : reminder.email ? "email" : "none");

    let result = {
      success: false,
      message: "No notification method available",
    };

    // Send SMS notification
    if (
      (notificationMethod === "sms" || notificationMethod === "both") &&
      reminder.phoneNumber
    ) {
      try {
        const message = await twilioClient.messages.create({
          body: `REMINDER: ${reminder.title} - ${reminder.description}`,
          from: twilioPhoneNumber,
          to: reminder.phoneNumber,
        });

        result = {
          success: true,
          data: { messageId: message.sid },
          message: "SMS notification sent successfully",
        };
      } catch (smsError) {
        console.error("Error sending SMS notification:", smsError);
        result = {
          success: false,
          message: "Failed to send SMS notification",
          error: smsError.message,
        };
      }
    }

    // Send email notification
    if (
      (notificationMethod === "email" || notificationMethod === "both") &&
      reminder.email
    ) {
      try {
        const emailResult = await emailService.sendReminderEmail(
          reminder.email,
          {
            title: reminder.title,
            description: reminder.description,
            reminderDate: reminder.reminderDate,
          }
        );

        if (emailResult.success) {
          result = {
            success: true,
            data: { emailSent: true },
            message:
              notificationMethod === "both"
                ? "Email and SMS notifications sent successfully"
                : "Email notification sent successfully",
          };
        } else {
          result = {
            success: false,
            message: "Failed to send email notification",
            error: emailResult.message,
          };
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        result = {
          success: false,
          message: "Failed to send email notification",
          error: emailError.message,
        };
      }
    }

    if (!result.success && notificationMethod === "both") {
      return res.status(500).json({
        success: false,
        message: "Failed to send notifications",
      });
    }

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error sending reminder notification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Schedule a reminder notification
export const scheduleReminder = async (
  req,
  res,
  noteId,
  shouldRespond = true
) => {
  try {
    const id = noteId || req.params.noteId;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    const reminder = await ReminderModel.findOne({ _id: id, type: "reminder" });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder note not found",
      });
    }

    // Determine notification type
    const notificationType =
      reminder.notificationType ||
      (reminder.phoneNumber ? "sms" : reminder.email ? "email" : "none");

    // For SMS notifications, we need a phone number
    if (
      (notificationType === "sms" || notificationType === "both") &&
      !reminder.phoneNumber
    ) {
      if (shouldRespond) {
        return res.status(400).json({
          success: false,
          message:
            "No phone number associated with this reminder for SMS notifications",
        });
      }
      return;
    }

    const reminderDate = new Date(reminder.reminderDate);
    const now = new Date();

    // If reminder date is in the past, mark as missed
    if (reminderDate < now) {
      await ReminderModel.findByIdAndUpdate(id, { reminderStatus: "missed" });

      if (shouldRespond) {
        return res.status(400).json({
          success: false,
          message: "Cannot schedule a reminder for a past date",
        });
      }
      return;
    }

    let result = { success: true, message: "Reminder scheduled successfully" };

    // Schedule SMS notification if needed
    if (
      (notificationType === "sms" || notificationType === "both") &&
      reminder.phoneNumber
    ) {
      try {
        // Schedule SMS notification
        const message = await twilioClient.messages.create({
          body: `REMINDER: ${reminder.title} - ${reminder.description}`,
          from: twilioPhoneNumber,
          to: reminder.phoneNumber,
          sendAt: reminderDate,
          scheduleType: "fixed",
        });

        // Store the scheduled message ID in the reminder
        await ReminderModel.findByIdAndUpdate(id, {
          scheduledMessageId: message.sid,
        });

        result.data = {
          messageId: message.sid,
          scheduledFor: reminderDate,
          notificationType,
        };
      } catch (smsError) {
        console.error("Error scheduling SMS notification:", smsError);
        result = {
          success: false,
          message: "Failed to schedule SMS notification",
          error: smsError.message,
        };
      }
    }

    // Email notifications are handled by the cron job
    // We don't need to do anything special here

    if (shouldRespond) {
      return res.status(result.success ? 200 : 500).json(result);
    }
  } catch (error) {
    console.error("Error scheduling reminder notification:", error);
    if (shouldRespond) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
};

// Cancel a scheduled reminder notification
export const cancelReminder = async (
  req,
  res,
  noteId,
  shouldRespond = true
) => {
  try {
    const id = noteId || req.params.noteId;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required",
      });
    }

    const reminder = await ReminderModel.findOne({ _id: id, type: "reminder" });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder note not found",
      });
    }

    // If there's a scheduled message ID, cancel it
    if (reminder.scheduledMessageId) {
      try {
        await twilioClient
          .messages(reminder.scheduledMessageId)
          .update({ status: "canceled" });
      } catch (twilioError) {
        console.error("Error canceling Twilio message:", twilioError);
        // Continue even if Twilio cancellation fails
      }

      // Remove the scheduled message ID from the reminder
      await ReminderModel.findByIdAndUpdate(id, {
        $unset: { scheduledMessageId: 1 },
      });
    }

    if (shouldRespond) {
      return res.status(200).json({
        success: true,
        message: "Scheduled reminder notification canceled successfully",
      });
    }
  } catch (error) {
    console.error("Error canceling scheduled reminder notification:", error);
    if (shouldRespond) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
};

// Manually trigger status updates (for testing)
export const triggerStatusUpdates = async (req, res) => {
  try {
    console.log("Manually triggering reminder status updates");

    await cronService.updateReminderStatuses();

    return res.status(200).json({
      success: true,
      message: "Reminder status update process triggered successfully",
    });
  } catch (error) {
    console.error("Error triggering reminder status updates:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Manually trigger marking reminders as completed (for testing)
export const triggerCompletionUpdates = async (req, res) => {
  try {
    console.log("Manually triggering reminder completion updates");

    await cronService.markRemindersAsCompleted();

    return res.status(200).json({
      success: true,
      message: "Reminder completion update process triggered successfully",
    });
  } catch (error) {
    console.error("Error triggering reminder completion updates:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
