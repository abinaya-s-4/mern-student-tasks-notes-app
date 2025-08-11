import React from 'react';
import { Edit3, Trash2, Clock, Tag } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const truncatedContent = note.content.length > 150 
    ? note.content.substring(0, 150) + '...' 
    : note.content;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{note.title}</h3>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(note)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-4">{truncatedContent}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Tag className="w-3 h-3" />
          <span>{note.subject}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{note.updatedAt}</span>
        </div>
      </div>
    </div>
  );
}