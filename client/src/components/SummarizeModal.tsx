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
  onSummaryUpdate,
}: {
  notes: Note[];
  onClose: () => void;
  onSummaryUpdate: (id: string, summary: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token') || undefined;

    try {
      for (const note of notes) {
        if (!note.content.trim()) continue;

        const { summary } = await apiRequest<{ summary: string }>(
          '/summary',
          'POST',
          { text: note.content },
          token
        );

        if (summary) {
          onSummaryUpdate(note.id, summary);
        }
      }
    } catch (err: any) {
      console.error('Frontend summary error:', err);
      setError(err.message || 'Failed to summarise notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Summarize Your Notes</h2>
        <p className="mb-4 text-gray-600">
          This will summarize each note individually using Hugging Face BART.
        </p>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>
        </div>
      </div>
    </div>
  );
}
