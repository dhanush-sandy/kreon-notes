# Kreon Notes Application

A full-stack notes application with support for text notes, drawing notes, and reminder notes with SMS notifications.

## Features

- **Text Notes**: Create and manage simple text-based notes
- **Drawing Notes**: Create and save drawings as notes
- **Reminder Notes**: Set reminders with optional SMS notifications via Twilio
- **Dashboard**: View all your notes in one place with quick access to each note type
- **Authentication**: Secure user authentication with Clerk

## Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Clerk Authentication
- Axios for API requests

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Twilio API for SMS notifications
- Node-cron for scheduled tasks

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Twilio account (for SMS notifications)

### Environment Setup

1. Clone the repository:

```
git clone https://github.com/yourusername/kreon-app.git
cd kreon-app
```

2. Set up environment variables:

Create a `.env` file in the server directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000

# Twilio Credentials
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

Create a `.env` file in the client directory with the following variables:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Installation

1. Install server dependencies:

```
cd server
npm install
```

2. Install client dependencies:

```
cd ../client
npm install
```

### Running the Application

1. Start the server:

```
cd server
npm run dev
```

2. Start the client:

```
cd ../client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Text Notes

- `GET /api/v1/text-notes` - Get all text notes
- `GET /api/v1/text-notes/:id` - Get a specific text note
- `POST /api/v1/text-notes` - Create a new text note
- `PATCH /api/v1/text-notes/:id` - Update a text note
- `DELETE /api/v1/text-notes/:id` - Delete a text note

### Drawing Notes

- `GET /api/v1/drawing-notes` - Get all drawing notes
- `GET /api/v1/drawing-notes/:id` - Get a specific drawing note
- `POST /api/v1/drawing-notes` - Create a new drawing note
- `PATCH /api/v1/drawing-notes/:id` - Update a drawing note
- `DELETE /api/v1/drawing-notes/:id` - Delete a drawing note

### Reminder Notes

- `GET /api/v1/reminder-notes` - Get all reminder notes
- `GET /api/v1/reminder-notes/:id` - Get a specific reminder note
- `POST /api/v1/reminder-notes` - Create a new reminder note
- `PATCH /api/v1/reminder-notes/:id` - Update a reminder note
- `DELETE /api/v1/reminder-notes/:id` - Delete a reminder note
- `PATCH /api/v1/reminder-notes/:id/status` - Update reminder status

## SMS Notifications

The application uses Twilio to send SMS notifications for reminders. When creating a reminder note, you can optionally provide a phone number to receive an SMS notification when the reminder is due.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Kreon Notes - Enhanced Notification System

Kreon Notes now features a comprehensive notification system that supports multiple notification channels to ensure you never miss an important reminder.

## Notification Features

### 1. Browser Notifications

Browser notifications allow you to receive alerts directly in your browser, even when you're not actively using the Kreon Notes app. These notifications work across all modern browsers and can be enabled with a simple permission request.

**Features:**

- **Standard Template**: All notifications follow a consistent, professional template with title, description, due date, and branding
- **Permission-based system** that respects user preferences
- **Visual and sound alerts**
- **Click-to-focus functionality** that brings you back to the app
- **Works even when the browser is minimized** (but not closed)
- **Scheduled notifications** that appear at the exact time of your reminder

To use browser notifications:

1. When creating a reminder, select "Browser" as the notification type
2. Grant permission when prompted by your browser
3. Complete and save your reminder
4. The notification will appear at the scheduled time

For testing and troubleshooting, visit the notification test page at `/notification-test`.

### 2. Email Notifications

Email notifications send reminder alerts to your specified email address, making them perfect for important reminders that you need to receive even when you're away from your computer.

**Features:**

- Beautifully formatted HTML emails
- Contains all reminder details (title, description, due date)
- Works across all devices with email access
- No special setup required - just provide your email address

### 3. SMS Notifications (Requires Twilio Setup)

For critical reminders, SMS notifications deliver alerts directly to your phone via text message.

**Features:**

- Direct delivery to your mobile phone
- Works without internet connection
- Requires a valid phone number with country code
- Requires Twilio account setup on the server

## Setting Up Notifications

### Browser Notifications

1. When creating a reminder, select "Browser" as the notification type
2. Grant permission when prompted by your browser
3. Ensure your browser is running when the reminder is due (can be minimized)

### Email Notifications

1. When creating a reminder, select "Email" as the notification type
2. Enter a valid email address
3. Check your email inbox when the reminder is due

### SMS Notifications

1. When creating a reminder, select "SMS" as the notification type
2. Enter a valid phone number with country code (e.g., +1XXXXXXXXXX for US/Canada)
3. Ensure the server has Twilio properly configured

## Server Configuration

### Email Configuration

To enable email notifications, add the following to your server's `.env` file:

```
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"
EMAIL_FROM="Kreon Notes <notifications@kreon-notes.com>"
```

If these values are not set, the application will use Ethereal for testing (emails will be viewable online but not delivered to actual recipients).

### Twilio Configuration

To enable SMS notifications, add the following to your server's `.env` file:

```
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="your_twilio_phone_number"
```

## Setting Up Gmail OAuth2 for Email Notifications

To use Gmail for sending email notifications, you need to set up OAuth2 credentials. Follow these steps:

1. **Create a Google Cloud Project**:

   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Dashboard"

2. **Enable the Gmail API**:

   - Click on "+ ENABLE APIS AND SERVICES"
   - Search for "Gmail API" and enable it

3. **Configure OAuth Consent Screen**:

   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" user type (or "Internal" if you're using Google Workspace)
   - Fill in the required information (App name, User support email, Developer contact information)
   - Add the following scopes: `https://mail.google.com/`
   - Add your email as a test user

4. **Create OAuth2 Credentials**:

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Add a name for your OAuth client
   - Add `https://developers.google.com/oauthplayground` to the "Authorized redirect URIs"
   - Click "Create" and note down your Client ID and Client Secret

5. **Generate a Refresh Token**:

   - Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Click the gear icon in the top right corner
   - Check "Use your own OAuth credentials"
   - Enter your Client ID and Client Secret
   - Close the settings
   - Select "Gmail API v1" > "https://mail.google.com/" from the list
   - Click "Authorize APIs"
   - Sign in with your Google account and allow the permissions
   - Click "Exchange authorization code for tokens"
   - Note down the Refresh Token

6. **Update Environment Variables**:

   - Open the `.env` file in the server directory
   - Update the following variables with your credentials:
     ```
     GMAIL_USER="your-email@gmail.com"
     GMAIL_CLIENT_ID="your-client-id"
     GMAIL_CLIENT_SECRET="your-client-secret"
     GMAIL_REFRESH_TOKEN="your-refresh-token"
     GMAIL_REDIRECT_URI="https://developers.google.com/oauthplayground"
     ```

7. **Install Dependencies**:

   - Run `npm install` in the server directory to install the required packages

8. **Test the Email Service**:
   - Start the server and test sending an email notification

Note: The refresh token is long-lived but may expire if not used for an extended period. If you encounter authentication issues, generate a new refresh token.

## Technical Implementation

The notification system is built with:

- **Browser Notifications**: Web Notifications API
- **Email Notifications**: Nodemailer with SMTP support
- **SMS Notifications**: Twilio API

The system is designed to be fault-tolerant, with graceful fallbacks if a notification channel is unavailable.
#   k r e o n - n o t e s  
 