import cron from "node-cron";
import { Notes } from "../models/notes.model.js";
import * as twilioService from "./twilio.service.js";
import * as emailService from "./email.service.js";

/**
 * Initializes cron jobs for the application
 */
const initCronJobs = () => {
  console.log("Initializing cron jobs at:", new Date().toISOString());

  // Check for upcoming reminders every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    console.log(
      "Running reminder check cron job at:",
      new Date().toISOString()
    );
    await checkUpcomingReminders();

    // After checking reminders, mark appropriate ones as completed
    await markRemindersAsCompleted();
  });

  // Add a job to automatically update reminder statuses every hour
  cron.schedule("0 * * * *", async () => {
    console.log(
      "Running reminder status update cron job at:",
      new Date().toISOString()
    );
    await updateReminderStatuses();

    // After updating statuses, mark appropriate ones as completed
    await markRemindersAsCompleted();
  });

  // Add a test cron that runs every minute for debugging
  cron.schedule("* * * * *", () => {
    console.log("Test cron running every minute:", new Date().toISOString());
  });

  console.log("Cron jobs initialized successfully");
};

/**
 * Automatically marks reminders as completed based on notification delivery
 */
const markRemindersAsCompleted = async () => {
  try {
    console.log("\n--- MARKING REMINDERS AS COMPLETED ---");
    const now = new Date();
    console.log("Current time:", now.toISOString());

    // Import the reminder model
    const { reminder: ReminderModel } = await import(
      "../models/reminder.model.js"
    );

    // Find all pending reminders that have had notifications sent
    const remindersToComplete = await ReminderModel.find({
      type: "reminder",
      reminderStatus: "pending",
      notificationSent: true,
      reminderDate: { $lt: now },
    });

    console.log(
      `Found ${remindersToComplete.length} reminders to mark as completed`
    );

    // Update each reminder's status to "completed"
    for (const reminder of remindersToComplete) {
      try {
        console.log(
          `Marking reminder as completed: ${reminder._id}, title: ${reminder.title}`
        );

        // Update the reminder status to "completed" and mark it as auto-updated
        reminder.reminderStatus = "completed";
        reminder.autoUpdated = true;
        reminder.statusUpdateTime = now;
        reminder.completionTime = now;

        await reminder.save();

        console.log(
          `Automatically marked reminder ${reminder._id} as completed`
        );
      } catch (error) {
        console.error(
          `Error marking reminder ${reminder._id} as completed:`,
          error
        );
      }
    }

    console.log("--- FINISHED MARKING REMINDERS AS COMPLETED ---\n");
  } catch (error) {
    console.error("Error marking reminders as completed:", error);
  }
};

/**
 * Automatically updates the status of reminders based on their due date
 */
const updateReminderStatuses = async () => {
  try {
    console.log("\n--- UPDATING REMINDER STATUSES ---");
    const now = new Date();
    console.log("Current time:", now.toISOString());

    // Import the reminder model
    const { reminder: ReminderModel } = await import(
      "../models/reminder.model.js"
    );

    // Find all pending reminders that are past their due date
    const overdueReminders = await ReminderModel.find({
      type: "reminder",
      reminderStatus: "pending",
      reminderDate: { $lt: now },
    });

    console.log(`Found ${overdueReminders.length} overdue reminders to update`);

    // Update each reminder's status to "missed"
    for (const reminder of overdueReminders) {
      try {
        console.log(
          `Updating status for reminder: ${reminder._id}, title: ${reminder.title}`
        );

        // Update the reminder status to "missed" and mark it as auto-updated
        reminder.reminderStatus = "missed";
        reminder.autoUpdated = true;
        reminder.statusUpdateTime = now;

        await reminder.save();

        console.log(`Automatically marked reminder ${reminder._id} as missed`);
      } catch (error) {
        console.error(
          `Error updating status for reminder ${reminder._id}:`,
          error
        );
      }
    }

    console.log("--- FINISHED UPDATING REMINDER STATUSES ---\n");
  } catch (error) {
    console.error("Error updating reminder statuses:", error);
  }
};

/**
 * Checks for upcoming reminders and sends notifications
 */
