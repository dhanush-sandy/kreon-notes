import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { Loader2Icon, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const StatusTestPage = () => {
    const { userId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const triggerStatusUpdates = async () => {
        try {
            setLoading(true);
            setResult(null);

            const response = await axios.post(
                'http://localhost:3000/api/v1/reminder-notes/trigger-status-updates'
            );

            setResult({
                success: true,
                message: response.data.message || 'Status updates triggered successfully'
            });

            toast.success('Status updates triggered successfully');
        } catch (error) {
            console.error('Error triggering status updates:', error);

            setResult({
                success: false,
                message: error.response?.data?.message || 'Failed to trigger status updates'
            });

            toast.error('Failed to trigger status updates');
        } finally {
            setLoading(false);
        }
    };

    const triggerCompletionUpdates = async () => {
        try {
            setLoading(true);
            setResult(null);

            const response = await axios.post(
                'http://localhost:3000/api/v1/reminder-notes/trigger-completion-updates'
            );

            setResult({
                success: true,
                message: response.data.message || 'Completion updates triggered successfully'
            });

            toast.success('Completion updates triggered successfully');
        } catch (error) {
            console.error('Error triggering completion updates:', error);

            setResult({
                success: false,
                message: error.response?.data?.message || 'Failed to trigger completion updates'
            });

            toast.error('Failed to trigger completion updates');
        } finally {
            setLoading(false);
        }
    };

    const createTestReminders = async () => {
        try {
            setLoading(true);
            setResult(null);

            // Create a reminder that's already overdue
            const pastDate = new Date();
            pastDate.setHours(pastDate.getHours() - 2); // 2 hours ago

            const overdueReminder = {
                userId,
                title: 'Test Overdue Reminder',
                description: 'This reminder is already overdue and should be automatically marked as missed',
                color: 'amber-200',
                reminderDate: pastDate.toISOString(),
                notificationType: 'none'
            };

            // Create a reminder for the future
            const futureDate = new Date();
            futureDate.setHours(futureDate.getHours() + 2); // 2 hours from now

            const futureReminder = {
                userId,
                title: 'Test Future Reminder',
                description: 'This reminder is in the future and should remain pending',
                color: 'blue-200',
                reminderDate: futureDate.toISOString(),
                notificationType: 'none'
            };

            // Create a reminder that should be marked as completed (past due date with notification sent)
            const completedDate = new Date();
            completedDate.setHours(completedDate.getHours() - 1); // 1 hour ago

            const completedReminder = {
                userId,
                title: 'Test Completed Reminder',
                description: 'This reminder should be automatically marked as completed',
                color: 'green-200',
                reminderDate: completedDate.toISOString(),
                notificationType: 'none',
                notificationSent: true
            };

            // Create all reminders
            await axios.post('http://localhost:3000/api/v1/reminder-notes', overdueReminder);
            await axios.post('http://localhost:3000/api/v1/reminder-notes', futureReminder);

            // For the completed reminder, we need to create it and then manually set notificationSent to true
            const completedResponse = await axios.post('http://localhost:3000/api/v1/reminder-notes', completedReminder);
            if (completedResponse.data.success && completedResponse.data.data._id) {
                // Update the reminder to set notificationSent to true
                await axios.put(`http://localhost:3000/api/v1/reminder-notes/${completedResponse.data.data._id}`, {
                    notificationSent: true
                });
            }

            setResult({
                success: true,
                message: 'Test reminders created successfully'
            });

            toast.success('Test reminders created successfully');
        } catch (error) {
            console.error('Error creating test reminders:', error);

            setResult({
                success: false,
                message: error.response?.data?.message || 'Failed to create test reminders'
            });

            toast.error('Failed to create test reminders');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Reminder Status Update Test</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Test Automated Status Updates</h2>
                <p className="text-gray-600 mb-4">
                    This page allows you to test the automated status update functionality for reminders.
                    You can create test reminders and trigger the status update process manually.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                        onClick={createTestReminders}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : null}
                        Create Test Reminders
                    </button>

                    <button
                        onClick={triggerStatusUpdates}
                        disabled={loading}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-amber-300 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : null}
                        Trigger Status Updates
                    </button>

                    <button
                        onClick={triggerCompletionUpdates}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : null}
                        Trigger Completion Updates
                    </button>
                </div>

                {result && (
                    <div className={`p-4 rounded-lg ${result.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                        <div className="flex items-center gap-2">
                            {result.success ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            )}
                            <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                                {result.message}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">How It Works</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-lg">Automated Status Updates</h3>
                        <p className="text-gray-600">
                            The system automatically checks for overdue reminders every hour and updates their status from "pending" to "missed" if they are past their due date.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg">Automated Completion</h3>
                        <p className="text-gray-600">
                            The system automatically marks reminders as "completed" when they are past their due date and have had their notifications sent successfully.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg">Testing Process</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                            <li>Click "Create Test Reminders" to create test reminders with different states</li>
                            <li>Go to your reminders page to see the newly created reminders</li>
                            <li>Click "Trigger Status Updates" to run the status update process (marks overdue as missed)</li>
                            <li>Click "Trigger Completion Updates" to run the completion process (marks notified reminders as completed)</li>
                            <li>Go back to your reminders page and refresh to see the updated statuses</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusTestPage; 