import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// Initialize Twilio client with credentials from environment variables
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Schedules an SMS reminder to be sent at the specified date and time
 * @param {string} phoneNumber - The recipient's phone number
 * @param {string} message - The message content
 * @param {Date} sendAt - When to send the message
 * @returns {Promise<string>} - The scheduled message ID
 */
export const scheduleReminder = async (phoneNumber, message, sendAt) => {
  try {
    // Format the date for Twilio's API
    const sendTime = new Date(sendAt).toISOString();

    // Schedule the message
    const scheduledMessage = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
      sendAt: sendTime,
      scheduleType: "fixed",
    });

    console.log(`Scheduled message with SID: ${scheduledMessage.sid}`);
    return scheduledMessage.sid;
  } catch (error) {
    console.error("Error scheduling Twilio message:", error);
    throw new Error(`Failed to schedule reminder: ${error.message}`);
  }
};

/**
 * Cancels a previously scheduled message
 * @param {string} messageSid - The ID of the scheduled message to cancel
 * @returns {Promise<boolean>} - Success status
 */
export const cancelReminder = async (messageSid) => {
  try {
    if (!messageSid) {
      console.log("No message SID provided, nothing to cancel");
      return false;
    }

    await twilioClient.messages(messageSid).update({ status: "canceled" });
    console.log(`Canceled message with SID: ${messageSid}`);
    return true;
  } catch (error) {
    console.error("Error canceling Twilio message:", error);
    throw new Error(`Failed to cancel reminder: ${error.message}`);
  }
};

/**
 * Updates a scheduled reminder
 * @param {string} oldMessageSid - The ID of the existing scheduled message
 * @param {string} phoneNumber - The recipient's phone number
 * @param {string} message - The new message content
 * @param {Date} sendAt - The new date/time to send the message
 * @returns {Promise<string>} - The new scheduled message ID
 */
export const updateReminder = async (
  oldMessageSid,
  phoneNumber,
  message,
  sendAt
) => {
  try {
    // Cancel the old message if it exists
    if (oldMessageSid) {
      await cancelReminder(oldMessageSid);
    }

    // Schedule a new message with the updated information
    return await scheduleReminder(phoneNumber, message, sendAt);
  } catch (error) {
    console.error("Error updating Twilio message:", error);
    throw new Error(`Failed to update reminder: ${error.message}`);
  }
};