const checkUpcomingReminders = async () => {
  try {
    console.log("\n--- CHECKING UPCOMING REMINDERS ---");
    const now = new Date();
    console.log("Current time:", now.toISOString());

    // Get reminders that are due in the next 15 minutes and haven't been sent yet
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);
    console.log(
      "Looking for reminders between now and:",
      fifteenMinutesFromNow.toISOString()
    );

    // Log the query we're about to run
    const query = {
      type: "reminder",
      reminderStatus: "pending",
      reminderDate: { $gte: now, $lte: fifteenMinutesFromNow },
      notificationSent: false,
    };
    console.log("Reminder query:", JSON.stringify(query, null, 2));

    // Find all upcoming reminders from Notes model
    const upcomingRemindersFromNotes = await Notes.find(query);
    console.log(
      `Found ${upcomingRemindersFromNotes.length} upcoming reminders in Notes model`
    );

    // Find all upcoming reminders from reminder model
    let upcomingRemindersFromReminderModel = [];
    try {
      const { reminder } = await import("../models/reminder.model.js");
      if (reminder) {
        // Adjust query for reminder model (it might have different field names)
        const reminderModelQuery = {
          type: "reminder",
          // The reminder model might use isCompleted instead of reminderStatus
          // or it might not have notificationSent field
          reminderDate: { $gte: now, $lte: fifteenMinutesFromNow },
        };

        upcomingRemindersFromReminderModel = await reminder.find(
          reminderModelQuery
        );
        console.log(
          `Found ${upcomingRemindersFromReminderModel.length} upcoming reminders in reminder model`
        );
      }
    } catch (modelError) {
      console.error("Error checking reminder model:", modelError);
    }

    // Combine reminders from both models
    const allUpcomingReminders = [
      ...upcomingRemindersFromNotes,
      ...upcomingRemindersFromReminderModel,
    ];
    console.log(
      `Total upcoming reminders to process: ${allUpcomingReminders.length}`
    );

    // If no reminders found, let's check if there are ANY reminders in the system
    if (allUpcomingReminders.length === 0) {
      const allNotesReminders = await Notes.find({ type: "reminder" });
      console.log(
        `Total reminders in Notes database: ${allNotesReminders.length}`
      );

      if (allNotesReminders.length > 0) {
        console.log(
          "Sample reminder from Notes:",
          JSON.stringify(allNotesReminders[0], null, 2)
        );
      }

      // Let's also check the reminder model directly
      try {
        const { reminder } = await import("../models/reminder.model.js");
        if (reminder) {
          const reminderModelResults = await reminder.find({
            type: "reminder",
          });
          console.log(
            `Found ${reminderModelResults.length} reminders in reminder model`
          );
          if (reminderModelResults.length > 0) {
            console.log(
              "Sample from reminder model:",
              JSON.stringify(reminderModelResults[0], null, 2)
            );

            // Let's check if any of these reminders should be processed
            const now = new Date();
            const dueReminders = reminderModelResults.filter((r) => {
              const reminderDate = new Date(r.reminderDate);
              return (
                reminderDate >= now && reminderDate <= fifteenMinutesFromNow
              );
            });

            console.log(
              `Found ${dueReminders.length} reminders in reminder model that are due soon`
            );
            if (dueReminders.length > 0) {
              console.log(
                "Sample due reminder:",
                JSON.stringify(dueReminders[0], null, 2)
              );
            }
          }
        }
      } catch (modelError) {
        console.error("Error checking reminder model:", modelError);
      }
    }

    // Process each reminder
    for (const reminder of allUpcomingReminders) {
      try {
        console.log(
          `Processing reminder: ${reminder._id}, title: ${reminder.title}`
        );

        // Handle SMS notifications if phone number exists
        if (reminder.phoneNumber) {
          console.log(`Reminder has phone number: ${reminder.phoneNumber}`);
          // If there's no scheduled message ID but there is a phone number, create one
          if (!reminder.scheduledMessageId) {
            const message = `Reminder: ${reminder.title} - ${
              reminder.description || ""
            }`;

            console.log(`Scheduling SMS for reminder ${reminder._id}`);
            // Schedule the message to be sent immediately
            const scheduledMessageId = await twilioService.scheduleReminder(
              reminder.phoneNumber,
              message,
              new Date()
            );

            reminder.scheduledMessageId = scheduledMessageId;
            console.log(`SMS scheduled with ID: ${scheduledMessageId}`);
          }
        }

        // Handle email notifications if email exists
        if (reminder.email) {
          console.log(`Reminder has email: ${reminder.email}`);
          try {
            console.log(`Sending email for reminder ${reminder._id}`);
            const emailResult = await emailService.sendReminderEmail(
              reminder.email,
              {
                title: reminder.title,
                description: reminder.description || "",
                reminderDate: reminder.reminderDate,
              }
            );
            console.log(`Email notification result:`, emailResult);

            if (emailResult.success) {
              console.log(
                `Email notification sent for reminder ID: ${reminder._id}`
              );
            } else {
              console.error(
                `Failed to send email for reminder ${reminder._id}:`,
                emailResult.message
              );
            }
          } catch (emailError) {
            console.error(
              `Error sending email for reminder ${reminder._id}:`,
              emailError
            );
          }
        }

        // Mark notification as sent if the model supports it
        if ("notificationSent" in reminder) {
          console.log(`Marking reminder ${reminder._id} as sent`);
          reminder.notificationSent = true;
          await reminder.save();
        } else {
          console.log(
            `Reminder ${reminder._id} doesn't have notificationSent field, can't mark as sent`
          );
          // For reminder model, we might need to update differently
          try {
            const { reminder: ReminderModel } = await import(
              "../models/reminder.model.js"
            );
            if (ReminderModel) {
              await ReminderModel.findByIdAndUpdate(reminder._id, {
                $set: { processed: true }, // or whatever field is appropriate
              });
              console.log(`Updated reminder ${reminder._id} in reminder model`);
            }
          } catch (updateError) {
            console.error(
              `Error updating reminder ${reminder._id}:`,
              updateError
            );
          }
        }

        console.log(
          `Processed reminder notification for reminder ID: ${reminder._id}`
        );
      } catch (error) {
        console.error(`Error processing reminder ${reminder._id}:`, error);
      }
    }
    console.log("--- FINISHED CHECKING REMINDERS ---\n");
  } catch (error) {
    console.error("Error checking upcoming reminders:", error);
  }
};

export default {
  initCronJobs,
  checkUpcomingReminders,
  updateReminderStatuses,
  markRemindersAsCompleted,
};
