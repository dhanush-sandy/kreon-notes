import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using environment variables
let transporter;

// Initialize the email transporter
const initializeTransporter = async () => {
  console.log("Initializing email transporter...");

  // Check if regular SMTP credentials are provided
  if (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  ) {
    // Use provided email credentials
    console.log(
      `Using provided email credentials for ${process.env.EMAIL_USER} via ${process.env.EMAIL_HOST}`
    );
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    try {
      await transporter.verify();
      console.log("Email service connection verified successfully");
      return true;
    } catch (verifyError) {
      console.error(
        "Email service connection verification failed:",
        verifyError
      );
      // Continue anyway, we'll try to send emails
    }
  } else {
    // Create a test account on Ethereal for development
    console.log(
      "No email credentials provided, creating Ethereal test account..."
    );
    try {
      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log("Email service initialized with test account");
      console.log("Test account credentials:", testAccount);
      return true;
    } catch (error) {
      console.error("Failed to create test email account:", error);
      return false;
    }
  }
};

// Send an email
export const sendEmail = async (to, subject, text, html) => {
  console.log(`Attempting to send email to ${to} with subject "${subject}"`);

  if (!transporter) {
    console.log("Email transporter not initialized, initializing now...");
    const initialized = await initializeTransporter();
    if (!initialized) {
      console.error("Email service not initialized");
      return { success: false, message: "Email service not initialized" };
    }
  }

  try {
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        '"Kreon Notes" <notifications@kreon-notes.com>',
      to,
      subject,
      text,
      html,
    };

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);

    // For test accounts, log the preview URL
    if (info.messageId && info.previewURL) {
      console.log("Email sent:", info.messageId);
      console.log("Preview URL:", info.previewURL);
    } else {
      console.log("Email sent:", info.messageId);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewURL: info.previewURL,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

// Send a reminder notification email
export const sendReminderEmail = async (to, reminderData) => {
  console.log(
    `Sending reminder email to ${to} for reminder: ${reminderData.title}`
  );

  const { title, description, reminderDate } = reminderData;

  const formattedDate = new Date(reminderDate).toLocaleString();

  const subject = `Reminder: ${title}`;

  const text = `
    Reminder: ${title}
    
    ${description}
    
    Due: ${formattedDate}
    
    This is an automated reminder from Kreon Notes.
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4CAF50;">Reminder: ${title}</h2>
      <p style="white-space: pre-line; margin-bottom: 20px;">${description}</p>
      <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
        <strong>Due:</strong> ${formattedDate}
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="color: #757575; font-size: 12px;">This is an automated reminder from Kreon Notes.</p>
    </div>
  `;

  return await sendEmail(to, subject, text, html);
};

// Initialize the email service when the module is imported
console.log("Email service module loaded, initializing...");
initializeTransporter();

export default {
  sendEmail,
  sendReminderEmail,
  initializeTransporter,
};
