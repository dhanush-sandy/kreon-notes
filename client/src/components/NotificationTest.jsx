import React, { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import { toast } from 'react-hot-toast';

const NotificationTest = () => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [title, setTitle] = useState('Test Reminder');
    const [description, setDescription] = useState('This is a test reminder notification');
    const [reminderDate, setReminderDate] = useState('');
    const [delaySeconds, setDelaySeconds] = useState(5);

    // Check permission status on component mount
    useEffect(() => {
        const checkPermission = async () => {
            const isPermitted = NotificationService.isBrowserNotificationPermitted();
            setPermissionGranted(isPermitted);
        };

        checkPermission();
    }, []);

    // Request notification permission
    const requestPermission = async () => {
        const granted = await NotificationService.requestNotificationPermission();
        setPermissionGranted(granted);
    };

    // Send an immediate notification
    const sendImmediateNotification = () => {
        if (!permissionGranted) {
            toast.error('Notification permission not granted');
            return;
        }

        const success = NotificationService.showReminderNotification({
            title,
            description,
            reminderDate: reminderDate ? new Date(reminderDate) : new Date()
        });

        if (success) {
            toast.success('Notification sent successfully');
        } else {
            toast.error('Failed to send notification');
        }
    };

    // Schedule a notification with delay
    const scheduleNotification = () => {
        if (!permissionGranted) {
            toast.error('Notification permission not granted');
            return;
        }

        const delay = delaySeconds * 1000; // Convert to milliseconds
        const timeoutId = NotificationService.scheduleReminderNotification(
            {
                title,
                description,
                reminderDate: reminderDate ? new Date(reminderDate) : new Date()
            },
            delay
        );

        if (timeoutId) {
            toast.success(`Notification scheduled in ${delaySeconds} seconds`);
        } else {
            toast.error('Failed to schedule notification');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Browser Notification Test</h2>

            <div className="mb-4">
                <p className="mb-2">
                    Permission Status:
                    <span className={`ml-2 font-semibold ${permissionGranted ? 'text-green-600' : 'text-red-600'}`}>
                        {permissionGranted ? 'Granted' : 'Not Granted'}
                    </span>
                </p>

                {!permissionGranted && (
                    <button
                        onClick={requestPermission}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Request Permission
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notification Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notification Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="3"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reminder Date (optional)
                    </label>
                    <input
                        type="datetime-local"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={sendImmediateNotification}
                        disabled={!permissionGranted}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send Now
                    </button>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delay (seconds)
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                min="1"
                                value={delaySeconds}
                                onChange={(e) => setDelaySeconds(parseInt(e.target.value) || 5)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                onClick={scheduleNotification}
                                disabled={!permissionGranted}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
                <p>Note: Browser notifications will appear even if you're not actively using the app.</p>
            </div>
        </div>
    );
};

export default NotificationTest; 