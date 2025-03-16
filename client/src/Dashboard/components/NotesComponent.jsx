import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Loader2Icon } from "lucide-react";
import NoteCard from "./NoteCard";
import ReminderCard from "./ReminderCard";
import NoteEditor from "./NoteEditor";
import DrawingCanvas from "./DrawingCanvas";
import ReminderNote from "./ReminderNote";
import CreateNoteButtons from "./CreateNoteButtons";
import toast from "react-hot-toast";

const NotesComponent = ({ noteType = "all" }) => {
  const { userId } = useAuth();
  const [notes, setNotes] = useState([]);
  const [textNotes, setTextNotes] = useState([]);
  const [drawingNotes, setDrawingNotes] = useState([]);
  const [reminderNotes, setReminderNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId, noteType]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      switch (noteType) {
        case "text":
          endpoint = `http://localhost:3000/api/v1/text-notes?userId=${userId}`;
          break;
        case "drawing":
          endpoint = `http://localhost:3000/api/v1/drawing-notes?userId=${userId}`;
          break;
        case "reminder":
          endpoint = `http://localhost:3000/api/v1/reminder-notes?userId=${userId}`;
          break;
        default:
          // Fetch all notes
          const textRes = await axios.get(
            `http://localhost:3000/api/v1/text-notes?userId=${userId}`
          );
          const drawingRes = await axios.get(
            `http://localhost:3000/api/v1/drawing-notes?userId=${userId}`
          );
          const reminderRes = await axios.get(
            `http://localhost:3000/api/v1/reminder-notes?userId=${userId}`
          );

          const textData = Array.isArray(textRes.data.data) ? textRes.data.data : [];
          const drawingData = Array.isArray(drawingRes.data.data) ? drawingRes.data.data : [];
          const reminderData = Array.isArray(reminderRes.data.data) ? reminderRes.data.data : [];

          setTextNotes(textData);
          setDrawingNotes(drawingData);
          setReminderNotes(reminderData);
          setNotes([...textData, ...drawingData, ...reminderData]);
          setLoading(false);
          return;
      }

      const res = await axios.get(endpoint);
      setNotes(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = (type) => {
    setEditingNote(null);
    if (type === "text") {
      setIsEditorOpen(true);
      setIsReminderOpen(false);
      setIsDrawingOpen(false);
    } else if (type === "reminder") {
      setIsReminderOpen(true);
      setIsEditorOpen(false);
      setIsDrawingOpen(false);
    } else if (type === "drawing") {
      setIsDrawingOpen(true);
      setIsEditorOpen(false);
      setIsReminderOpen(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    if (note.type === "text") {
      setIsEditorOpen(true);
      setIsReminderOpen(false);
      setIsDrawingOpen(false);
    } else if (note.type === "reminder") {
      setIsReminderOpen(true);
      setIsEditorOpen(false);
      setIsDrawingOpen(false);
    } else if (note.type === "drawing") {
      setIsDrawingOpen(true);
      setIsEditorOpen(false);
      setIsReminderOpen(false);
    }
  };

  const handleNoteCreated = () => {
    fetchNotes();
  };

  if (loading && !notes.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64">
        <Loader2Icon className="w-8 h-8 animate-spin text-amber-400 mb-2" />
        <p className="text-neutral-600 font-medium">Loading your notes...</p>
      </div>
    );
  }

  const renderNotes = () => {
    if (noteType === "reminder") {
      return (
        <ReminderCard
          reminders={notes}
          onEdit={handleEditNote}
          onDelete={handleNoteCreated}
          onRefresh={fetchNotes}
        />
      );
    } else if (noteType === "all") {
      return (
        <>
          {textNotes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Text Notes</h3>
              <NoteCard
                notes={textNotes}
                onEdit={handleEditNote}
                onDelete={handleNoteCreated}
                onRefresh={fetchNotes}
              />
            </div>
          )}

          {drawingNotes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Drawing Notes</h3>
              <NoteCard
                notes={drawingNotes}
                onEdit={handleEditNote}
                onDelete={handleNoteCreated}
                onRefresh={fetchNotes}
              />
            </div>
          )}

          {reminderNotes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Reminder Notes</h3>
              <ReminderCard
                reminders={reminderNotes}
                onEdit={handleEditNote}
                onDelete={handleNoteCreated}
                onRefresh={fetchNotes}
              />
            </div>
          )}

          {textNotes.length === 0 && drawingNotes.length === 0 && reminderNotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No notes found. Create your first note!</p>
            </div>
          )}
        </>
      );
    } else {
      return (
        <NoteCard
          notes={notes}
          onEdit={handleEditNote}
          onDelete={handleNoteCreated}
          onRefresh={fetchNotes}
        />
      );
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <CreateNoteButtons onCreateNote={handleCreateNote} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          All Notes <span className="text-xs text-gray-500 font-normal">manage notes</span>
        </h2>
        <button className="text-sm text-amber-600 hover:text-amber-700">
          See All →
        </button>
      </div>

      <div>
        {renderNotes()}
      </div>

      {/* Conditionally render NoteEditor */}
      {isEditorOpen && (
        <NoteEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          editingNote={editingNote}
          onNoteCreated={handleNoteCreated}
        />
      )}

      {/* Conditionally render ReminderNote */}
      {isReminderOpen && (
        <ReminderNote
          onClose={() => setIsReminderOpen(false)}
          initialData={editingNote}
          onSave={handleNoteCreated}
        />
      )}

      {/* Conditionally render DrawingCanvas */}
      {isDrawingOpen && (
        <DrawingCanvas
          onClose={() => setIsDrawingOpen(false)}
          initialData={editingNote}
          onSave={handleNoteCreated}
        />
      )}
    </div>
  );
};

export default NotesComponent;
