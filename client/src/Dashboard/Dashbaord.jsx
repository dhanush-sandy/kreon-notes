import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { Loader2Icon, FileText, PenLine, Bell, ArrowRight, NotebookPen, Search, LayoutGrid, BarChart3, TrendingUp } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NoteCard from './components/NoteCard';
import ReminderCard from './components/ReminderCard';
import NoteEditor from './components/NoteEditor';
import DrawingCanvas from './components/DrawingCanvas';
import ReminderNote from './components/ReminderNote';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { userId, user } = useAuth();
  const [textNotes, setTextNotes] = useState([]);
  const [drawingNotes, setDrawingNotes] = useState([]);
  const [reminderNotes, setReminderNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [totalNotes, setTotalNotes] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchAllNotes();
    }
  }, [userId]);

  const fetchAllNotes = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const searchParam = query ? `&search=${encodeURIComponent(query)}` : '';

      // Fetch recent text notes
      const textRes = await axios.get(
        `http://localhost:3000/api/v1/text-notes?userId=${userId}${searchParam}`
      );
      const textNotesData = Array.isArray(textRes.data.data) ? textRes.data.data : [];
      setTextNotes(textNotesData.slice(0, 4));

      // Fetch recent drawing notes
      const drawingRes = await axios.get(
        `http://localhost:3000/api/v1/drawing-notes?userId=${userId}${searchParam}`
      );
      const drawingNotesData = Array.isArray(drawingRes.data.data) ? drawingRes.data.data : [];
      setDrawingNotes(drawingNotesData.slice(0, 4));

      // Fetch recent reminder notes
      const reminderRes = await axios.get(
        `http://localhost:3000/api/v1/reminder-notes?userId=${userId}${searchParam}`
      );
      const reminderNotesData = Array.isArray(reminderRes.data.data) ? reminderRes.data.data : [];
      setReminderNotes(reminderNotesData.slice(0, 4));

      // Calculate total notes
      setTotalNotes(textNotesData.length + drawingNotesData.length + reminderNotesData.length);

      if (query) {
        setIsSearching(true);
        const totalResults =
          textNotesData.length + drawingNotesData.length + reminderNotesData.length;

        if (totalResults === 0) {
          toast.error(`No results found for "${query}"`);
        } else {
          toast.success(`Found ${totalResults} results for "${query}"`);
        }
      } else {
        setIsSearching(false);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes');
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchAllNotes(query);
  };

  const handleRefresh = async () => {
    await fetchAllNotes(searchQuery);
    return true;
  };

  const handleCreateNote = (type) => {
    setEditingNote(null);
    if (type === 'text') {
      setIsEditorOpen(true);
      setIsDrawingOpen(false);
      setIsReminderOpen(false);
    } else if (type === 'drawing') {
      setIsDrawingOpen(true);
      setIsEditorOpen(false);
      setIsReminderOpen(false);
    } else if (type === 'reminder') {
      setIsReminderOpen(true);
      setIsEditorOpen(false);
      setIsDrawingOpen(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    if (note.type === 'text') {
      setIsEditorOpen(true);
      setIsDrawingOpen(false);
      setIsReminderOpen(false);
    } else if (note.type === 'drawing') {
      setIsDrawingOpen(true);
      setIsEditorOpen(false);
      setIsReminderOpen(false);
    } else if (note.type === 'reminder') {
      setIsReminderOpen(true);
      setIsEditorOpen(false);
      setIsDrawingOpen(false);
    }
  };

  const handleNoteCreated = () => {
    fetchAllNotes(searchQuery);
  };

  const renderSectionHeader = (title, icon, color, path) => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <Link to={path} className={`text-sm ${color} hover:underline flex items-center gap-1 font-medium`}>
        See All <ArrowRight size={14} />
      </Link>
    </div>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderStatCard = (title, value, icon, color) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow`}>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  if (loading && !textNotes.length && !drawingNotes.length && !reminderNotes.length) {
    return (
      <main className="flex min-h-screen bg-gray-50">
        <div>
          <Sidebar />
        </div>
        <div className="w-full">
          <Header onSearch={handleSearch} onRefresh={handleRefresh} />
          <div className="flex flex-col items-center justify-center w-full h-64">
            <Loader2Icon className="w-8 h-8 animate-spin text-amber-400 mb-2" />
            <p className="text-neutral-600 font-medium">Loading your notes...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-gray-50">
      <div className=''>
        <Sidebar />
      </div>
      <div className="w-full">
        <Header onCreateNote={handleCreateNote} onSearch={handleSearch} onRefresh={handleRefresh} />
        <div className="p-6 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-1">{getGreeting()}, {user?.firstName || 'User'}</h1>
                <p className="text-gray-500">Here's an overview of your notes</p>
              </div>
              {isSearching && searchQuery && (
                <div className="flex items-center gap-2 text-sm bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                  <Search size={14} className="text-amber-500" />
                  <span>Results for: <span className="font-medium text-amber-600">"{searchQuery}"</span></span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearching(false);
                      fetchAllNotes('');
                    }}
                    className="text-blue-500 hover:underline ml-2 font-medium"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {renderStatCard(
              'Total Notes',
              totalNotes,
              <LayoutGrid size={24} className="text-white" />,
              'bg-indigo-500'
            )}
            {renderStatCard(
              'Text Notes',
              textNotes.length > 0 ? textNotes.length : '0',
              <FileText size={24} className="text-white" />,
              'bg-amber-500'
            )}
            {renderStatCard(
              'Upcoming Reminders',
              reminderNotes.filter(note => note.reminderStatus === 'pending').length,
              <Bell size={24} className="text-white" />,
              'bg-green-500'
            )}
          </div>

          {/* Text Notes Section */}
          <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderSectionHeader(
              'Text Notes',
              <FileText size={18} className="text-amber-500" />,
              'text-amber-600',
              '/text-notes'
            )}
            {textNotes.length > 0 ? (
              <NoteCard
                notes={textNotes}
                onEdit={handleEditNote}
                onDelete={handleNoteCreated}
                onRefresh={fetchAllNotes}
              />
            ) : (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center justify-center flex-col gap-3 text-center">
                <NotebookPen size={32} className='text-amber-500' />
                <p className="text-xl text-neutral-800 font-bold">
                  {isSearching ? 'No text notes match your search' : 'No text notes yet'}
                </p>
                {!isSearching && (
                  <button
                    onClick={() => handleCreateNote('text')}
                    className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Create your first text note
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Drawing Notes Section */}
          <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderSectionHeader(
              'Drawing Notes',
              <PenLine size={18} className="text-blue-500" />,
              'text-blue-600',
              '/drawing-notes'
            )}
            {drawingNotes.length > 0 ? (
              <NoteCard
                notes={drawingNotes}
                onEdit={handleEditNote}
                onDelete={handleNoteCreated}
                onRefresh={fetchAllNotes}
              />
            ) : (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center justify-center flex-col gap-3 text-center">
                <PenLine size={32} className='text-blue-500' />
                <p className="text-xl text-neutral-800 font-bold">
                  {isSearching ? 'No drawing notes match your search' : 'No drawing notes yet'}
                </p>
                {!isSearching && (
                  <button
                    onClick={() => handleCreateNote('drawing')}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create your first drawing
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Reminder Notes Section */}
          <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderSectionHeader(
              'Reminder Notes',
              <Bell size={18} className="text-green-500" />,
              'text-green-600',
              '/reminder-notes'
            )}
            {reminderNotes.length > 0 ? (
              <ReminderCard
                reminders={reminderNotes}
                onEdit={handleEditNote}
                onDelete={handleNoteCreated}
                onRefresh={fetchAllNotes}
              />
            ) : (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center justify-center flex-col gap-3 text-center">
                <Bell size={32} className='text-green-500' />
                <p className="text-xl text-neutral-800 font-bold">
                  {isSearching ? 'No reminder notes match your search' : 'No reminder notes yet'}
                </p>
                {!isSearching && (
                  <button
                    onClick={() => handleCreateNote('reminder')}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Create your first reminder
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modals for creating/editing notes */}
      {isEditorOpen && (
        <NoteEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          editingNote={editingNote}
          onNoteCreated={handleNoteCreated}
        />
      )}

      {isDrawingOpen && (
        <DrawingCanvas
          onClose={() => setIsDrawingOpen(false)}
          initialData={editingNote}
          onSave={handleNoteCreated}
        />
      )}

      {isReminderOpen && (
        <ReminderNote
          onClose={() => setIsReminderOpen(false)}
          initialData={editingNote}
          onSave={handleNoteCreated}
        />
      )}
    </main>
  );
};

export default Dashboard;