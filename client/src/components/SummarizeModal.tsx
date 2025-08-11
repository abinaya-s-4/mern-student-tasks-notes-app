import React, { useState } from 'react';
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

export default function SummarizeModal({
  notes,
  onClose,
  onSummaryUpdate
}: {
  notes: Note[];
  onClose: () => void;
  onSummaryUpdate: (id: string, summary: string) => void;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const generateSummary = async (noteId: string) => {
    setLoadingId(noteId);
    try {
      const res = await apiRequest<{ summary: string }>(
        `/notes/${noteId}/summary`,
        'POST',
        undefined,
        token || undefined
      );
      onSummaryUpdate(noteId, res.summary);
    } catch (err: any) {
      alert(err.message || 'Error generating summary');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Generate AI Summaries</h2>
        {notes.map((note) => (
          <div key={note.id} className="border-b py-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{note.title}</span>
              <button
                onClick={() => generateSummary(note.id)}
                disabled={loadingId === note.id}
                className="px-3 py-1 text-sm rounded bg-purple-600 text-white hover:bg-purple-700"
              >
                {loadingId === note.id ? 'Generating...' : 'Summarize'}
              </button>
            </div>
            {note.summary && (
              <p className="mt-2 text-sm text-gray-700">
                <strong>Summary:</strong> {note.summary}
              </p>
            )}
          </div>
        ))}
        <div className="text-right mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
