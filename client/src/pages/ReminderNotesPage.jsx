import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Loader2Icon, PlusIcon, Bell, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import ReminderCard from "../Dashboard/components/ReminderCard";
import ReminderNote from "../Dashboard/components/ReminderNote";
import Header from "../Dashboard/components/Header";
import Sidebar from "../Dashboard/components/Sidebar";
import toast from "react-hot-toast";

const ReminderNotesPage = () => {
    const { userId } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchReminderNotes();
        }
    }, [userId, statusFilter]);

    const fetchReminderNotes = async (query = "") => {
        try {
            setLoading(true);
            let url = `http://localhost:3000/api/v1/reminder-notes?userId=${userId}`;

            if (statusFilter !== "all") {
                url += `&reminderStatus=${statusFilter}`;
            }

            if (query) {
                url += `&search=${encodeURIComponent(query)}`;
            }

            const res = await axios.get(url);
            const filteredNotes = Array.isArray(res.data.data) ? res.data.data : [];
            setNotes(filteredNotes);

            if (query) {
                setIsSearching(true);
                if (filteredNotes.length === 0) {
                    toast.error(`No reminder notes found for "${query}"`);
                } else {
                    toast.success(`Found ${filteredNotes.length} reminder notes for "${query}"`);
                }
            } else {
                let toastMessage = "";

                if (statusFilter !== "all") {
                    const statusText = {
                        "pending": "pending",
                        "completed": "completed",
                        "missed": "missed"
                    }[statusFilter];

                    toastMessage = `Showing ${statusText} reminders`;
                }

                if (toastMessage) {
                    toast.success(toastMessage);
                }

                setIsSearching(false);
            }
        } catch (err) {
            console.error("Error fetching reminder notes:", err);
            setError("Failed to load reminder notes");
            toast.error("Failed to load reminder notes");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchReminderNotes(query);
    };

    const handleRefresh = async () => {
        await fetchReminderNotes(searchQuery);
        return true;
    };

    const handleCreateReminder = () => {
        setEditingNote(null);
        setIsReminderOpen(true);
        toast.success("Create a new reminder");
    };

    const handleEditReminder = (note) => {
        setEditingNote(note);
        setIsReminderOpen(true);
        toast.success("Edit your reminder");
    };

    const handleReminderCreated = () => {
        fetchReminderNotes(searchQuery);
        setIsReminderOpen(false);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
    };

    const handleCreateNote = (type) => {
        if (type === 'reminder') {
            setEditingNote(null);
            setIsReminderOpen(true);
        }
    };

    const resetFilters = () => {
        setStatusFilter("all");
        toast.success("Filters reset");
    };

    return (
        <main className="flex min-h-screen">
            <div>
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto">
                <Header onCreateNote={handleCreateNote} onSearch={handleSearch} onRefresh={handleRefresh} title="Reminder Notes" />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Reminder Notes</h1>
                        {isSearching && searchQuery && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Search size={14} />
                                <span>Search results for: <span className="font-medium text-amber-600">"{searchQuery}"</span></span>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setIsSearching(false);
                                        fetchReminderNotes("");
                                    }}
                                    className="text-blue-500 hover:underline ml-2"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                        {!isSearching && (
                            <button
                                onClick={handleCreateReminder}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                                <Bell size={18} />
                                New Reminder
                            </button>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                            </div>
                            {statusFilter !== "all" && (
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <button
                                onClick={() => handleStatusChange("all")}
                                className={`px-3 py-1 rounded-full text-sm ${statusFilter === "all"
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <span className="flex items-center gap-1">
                                    All
                                </span>
                            </button>
                            <button
                                onClick={() => handleStatusChange("pending")}
                                className={`px-3 py-1 rounded-full text-sm ${statusFilter === "pending"
                                    ? "bg-blue-500 text-white"
                                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                    }`}
                            >
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    Pending
                                </span>
                            </button>
                            <button
                                onClick={() => handleStatusChange("completed")}
                                className={`px-3 py-1 rounded-full text-sm ${statusFilter === "completed"
                                    ? "bg-green-500 text-white"
                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                    }`}
                            >
                                <span className="flex items-center gap-1">
                                    <CheckCircle size={14} />
                                    Completed
                                </span>
                            </button>
                            <button
                                onClick={() => handleStatusChange("missed")}
                                className={`px-3 py-1 rounded-full text-sm ${statusFilter === "missed"
                                    ? "bg-red-500 text-white"
                                    : "bg-red-100 text-red-600 hover:bg-red-200"
                                    }`}
                            >
                                <span className="flex items-center gap-1">
                                    <XCircle size={14} />
                                    Missed
                                </span>
                            </button>
                        </div>
                    </div>

                    {loading && !notes.length ? (
                        <div className="flex flex-col items-center justify-center w-full h-64">
                            <Loader2Icon className="w-8 h-8 animate-spin text-green-400 mb-2" />
                            <p className="text-neutral-600 font-medium">Loading your reminders...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-50 rounded-lg border border-gray-200">
                            <Bell className="w-12 h-12 text-gray-300 mb-2" />
                            <p className="text-neutral-600 font-medium mb-1">No reminders found</p>
                            <p className="text-neutral-500 text-sm mb-4">
                                {statusFilter !== "all"
                                    ? "Try changing your filter or create a new reminder"
                                    : "Create your first reminder using the button above"}
                            </p>
                            {statusFilter !== "all" && (
                                <button
                                    onClick={resetFilters}
                                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <ReminderCard
                            reminders={notes}
                            onEdit={handleEditReminder}
                            onDelete={fetchReminderNotes}
                            onRefresh={fetchReminderNotes}
                        />
                    )}
                </div>
            </div>

            {isReminderOpen && (
                <ReminderNote
                    onClose={() => setIsReminderOpen(false)}
                    initialData={editingNote}
                    onSave={handleReminderCreated}
                />
            )}
        </main>
    );
};

export default ReminderNotesPage; 