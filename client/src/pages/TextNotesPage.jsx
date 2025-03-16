import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Loader2Icon, PlusIcon, Search } from "lucide-react";
import NoteCard from "../Dashboard/components/NoteCard";
import NoteEditor from "../Dashboard/components/NoteEditor";
import Header from "../Dashboard/components/Header";
import Sidebar from "../Dashboard/components/Sidebar";
import toast from "react-hot-toast";

const TextNotesPage = () => {
    const { userId } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchTextNotes();
        }
    }, [userId]);

    const fetchTextNotes = async (query = "") => {
        try {
            setLoading(true);
            const searchParam = query ? `&search=${encodeURIComponent(query)}` : "";
            const res = await axios.get(
                `http://localhost:3000/api/v1/text-notes?userId=${userId}${searchParam}`
            );
            setNotes(Array.isArray(res.data.data) ? res.data.data : []);

            if (query) {
                setIsSearching(true);
                if (res.data.data.length === 0) {
                    toast.error(`No text notes found for "${query}"`);
                } else {
                    toast.success(`Found ${res.data.data.length} text notes for "${query}"`);
                }
            } else {
                setIsSearching(false);
            }
        } catch (err) {
            console.error("Error fetching text notes:", err);
            setError("Failed to load text notes");
            toast.error("Failed to load text notes");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchTextNotes(query);
    };

    const handleRefresh = async () => {
        await fetchTextNotes(searchQuery);
        return true;
    };

    const handleCreateNote = () => {
        setEditingNote(null);
        setIsEditorOpen(true);
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setIsEditorOpen(true);
    };

    const handleNoteCreated = (updatedNote) => {
        fetchTextNotes(searchQuery);
        setIsEditorOpen(false);
        setEditingNote(null);
    };

    return (
        <main className="flex min-h-screen">
            <div>
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto">
                <Header onCreateNote={(type) => type === 'text' && handleCreateNote()} onSearch={handleSearch} onRefresh={handleRefresh} />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Text Notes</h1>
                        {isSearching && searchQuery && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Search size={14} />
                                <span>Search results for: <span className="font-medium text-amber-600">"{searchQuery}"</span></span>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setIsSearching(false);
                                        fetchTextNotes("");
                                    }}
                                    className="text-blue-500 hover:underline ml-2"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                        {!isSearching && (
                            <button
                                onClick={handleCreateNote}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                            >
                                <PlusIcon size={18} />
                                New Text Note
                            </button>
                        )}
                    </div>

                    {loading && !notes.length ? (
                        <div className="flex flex-col items-center justify-center w-full h-64">
                            <Loader2Icon className="w-8 h-8 animate-spin text-amber-400 mb-2" />
                            <p className="text-neutral-600 font-medium">Loading your notes...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    ) : (
                        <NoteCard
                            notes={notes}
                            onEdit={handleEditNote}
                            onDelete={fetchTextNotes}
                            onRefresh={fetchTextNotes}
                        />
                    )}
                </div>
            </div>

            {isEditorOpen && (
                <NoteEditor
                    isOpen={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    editingNote={editingNote}
                    onNoteCreated={handleNoteCreated}
                />
            )}
        </main>
    );
};

export default TextNotesPage; 