import React, { useState } from 'react';
import { Plus, Search, BookOpen, Sparkles, LogOut } from 'lucide-react';
import NoteCard from './NoteCard';
import CreateNoteModal from './CreateNoteModal';
import SummarizeModal from './SummarizeModal';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesPageProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export default function NotesPage({ user, onLogout }: NotesPageProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Introduction to React',
      content: 'React is a JavaScript library for building user interfaces. It uses components to create reusable UI elements...',
      subject: 'Web Development',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Database Fundamentals',
      content: 'A database is a structured collection of data. SQL is used to interact with relational databases...',
      subject: 'Computer Science',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const subjects = Array.from(new Set(notes.map(note => note.subject)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setNotes(prev => [newNote, ...prev]);
    setShowCreateModal(false);
  };

  const handleUpdateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...note, ...noteData, updatedAt: new Date().toISOString().split('T')[0] }
          : note
      ));
      setEditingNote(null);
      setShowCreateModal(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">StudyNotes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <button
            onClick={() => setShowSummarizeModal(true)}
            className="flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Sparkles className="w-5 h-5" />
            <span>Summarize Notes</span>
          </button>

          <button
            onClick={() => {
              setEditingNote(null);
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>New Note</span>
          </button>
        </div>

        {/* Notes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
          
          {filteredNotes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedSubject ? 'Try adjusting your search criteria' : 'Create your first note to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateNoteModal
          note={editingNote}
          onSave={editingNote ? handleUpdateNote : handleCreateNote}
          onClose={() => {
            setShowCreateModal(false);
            setEditingNote(null);
          }}
        />
      )}

      {showSummarizeModal && (
        <SummarizeModal
          notes={notes}
          onClose={() => setShowSummarizeModal(false)}
        />
      )}
    </div>
  );
}