import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2Icon, Edit2Icon, TrashIcon, XIcon, CheckIcon, PlusCircleIcon, CalendarIcon, PenLine, Bell, FileText, MoreHorizontal } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const NoteCard = ({ notes = [], onEdit, onDelete, onRefresh }) => {
  const { userId } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedColor, setUpdatedColor] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  // Available colors for notes with more vibrant options
  const colorOptions = [
    "amber-200", "blue-200", "green-200", "red-200",
    "purple-200", "pink-200", "yellow-200", "indigo-200",
    "teal-200", "cyan-200", "lime-200", "orange-200"
  ];

  useEffect(() => {
    if (!userId) return;
    // No need to fetch notes here as they are passed as props
  }, [userId]);

  const fetchNotes = async () => {
    // This function is not needed as notes are passed as props
    // It's kept for compatibility with existing code
    if (onRefresh && Array.isArray(notes)) {
      onRefresh([...notes]);
    }
  };

  const handleEdit = (note) => {
    // For inline editing within the card
    setEditingNote(note._id);
    setUpdatedTitle(note.title);
    setUpdatedDescription(note.description);
    setUpdatedColor(note.color);
    setActiveMenu(null);

    // Call the parent component's onEdit function if provided
    if (onEdit && typeof onEdit === 'function') {
      onEdit(note);
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
  };

  const saveUpdate = async (noteId) => {
    try {
      const noteType = notes.find(note => note._id === noteId)?.type || "text";
      let endpoint = "";

      switch (noteType) {
        case "text":
          endpoint = `http://localhost:3000/api/v1/text-notes/${noteId}`;
          break;
        case "drawing":
          endpoint = `http://localhost:3000/api/v1/drawing-notes/${noteId}`;
          break;
        case "reminder":
          endpoint = `http://localhost:3000/api/v1/reminder-notes/${noteId}`;
          break;
        default:
          endpoint = `http://localhost:3000/api/v1/text-notes/${noteId}`;
      }

      await axios.put(endpoint, {
        title: updatedTitle,
        description: updatedDescription,
        color: updatedColor
      });

      setEditingNote(null);

      // Call onRefresh to update the UI
      if (onRefresh) {
        await onRefresh();
      }

      toast.success("Note updated successfully");
    } catch (err) {
      console.error("Error updating note:", err);
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (noteId) => {
    try {
      setIsDeleting(true);
      setDeletingId(noteId);
      setActiveMenu(null);

      // Find the note to determine its type
      const noteToDelete = notes.find(note => note._id === noteId);
      if (!noteToDelete) {
        throw new Error("Note not found");
      }

      // Use the specific endpoint based on note type
      let endpoint = "";
      switch (noteToDelete.type) {
        case "text":
          endpoint = `http://localhost:3000/api/v1/text-notes/${noteId}`;
          break;
        case "drawing":
          endpoint = `http://localhost:3000/api/v1/drawing-notes/${noteId}`;
          break;
        case "reminder":
          endpoint = `http://localhost:3000/api/v1/reminder-notes/${noteId}`;
          break;
        default:
          endpoint = `http://localhost:3000/api/v1/text-notes/${noteId}`;
      }

      // Delete the note
      await axios.delete(endpoint);

      if (onDelete) onDelete();
      toast.success("Note deleted successfully");
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const getTextColorClass = (bgColor) => {
    if (!bgColor) return "text-neutral-700";

    const darkColors = ['red', 'blue', 'black', 'purple', 'green', 'gray', 'indigo'];
    const colorBase = bgColor.split('-')[0];

    if (darkColors.includes(colorBase) && (bgColor.includes('-700') || bgColor.includes('-800') || bgColor.includes('-900'))) {
      return 'text-white';
    }
    return 'text-neutral-700';
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return "";
    }
  };

  const getNoteIcon = (type) => {
    switch (type) {
      case "drawing":
        return <PenLine className="w-4 h-4" />;
      case "reminder":
        return <Bell className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getNoteTypeColor = (type) => {
    switch (type) {
      case "drawing":
        return "bg-blue-100 text-blue-600";
      case "reminder":
        return "bg-green-100 text-green-600";
      default:
        return "bg-amber-100 text-amber-600";
    }
  };

  const getReminderStatus = (note) => {
    if (note.type !== "reminder") return null;

    const reminderDate = new Date(note.reminderDate);
    const now = new Date();

    if (note.reminderStatus === "completed") {
      return <span className="text-green-500 text-xs font-medium">Completed</span>;
    } else if (reminderDate < now) {
      return <span className="text-red-500 text-xs font-medium">Missed</span>;
    } else {
      return <span className="text-blue-500 text-xs font-medium">Pending</span>;
    }
  };

  const toggleMenu = (noteId) => {
    if (activeMenu === noteId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(noteId);
    }
  };

  if (!notes.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-neutral-400 mb-4">
          <FileText className="w-12 h-12" />
        </div>
        <p className="text-neutral-600 text-center mb-2">You don't have any notes yet</p>
        <p className="text-neutral-500 text-center text-sm mb-4">Create your first note using the buttons above</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {notes.map((note) => {
        // Handle background color safely
        const bgColorClass = note.color && note.color.startsWith('bg-')
          ? note.color
          : `bg-${note.color || 'amber-200'}`;

        const textColorClass = getTextColorClass(note.color);

        return (
          <div
            key={note._id}
            className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${bgColorClass}`}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getNoteTypeColor(note.type)} flex items-center gap-1`}>
                  {getNoteIcon(note.type)}
                  {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                </span>
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(note._id)}
                    className="p-1.5 bg-white bg-opacity-70 text-gray-500 rounded-full hover:bg-opacity-100 transition-all"
                    aria-label="Note options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {activeMenu === note._id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveMenu(null)}
                      ></div>
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                        <button
                          onClick={() => handleEdit(note)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                        >
                          <Edit2Icon className="w-4 h-4 text-blue-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteNote(note._id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                          disabled={isDeleting && deletingId === note._id}
                        >
                          {isDeleting && deletingId === note._id ? (
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

              <h2 className={`font-bold ${textColorClass} text-xl mb-2 line-clamp-2`}>{note.title}</h2>

              {note.type === "drawing" ? (
                <div className="mb-4 bg-white rounded-lg p-1 shadow-sm">
                  <img
                    src={note.drawingData}
                    alt={note.title}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
              ) : (
                <div className={`${textColorClass} opacity-80 mb-4 line-clamp-4 text-sm min-h-16`}>
                  {note.description}
                </div>
              )}

              <div className="flex justify-between items-center mt-3 text-xs text-neutral-500">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {formatDate(note.createdAt)}
                </div>
                {note.type === "reminder" && (
                  <div className="flex items-center gap-1 bg-white bg-opacity-70 px-2 py-1 rounded-full">
                    <Bell className="w-3 h-3" />
                    <span>{formatDate(note.reminderDate)}</span>
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${note.reminderStatus === "completed" ? "bg-green-100 text-green-600" :
                      note.reminderStatus === "missed" ? "bg-red-100 text-red-600" :
                        "bg-blue-100 text-blue-600"
                      }`}>
                      {note.reminderStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className={`h-1 w-full ${bgColorClass.replace('-200', '-300')}`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default NoteCard;