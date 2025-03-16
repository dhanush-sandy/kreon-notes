# Browser Notifications in Kreon Notes

Kreon Notes now supports browser notifications for reminders, allowing you to receive alerts directly in your browser even when you're not actively using the application.

## Features

- **Standard Notification Template**: All browser notifications follow a consistent, professional template
- **Permission-Based**: Respects browser notification permissions
- **Scheduled Notifications**: Notifications are scheduled to appear at the exact time of your reminder
- **Interactive**: Click on a notification to open the application
- **Works in Background**: Notifications appear even when the browser is minimized (but not closed)

## How Browser Notifications Work

Browser notifications use the Web Notifications API, which is supported by all modern browsers. When a notification is triggered, it appears as a system notification on your device, similar to notifications from other applications.

## Setting Up Browser Notifications

1. **Create or Edit a Reminder**:

   - Open the Kreon Notes application
   - Create a new reminder or edit an existing one

2. **Select Browser Notifications**:

   - In the notification type section, select "Browser"
   - If this is your first time using browser notifications, you'll need to grant permission

3. **Grant Permission**:

   - Click the "Request Permission" button
   - Your browser will show a permission dialog
   - Click "Allow" to grant permission for notifications

4. **Save Your Reminder**:
   - Complete the reminder details and save
   - The browser notification will be automatically scheduled

## Testing Browser Notifications

You can test browser notifications using the notification test page:

1. Navigate to `/notification-test` in the application
2. Grant notification permission if you haven't already
3. Fill in the test form and click "Send Now" to see an immediate notification
4. Or use the "Schedule" option to set a notification for a few seconds in the future

## Troubleshooting

### Notifications Not Appearing

If notifications aren't appearing, check the following:

1. **Permission Status**:

   - Make sure you've granted notification permission
   - Check the permission status in your browser settings

2. **Browser Support**:

   - Ensure you're using a modern browser that supports the Web Notifications API
   - Chrome, Firefox, Safari, and Edge all support notifications

3. **Browser is Open**:
   - Browser notifications only work when the browser is running
   - They will not appear if you've closed your browser

### Resetting Permissions

If you previously denied notification permissions:

1. **Chrome**:

   - Click the lock icon in the address bar
   - Select "Site settings"
   - Change notifications from "Block" to "Allow"

2. **Firefox**:

   - Click the lock icon in the address bar
   - Select "Connection secure"
   - Click "More Information"
   - Go to "Permissions" tab
   - Change "Send Notifications" setting

3. **Safari**:
   - Go to Safari Preferences
   - Select "Websites" tab
   - Click "Notifications"
   - Find your site and change the permission

## Technical Implementation

The browser notification system is built with:

- **Web Notifications API**: For displaying system notifications
- **Standard Templates**: For consistent notification appearance
- **Client-Side Scheduling**: For timing notifications precisely

The notification template includes:

- Title (your reminder title)
- Description
- Due date and time
- Kreon Notes branding

## Privacy Considerations

Browser notifications are processed entirely on your device and do not send any data to external servers. Your reminder data remains private and secure.
