import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Loader2Icon,
    Edit2Icon,
    TrashIcon,
    Bell,
    Clock,
    Calendar,
    CheckCircle,
    XCircle,
    AlertTriangle,
    MoreHorizontal,
    Phone,
    Mail,
    Monitor
} from "lucide-react";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";
import toast from "react-hot-toast";

const ReminderCard = ({ reminders = [], onEdit, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [countdowns, setCountdowns] = useState({});

    // Update countdowns every second
    useEffect(() => {
        const updateAllCountdowns = () => {
            const newCountdowns = {};
            reminders.forEach(reminder => {
                // Only process countdowns for pending reminders
                if (reminder.reminderDate && reminder.reminderStatus === "pending") {
                    try {
                        const reminderDate = new Date(reminder.reminderDate);

                        // Check if date is valid
                        if (isNaN(reminderDate.getTime())) {
                            console.error("Invalid date format for reminder:", reminder._id);
                            return;
                        }

                        if (!isPast(reminderDate)) {
                            newCountdowns[reminder._id] = formatDistanceToNow(reminderDate, { addSuffix: true });
                        } else {
                            newCountdowns[reminder._id] = "Overdue";
                        }
                    } catch (error) {
                        console.error("Error processing reminder date:", error);
                    }
                }
            });
            setCountdowns(newCountdowns);
        };

        updateAllCountdowns();
        const interval = setInterval(updateAllCountdowns, 1000);

        return () => clearInterval(interval);
    }, [reminders]);

    const toggleMenu = (reminderId) => {
        if (activeMenu === reminderId) {
            setActiveMenu(null);
        } else {
            setActiveMenu(reminderId);
        }
    };


    const handleEdit = (reminder) => {
        if (onEdit) {
            onEdit(reminder);
        }
        setActiveMenu(null);
    };

    const deleteReminder = async (reminderId) => {
        try {
            setIsDeleting(true);
            setDeletingId(reminderId);
            setActiveMenu(null);

            await axios.delete(`http://localhost:3000/api/v1/notes/${reminderId}`);

            if (onDelete) onDelete();
            toast.success("Reminder deleted successfully");
        } catch (err) {
            console.error("Error deleting reminder:", err);
            toast.error("Failed to delete reminder");
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No date set";
        try {
            const date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) {
                return "Invalid date";
            }

            if (isToday(date)) {
                return `Today at ${format(date, 'h:mm a')}`;
            } else if (isTomorrow(date)) {
                return `Tomorrow at ${format(date, 'h:mm a')}`;
            } else {
                return format(date, 'MMM d, yyyy - h:mm a');
            }
        } catch (error) {
            console.error("Error formatting date:", error, dateString);
            return "Date error";
        }
    };

    const getStatusBadge = (reminder) => {
        try {
            const reminderDate = new Date(reminder.reminderDate);

            // Check if date is valid
            if (isNaN(reminderDate.getTime())) {
                return (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Invalid Date
                    </span>
                );
            }

            // Always prioritize the actual status over the overdue indicator
            switch (reminder.reminderStatus) {
                case "completed":
                    return (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle size={12} />
                            {reminder.autoUpdated ? "Auto-Completed" : "Completed"}
                        </span>
                    );
                case "missed":
                    return (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <XCircle size={12} />
                            {reminder.autoUpdated ? "Auto-Missed" : "Missed"}
                        </span>
                    );
                case "pending":
                    return isPast(reminderDate) || reminder.isOverdue ? (
                        <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Overdue
                        </span>
                    ) : (
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Clock size={12} />
                            Pending
                        </span>
                    );
                default:
                    return (
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Clock size={12} />
                            Pending
                        </span>
                    );
            }
        } catch (error) {
            console.error("Error getting status badge:", error);
            return (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Error
                </span>
            );
        }
    };

    const getNotificationTypeBadge = (reminder) => {
        if (!reminder.notificationType || reminder.notificationType === "none") {
            return null;
        }

        switch (reminder.notificationType) {
            case "sms":
                return (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Phone size={14} />
                        <span>SMS Notification</span>
                    </div>
                );
            case "email":
                return (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                        <Mail size={14} />
                        <span>Email Notification</span>
                    </div>
                );
            case "both":
                return (
                    <div className="flex items-center gap-1 text-xs text-purple-600">
                        <Bell size={14} />
                        <span>SMS & Email</span>
                    </div>
                );
            case "browser":
                return (
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Monitor size={14} />
                        <span>Browser Notification</span>
                    </div>
                );
            default:
                return null;
        }
    };

    const getBackgroundColorClass = (color) => {
        const validColors = {
            "green-200": "bg-green-200",
            "blue-200": "bg-blue-200",
            "amber-200": "bg-amber-200",
            "red-200": "bg-red-200",
            "purple-200": "bg-purple-200",
            "pink-200": "bg-pink-200",
            "yellow-200": "bg-yellow-200",
            "indigo-200": "bg-indigo-200"
        };

        return validColors[color] || "bg-green-200";
    };

    if (reminders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-100">
                <Bell className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-neutral-600 text-center mb-2">You don't have any reminders yet</p>
                <p className="text-neutral-500 text-center text-sm mb-4">Create your first reminder using the buttons above</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reminders.map((reminder) => {
                const bgColorClass = getBackgroundColorClass(reminder.color || "green-200");

                // Only check for overdue if the reminder is pending
                const isPendingReminder = reminder.reminderStatus === "pending";
                const isOverdue = isPendingReminder && (isPast(new Date(reminder.reminderDate)) || reminder.isOverdue);

                return (
                    <div
                        key={reminder._id}
                        className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border ${isOverdue ? 'border-amber-300' : reminder.reminderStatus === "missed" ? 'border-red-300' : reminder.reminderStatus === "completed" ? 'border-green-300' : 'border-gray-100'} ${bgColorClass}`}
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-3">
                                {getStatusBadge(reminder)}
                                <div className="relative">
                                    <button
                                        onClick={() => toggleMenu(reminder._id)}
                                        className="p-1.5 bg-white bg-opacity-70 text-gray-500 rounded-full hover:bg-opacity-100 transition-all"
                                        aria-label="Reminder options"
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>

                                    {activeMenu === reminder._id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setActiveMenu(null)}
                                            ></div>
                                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                                                <button
                                                    onClick={() => handleEdit(reminder)}
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    <Edit2Icon className="w-4 h-4 text-blue-500" />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => deleteReminder(reminder._id)}
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                                                    disabled={isDeleting && deletingId === reminder._id}
                                                >
                                                    {isDeleting && deletingId === reminder._id ? (
                                                        <Loader2Icon className="w-4 h-4 animate-spin text-red-500" />
                                                    ) : (
                                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                                    )}
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <h2 className="font-bold text-neutral-700 text-xl mb-2 line-clamp-2">{reminder.title}</h2>

                            <div className="text-neutral-600 opacity-80 mb-4 line-clamp-3 text-sm min-h-16">
                                {reminder.description}
                            </div>

                            <div className="bg-white bg-opacity-80 p-2 rounded-lg mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{formatDate(reminder.reminderDate)}</span>
                            </div>

                            {countdowns[reminder._id] && (
                                <div className={`p-2 rounded-lg mb-3 flex items-center gap-2 ${countdowns[reminder._id] === "Overdue"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-blue-100 text-blue-700"
                                    }`}>
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">{countdowns[reminder._id]}</span>
                                </div>
                            )}

                            {getNotificationTypeBadge(reminder) && (
                                <div className="bg-white bg-opacity-80 p-2 rounded-lg mb-3 flex items-center gap-2">
                                    {getNotificationTypeBadge(reminder)}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReminderCard; 