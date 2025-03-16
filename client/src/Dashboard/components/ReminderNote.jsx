import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2Icon, Clock, Calendar, Bell, XIcon, Save, CheckCircle, Phone, AlertTriangle, Info, Mail, Monitor, ChevronDown } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";
import NotificationService from "../../services/NotificationService";

const ReminderNote = ({ onClose, onSave, initialData = null }) => {
    const { userId } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("green-200");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [time, setTime] = useState(
        new Date().toTimeString().split(" ")[0].slice(0, 5)
    );
    const [loading, setLoading] = useState(false);
    const [reminderStatus, setReminderStatus] = useState("pending");
    const [isEditing, setIsEditing] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [notificationType, setNotificationType] = useState("none");
    const [saveError, setSaveError] = useState("");
    const [countdown, setCountdown] = useState("");
    const [dateError, setDateError] = useState("");
    const [browserNotificationPermission, setBrowserNotificationPermission] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

    useEffect(() => {
        // Check browser notification permission
        const checkPermission = async () => {
            const isPermitted = NotificationService.isBrowserNotificationPermitted();
            setBrowserNotificationPermission(isPermitted);
            
            // If permission is already granted, request it automatically
            if (!isPermitted) {
                requestBrowserPermission();
            }
        };

        checkPermission();
    }, []);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
            setColor(initialData.color || "green-200");
            setIsEditing(true);
            setReminderStatus(initialData.reminderStatus || "pending");
            setPhoneNumber(initialData.phoneNumber || "");
            setEmail(initialData.email || "");

            // Set notification type based on existing data
            if (initialData.notificationType) {
                setNotificationType(initialData.notificationType);
            } else if (initialData.phoneNumber && initialData.email) {
                setNotificationType("both");
            } else if (initialData.phoneNumber) {
                setNotificationType("sms");
            } else if (initialData.email) {
                setNotificationType("email");
            } else {
                setNotificationType("none");
            }

            if (initialData.reminderDate) {
                const reminderDate = new Date(initialData.reminderDate);
                setDate(reminderDate.toISOString().split("T")[0]);
                setTime(reminderDate.toTimeString().split(" ")[0].slice(0, 5));
            }
        } else {
            setTitle("");
            setDescription("");
            setColor("green-200");
            setIsEditing(false);
            setReminderStatus("pending");
            setPhoneNumber("");
            setEmail("");
            setNotificationType("none");

            // Set default time to 30 minutes from now
            const defaultDate = new Date();
            defaultDate.setMinutes(defaultDate.getMinutes() + 30);
            setDate(defaultDate.toISOString().split("T")[0]);
            setTime(defaultDate.toTimeString().split(" ")[0].slice(0, 5));
        }
    }, [initialData]);

    // Update countdown timer
    useEffect(() => {
        if (!date || !time) return;

        const updateCountdown = () => {
            try {
                const reminderDate = new Date(`${date}T${time}`);

                if (isPast(reminderDate)) {
                    setCountdown("This reminder is in the past");
                    setDateError("Please select a future date and time");
                } else {
                    setDateError("");
                    setCountdown(formatDistanceToNow(reminderDate, { addSuffix: true }));
                }
            } catch (error) {
                console.error("Error updating countdown:", error);
                setCountdown("");
                setDateError("Invalid date format");
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [date, time]);

    const colorOptions = [
        "green-200", "blue-200", "amber-200", "red-200",
        "purple-200", "pink-200", "yellow-200", "indigo-200"
    ];

    const validatePhoneNumber = (phone) => {
        // If no phone is provided or it's an empty string, it's valid (phone is optional)
        if (!phone || phone.trim() === '') {
            setPhoneError("");
            return true;
        }

        // Basic validation for phone numbers
        // Must start with + followed by country code and number
        // E.g., +1234567890 (for US/Canada)
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;

        if (!phoneRegex.test(phone.trim())) {
            setPhoneError("Please enter a valid phone number with country code (e.g., +1234567890)");
            return false;
        }

        setPhoneError("");
        return true;
    };

    const validateEmail = (email) => {
        // If no email is provided or it's an empty string, it's valid (email is optional)
        if (!email || email.trim() === '') {
            setEmailError("");
            return true;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setEmailError("Please enter a valid email address");
            return false;
        }

        setEmailError("");
        return true;
    };

    const validateNotificationSettings = () => {
        // Validate based on notification type
        if (notificationType === "sms" || notificationType === "both") {
            if (!phoneNumber || phoneNumber.trim() === '') {
                setPhoneError("Phone number is required for SMS notifications");
                return false;
            }
            if (!validatePhoneNumber(phoneNumber)) {
                return false;
            }
        }

        if (notificationType === "email" || notificationType === "both") {
            if (!email || email.trim() === '') {
                setEmailError("Email is required for email notifications");
                return false;
            }
            if (!validateEmail(email)) {
                return false;
            }
        }

        return true;
    };

    const validateDateTime = () => {
        try {
            if (!date || !time) {
                setDateError("Date and time are required");
                return false;
            }

            const reminderDate = new Date(`${date}T${time}`);

            // Check if date is valid
            if (isNaN(reminderDate.getTime())) {
                setDateError("Invalid date or time format");
                return false;
            }

            const now = new Date();

            if (reminderDate <= now) {
                setDateError("Please select a future date and time");
                return false;
            }

            setDateError("");
            return true;
        } catch (error) {
            console.error("Date validation error:", error);
            setDateError("Invalid date or time");
            return false;
        }
    };

    const requestBrowserPermission = async () => {
        const granted = await NotificationService.requestNotificationPermission();
        setBrowserNotificationPermission(granted);
        
        if (granted) {
            toast.success("Browser notification permission granted");
        }
    };

    const saveReminder = async () => {
        if (!title.trim() || !description.trim()) return;

        if (!validateNotificationSettings()) {
            return;
        }

        setLoading(true);
        setSaveError("");

        try {
            const reminderDate = new Date(`${date}T${time}`);

            // Create the base note data
            const noteData = {
                userId,
                title,
                description,
                color,
                type: "reminder",
                reminderDate: reminderDate.toISOString(),
                reminderStatus,
                notificationType
            };

            // Only add phoneNumber if it's actually provided and needed
            if ((notificationType === "sms" || notificationType === "both") && phoneNumber && phoneNumber.trim()) {
                // Format phone number to ensure it has a + prefix
                let formattedPhone = phoneNumber.trim();
                if (!formattedPhone.startsWith('+')) {
                    formattedPhone = '+' + formattedPhone;
                }
                noteData.phoneNumber = formattedPhone;
            }

            // Only add email if it's actually provided and needed
            if ((notificationType === "email" || notificationType === "both") && email && email.trim()) {
                noteData.email = email.trim();
            }

            let response;

            if (isEditing && initialData?._id) {
                // Update existing reminder
                response = await axios.put(
                    `http://localhost:3000/api/v1/reminder-notes/${initialData._id}`,
                    noteData
                );

                if (response.data.success) {
                    toast.success("Reminder updated successfully");
                }
            } else {
                // Create new reminder
                response = await axios.post(
                    "http://localhost:3000/api/v1/reminder-notes",
                    noteData
                );

                if (response.data.success) {
                    toast.success("Reminder created successfully");
                }
            }

            if (response.data.success) {
                // Schedule browser notification if permission is granted
                if (browserNotificationPermission) {
                    const now = new Date();
                    const reminderTime = new Date(`${date}T${time}`);
                    const delay = reminderTime.getTime() - now.getTime();
                    
                    if (delay > 0) {
                        // Only schedule if the reminder is in the future
                        NotificationService.scheduleReminderNotification(
                            {
                                title,
                                description,
                                reminderDate: reminderTime
                            },
                            delay
                        );
                        toast.success("Browser notification scheduled");
                    }
                }

                if (onSave) {
                    onSave(response.data.data);
                }

                if (onClose) {
                    onClose();
                }
            } else {
                setSaveError(response.data.message || "Failed to save reminder");
                toast.error(response.data.message || "Failed to save reminder");
            }
        } catch (error) {
            console.error("Error saving reminder:", error);

            // Handle specific error for missing phone number
            if (error.response?.data?.message === "No phone number associated with this reminder") {
                setSaveError("Phone number is required for SMS notifications. Please enter a valid phone number.");
                toast.error("Phone number is required for SMS notifications");
            } else {
                const errorMessage = error.response?.data?.message ||
                    "Failed to save reminder. Please check your connection and try again.";
                setSaveError(errorMessage);
                toast.error(errorMessage);
            }

            if (error.response?.data?.error) {
                console.error("Server error details:", error.response.data.error);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateReminderStatus = async (status) => {
        if (!initialData?._id) return;

        setLoading(true);
        setReminderStatus(status);
        setStatusDropdownOpen(false);

        try {
            await axios.put(
                `http://localhost:3000/api/v1/reminder-notes/status/${initialData._id}`,
                { reminderStatus: status }
            );

            toast.success(`Reminder marked as ${status}`);

            if (onSave) {
                onSave();
            }
        } catch (error) {
            console.error("Error updating reminder status:", error);
            toast.error("Failed to update reminder status");
            // Revert the status if the update failed
            setReminderStatus(initialData.reminderStatus || "pending");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    const getTextColorClass = (bgColor) => {
        const darkColors = ['red', 'blue', 'black', 'purple', 'green', 'gray', 'indigo'];
        const colorBase = bgColor.split('-')[0];

        if (darkColors.includes(colorBase) && (bgColor.includes('-700') || bgColor.includes('-800') || bgColor.includes('-900'))) {
            return 'text-white';
        }
        return 'text-neutral-700';
    };

    // Add a function to get the background color class
    const getBackgroundColorClass = () => {
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

    // Add a function to get the color button class
    const getColorButtonClass = (colorOption) => {
        const baseClasses = "w-8 h-8 rounded-full cursor-pointer transition-all duration-200";
        const colorClasses = {
            "green-200": "bg-green-200",
            "blue-200": "bg-blue-200",
            "amber-200": "bg-amber-200",
            "red-200": "bg-red-200",
            "purple-200": "bg-purple-200",
            "pink-200": "bg-pink-200",
            "yellow-200": "bg-yellow-200",
            "indigo-200": "bg-indigo-200"
        };

        const selectedClasses = color === colorOption ? 'ring-2 ring-offset-2 ring-blue-500 transform scale-110' : 'hover:scale-105';

        return `${baseClasses} ${colorClasses[colorOption]} ${selectedClasses}`;
    };

    // Function to get human-readable date
    const getHumanReadableDate = () => {
        try {
            const reminderDate = new Date(`${date}T${time}`);

            if (isToday(reminderDate)) {
                return `Today at ${format(reminderDate, 'h:mm a')}`;
            } else if (isTomorrow(reminderDate)) {
                return `Tomorrow at ${format(reminderDate, 'h:mm a')}`;
            } else {
                return format(reminderDate, 'EEEE, MMMM d, yyyy at h:mm a');
            }
        } catch (error) {
            return "";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl transition-all duration-300 ease-in-out p-6 ${getBackgroundColorClass()}`}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Bell size={20} className={getTextColorClass(color)} />
                        <h2 className={`text-lg font-semibold ${getTextColorClass(color)}`}>
                            {isEditing ? "Edit Reminder" : "Set Reminder"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full"
                    >
                        <XIcon size={18} />
                    </button>
                </div>

                {/* Countdown display */}
                {countdown && (
                    <div className="mb-4 p-3 bg-white bg-opacity-80 rounded-lg flex items-center gap-2">
                        <Clock size={18} className="text-blue-500" />
                        <div>
                            <p className="text-sm font-medium">
                                {getHumanReadableDate()}
                            </p>
                            <p className="text-xs text-gray-500">
                                {countdown}
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-white bg-opacity-80 p-4 rounded-lg mb-4">
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Reminder Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div className="mb-3">
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-24"
                        />
                    </div>

                    {saveError && (
                        <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {saveError}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Date</label>
                            <div className="relative">
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Calendar size={16} />
                                </div>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        validateDateTime();
                                    }}
                                    className={`w-full pl-8 pr-2 py-2 border rounded-lg ${dateError ? 'border-red-500' : ''}`}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Time</label>
                            <div className="relative">
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Clock size={16} />
                                </div>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => {
                                        setTime(e.target.value);
                                        validateDateTime();
                                    }}
                                    className={`w-full pl-8 pr-2 py-2 border rounded-lg ${dateError ? 'border-red-500' : ''}`}
                                />
                            </div>
                        </div>
                    </div>

                    {dateError && (
                        <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                            <AlertTriangle size={16} />
                            {dateError}
                        </div>
                    )}

                    <div className="py-2">
                        <label className="block text-xs text-gray-500 mb-1">Reminder Color</label>
                        <div className="flex flex-wrap gap-2">
                            {colorOptions.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`${getColorButtonClass(c)} py-3`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Browser notification permission section */}
                    <div className="mb-4 mt-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <Monitor size={18} className="text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Browser Notifications</p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Browser notifications will appear even when you're not actively using the app, as long as your browser is open.
                                    </p>
                                    
                                    {!browserNotificationPermission && (
                                        <div className="mt-2">
                                            <button 
                                                onClick={requestBrowserPermission}
                                                className="px-3 py-1 bg-amber-500 text-white text-xs rounded hover:bg-amber-600 transition"
                                            >
                                                Enable Browser Notifications
                                            </button>
                                        </div>
                                    )}
                                    
                                    {browserNotificationPermission && (
                                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                            <CheckCircle size={12} />
                                            Browser notifications enabled
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">Additional Notification Options</label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <button
                                type="button"
                                onClick={() => setNotificationType("none")}
                                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm border ${notificationType === "none"
                                    ? "bg-gray-100 border-gray-400"
                                    : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <Bell size={16} className="text-gray-500" />
                                None
                            </button>
                            <button
                                type="button"
                                onClick={() => setNotificationType("sms")}
                                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm border ${notificationType === "sms"
                                    ? "bg-blue-100 border-blue-400"
                                    : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <Phone size={16} className="text-blue-500" />
                                SMS
                            </button>
                            <button
                                type="button"
                                onClick={() => setNotificationType("email")}
                                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm border ${notificationType === "email"
                                    ? "bg-green-100 border-green-400"
                                    : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <Mail size={16} className="text-green-500" />
                                Email
                            </button>
                            <button
                                type="button"
                                onClick={() => setNotificationType("both")}
                                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm border ${notificationType === "both"
                                    ? "bg-purple-100 border-purple-400"
                                    : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <Bell size={16} className="text-purple-500" />
                                Both
                            </button>
                        </div>
                    </div>

                    {(notificationType === "sms" || notificationType === "both") && (
                        <div className="mb-4">
                            <label className="block text-xs text-gray-500 mb-1">Phone Number (for SMS notifications)</label>
                            <div className="relative">
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Phone size={16} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="+1XXXXXXXXXX (include country code)"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        if (phoneError) validatePhoneNumber(e.target.value);
                                    }}
                                    className={`w-full pl-8 pr-2 py-2 border rounded-lg ${phoneError ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {phoneError && (
                                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <Info size={14} className="text-blue-500" />
                                <p>
                                    Phone number must include country code (e.g., +1 for US/Canada).
                                    (SMS notifications require Twilio setup)
                                </p>
                            </div>
                        </div>
                    )}

                    {(notificationType === "email" || notificationType === "both") && (
                        <div className="mb-4">
                            <label className="block text-xs text-gray-500 mb-1">Email (for email notifications)</label>
                            <div className="relative">
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Mail size={16} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="example@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailError) validateEmail(e.target.value);
                                    }}
                                    className={`w-full pl-8 pr-2 py-2 border rounded-lg ${emailError ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {emailError && (
                                <p className="text-red-500 text-xs mt-1">{emailError}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <Info size={14} className="text-blue-500" />
                                <p>
                                    Enter your email address to receive email notifications.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {isEditing && (
                    <div className="bg-white bg-opacity-80 p-3 rounded-lg mb-4">
                        <div className="text-sm font-medium mb-2">Reminder Status</div>
                        <div className="relative">
                            <button
                                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm border ${
                                    reminderStatus === "pending" ? "bg-blue-100 border-blue-300 text-blue-800" :
                                    reminderStatus === "completed" ? "bg-green-100 border-green-300 text-green-800" :
                                    "bg-red-100 border-red-300 text-red-800"
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    {reminderStatus === "pending" && <Clock size={16} />}
                                    {reminderStatus === "completed" && <CheckCircle size={16} />}
                                    {reminderStatus === "missed" && <AlertTriangle size={16} />}
                                    <span className="capitalize">{reminderStatus}</span>
                                </span>
                                <ChevronDown size={16} className={`transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {statusDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={() => updateReminderStatus("pending")}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-blue-50 text-blue-700 rounded-t-lg"
                                    >
                                        <Clock size={16} />
                                        Pending
                                    </button>
                                    <button
                                        onClick={() => updateReminderStatus("completed")}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-green-50 text-green-700"
                                    >
                                        <CheckCircle size={16} />
                                        Completed
                                    </button>
                                    <button
                                        onClick={() => updateReminderStatus("missed")}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-700 rounded-b-lg"
                                    >
                                        <AlertTriangle size={16} />
                                        Missed
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="p-4 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={saveReminder}
                        disabled={loading || !title.trim() || !description.trim() || !!dateError}
                        className={`px-4 py-2 rounded-lg flex items-center gap-1 ${loading || !title.trim() || !description.trim() || !!dateError
                            ? 'bg-green-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                    >
                        {loading ? (
                            <Loader2Icon size={16} className="animate-spin" />
                        ) : (
                            <CheckCircle size={16} />
                        )}
                        {isEditing ? "Update Reminder" : "Set Reminder"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReminderNote;