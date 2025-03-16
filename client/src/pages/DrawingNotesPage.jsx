import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Loader2Icon, PlusIcon, PenLine, Search } from "lucide-react";
import NoteCard from "../Dashboard/components/NoteCard";
import DrawingCanvas from "../Dashboard/components/DrawingCanvas";
import Header from "../Dashboard/components/Header";
import Sidebar from "../Dashboard/components/Sidebar";
import toast from "react-hot-toast";

const DrawingNotesPage = () => {
    const { userId } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDrawingOpen, setIsDrawingOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchDrawingNotes();
        }
    }, [userId]);

    const fetchDrawingNotes = async (query = "") => {
        try {
            setLoading(true);
            const searchParam = query ? `&search=${encodeURIComponent(query)}` : "";
            const res = await axios.get(
                `http://localhost:3000/api/v1/drawing-notes?userId=${userId}${searchParam}`
            );
            setNotes(Array.isArray(res.data.data) ? res.data.data : []);

            if (query) {
                setIsSearching(true);
                if (res.data.data.length === 0) {
                    toast.error(`No drawing notes found for "${query}"`);
                } else {
                    toast.success(`Found ${res.data.data.length} drawing notes for "${query}"`);
                }
            } else {
                setIsSearching(false);
            }
        } catch (err) {
            console.error("Error fetching drawing notes:", err);
            setError("Failed to load drawing notes");
            toast.error("Failed to load drawing notes");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchDrawingNotes(query);
    };

    const handleRefresh = async () => {
        await fetchDrawingNotes(searchQuery);
        return true;
    };

    const handleCreateDrawing = () => {
        setEditingNote(null);
        setIsDrawingOpen(true);
    };

    const handleEditDrawing = (note) => {
        setEditingNote(note);
        setIsDrawingOpen(true);
    };

    const handleDrawingCreated = (updatedDrawing) => {
        fetchDrawingNotes(searchQuery);
        setIsDrawingOpen(false);
        setEditingNote(null);
    };

    const handleCreateNote = (type) => {
        if (type === 'drawing') {
            setEditingNote(null);
            setIsDrawingOpen(true);
        }
    };

    return (
        <main className="flex min-h-screen">
            <div>
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto">
                <Header onCreateNote={handleCreateNote} onSearch={handleSearch} onRefresh={handleRefresh} />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Drawing Notes</h1>
                        {isSearching && searchQuery && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Search size={14} />
                                <span>Search results for: <span className="font-medium text-amber-600">"{searchQuery}"</span></span>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setIsSearching(false);
                                        fetchDrawingNotes("");
                                    }}
                                    className="text-blue-500 hover:underline ml-2"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                        {!isSearching && (
                            <button
                                onClick={handleCreateDrawing}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <PenLine size={18} />
                                New Drawing
                            </button>
                        )}
                    </div>

                    {loading && !notes.length ? (
                        <div className="flex flex-col items-center justify-center w-full h-64">
                            <Loader2Icon className="w-8 h-8 animate-spin text-blue-400 mb-2" />
                            <p className="text-neutral-600 font-medium">Loading your drawings...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    ) : (
                        <NoteCard
                            notes={notes}
                            onEdit={handleEditDrawing}
                            onDelete={fetchDrawingNotes}
                            onRefresh={fetchDrawingNotes}
                        />
                    )}
                </div>
            </div>

            {isDrawingOpen && (
                <DrawingCanvas
                    onClose={() => setIsDrawingOpen(false)}
                    initialData={editingNote}
                    onSave={handleDrawingCreated}
                />
            )}
        </main>
    );
};

export default DrawingNotesPage; 