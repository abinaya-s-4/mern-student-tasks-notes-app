import React, { useState, useEffect } from 'react';
import { Plus, Search, BookOpen, Sparkles, LogOut } from 'lucide-react';
import NoteCard from './NoteCard';
import CreateNoteModal from './CreateNoteModal';
import SummarizeModal from './SummarizeModal';
import { apiRequest } from '../api';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage({
  user,
  onLogout
}: {
  user: { name: string; email: string };
  onLogout: () => void;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const token = localStorage.getItem('token');

  // Load notes on page load
  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<Note[]>('/notes', 'GET', undefined, token || undefined);
        setNotes(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const subjects = Array.from(new Set(notes.map((note) => note.subject)));

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote = await apiRequest<Note>('/notes', 'POST', noteData, token || undefined);
    setNotes((prev) => [newNote, ...prev]);
    setShowCreateModal(false);
  };

  const handleUpdateNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      const updated = await apiRequest<Note>(
        `/notes/${editingNote.id}`,
        'PUT',
        noteData,
        token || undefined
      );
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setEditingNote(null);
      setShowCreateModal(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    await apiRequest(`/notes/${id}`, 'DELETE', undefined, token || undefined);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleUpdateSummary = (id: string, summary: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, summary } : n)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold">StudyNotes</h1>
          </div>
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>

        <button
          onClick={() => setShowSummarizeModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Sparkles className="w-5 h-5" />
          Summarize Notes
        </button>

        <button
          onClick={() => {
            setEditingNote(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className="max-w-7xl mx-auto p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={setEditingNote} onDelete={handleDeleteNote} />
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateNoteModal
          note={editingNote}
          onSave={editingNote ? handleUpdateNote : handleCreateNote}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showSummarizeModal && (
        <SummarizeModal
          notes={notes}
          onClose={() => setShowSummarizeModal(false)}
          onSummaryUpdate={handleUpdateSummary}
        />
      )}
    </div>
  );
}
