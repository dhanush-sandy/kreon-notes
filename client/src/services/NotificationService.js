import { toast } from "react-hot-toast";

// Check if browser notifications are supported
const isBrowserNotificationSupported = () => {
  return "Notification" in window;
};

// Request permission for browser notifications
export const requestNotificationPermission = async () => {
  if (!isBrowserNotificationSupported()) {
    toast.error("Browser notifications are not supported in your browser");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("Notification permission granted");
      return true;
    } else {
      toast.error("Notification permission denied");
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    toast.error("Failed to request notification permission");
    return false;
  }
};

/**
 * Format a notification message using a standard template
 * @param {Object} data - The notification data
 * @param {string} data.title - The notification title
 * @param {string} data.description - The notification description
 * @param {Date|string} [data.date] - Optional date for the notification
 * @param {string} [data.type='reminder'] - The notification type (reminder, task, etc.)
 * @returns {Object} Formatted notification options
 */
export const formatNotificationTemplate = (data) => {
  const { title, description, date, type = "reminder" } = data;

  // Format date if provided
  let formattedDate = "";
  if (date) {
    const dateObj = date instanceof Date ? date : new Date(date);
    formattedDate = dateObj.toLocaleString();
  }

  // Create a standard notification body
  let body = description || "";

  if (formattedDate) {
    body += `\n\nDue: ${formattedDate}`;
  }

  // Add a standard footer
  body += "\n\nKreon Notes";

  // Determine icon based on notification type
  let icon = "/logo.png";
  if (type === "reminder") {
    icon = "/reminder-icon.png"; // You can create type-specific icons
  }

  return {
    body,
    icon,
    badge: "/badge-icon.png",
    tag: `kreon-${type}-${Date.now()}`, // Unique tag to prevent duplicate notifications
    requireInteraction: true, // Keep the notification visible until user interacts with it
    silent: false, // Play sound with notification
    timestamp: Date.now(),
    data: { type, url: window.location.origin, title, description, date },
  };
};

// Show a browser notification with standard template
export const showBrowserNotification = (title, options = {}) => {
  if (!isBrowserNotificationSupported()) {
    console.error("Browser notifications not supported");
    return false;
  }

  if (Notification.permission !== "granted") {
    console.error("Notification permission not granted");
    return false;
  }

  try {
    // If options contains notification data, format it using the template
    let notificationOptions = options;

    if (options.useTemplate && (options.description || options.date)) {
      notificationOptions = {
        ...formatNotificationTemplate({
          title,
          description: options.description,
          date: options.date,
          type: options.type,
        }),
        ...options,
      };

      // Remove template-specific properties that were already processed
      delete notificationOptions.useTemplate;
      delete notificationOptions.description;
      delete notificationOptions.date;
      delete notificationOptions.type;
    }

    const notification = new Notification(title, notificationOptions);

    notification.onclick = () => {
      // If the notification has a specific URL to navigate to
      if (notificationOptions.data && notificationOptions.data.url) {
        window.open(notificationOptions.data.url, "_blank");
      } else {
        window.focus();
      }
      notification.close();
      if (options.onClick) options.onClick();
    };

    return true;
  } catch (error) {
    console.error("Error showing notification:", error);
    return false;
  }
};

// Show a reminder notification with standard template
export const showReminderNotification = (reminderData) => {
  const { title, description, reminderDate } = reminderData;

  return showBrowserNotification(title, {
    useTemplate: true,
    description,
    date: reminderDate,
    type: "reminder",
    data: {
      type: "reminder",
      reminderData,
    },
  });
};

// Schedule a browser notification
export const scheduleBrowserNotification = (title, options = {}, delay) => {
  if (!delay) return false;

  const timeoutId = setTimeout(() => {
    showBrowserNotification(title, options);
  }, delay);

  // Return the timeout ID so it can be cancelled if needed
  return timeoutId;
};

// Schedule a reminder notification
export const scheduleReminderNotification = (reminderData, delay) => {
  if (!delay) return false;

  const timeoutId = setTimeout(() => {
    showReminderNotification(reminderData);
  }, delay);

  return timeoutId;
};

// Cancel a scheduled browser notification
export const cancelScheduledNotification = (timeoutId) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    return true;
  }
  return false;
};

// Store notification preferences in localStorage
export const saveNotificationPreferences = (preferences) => {
  try {
    localStorage.setItem(
      "notificationPreferences",
      JSON.stringify(preferences)
    );
    return true;
  } catch (error) {
    console.error("Error saving notification preferences:", error);
    return false;
  }
};

// Get notification preferences from localStorage
export const getNotificationPreferences = () => {
  try {
    const preferences = localStorage.getItem("notificationPreferences");
    return preferences
      ? JSON.parse(preferences)
      : {
          browserEnabled: false,
          emailEnabled: false,
          smsEnabled: false,
        };
  } catch (error) {
    console.error("Error getting notification preferences:", error);
    return {
      browserEnabled: false,
      emailEnabled: false,
      smsEnabled: false,
    };
  }
};

// Check if browser notifications are currently permitted
export const isBrowserNotificationPermitted = () => {
  return (
    isBrowserNotificationSupported() && Notification.permission === "granted"
  );
};

export default {
  requestNotificationPermission,
  showBrowserNotification,
  showReminderNotification,
  scheduleBrowserNotification,
  scheduleReminderNotification,
  cancelScheduledNotification,
  saveNotificationPreferences,
  getNotificationPreferences,
  formatNotificationTemplate,
  isBrowserNotificationPermitted,
};
