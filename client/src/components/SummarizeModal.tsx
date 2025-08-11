import React, { useState } from 'react';
import { X, Sparkles, FileText, BookOpen } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

interface SummarizeModalProps {
  notes: Note[];
  onClose: () => void;
}

export default function SummarizeModal({ notes, onClose }: SummarizeModalProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');

  const subjects = Array.from(new Set(notes.map(note => note.subject)));
  const filteredNotes = selectedSubject 
    ? notes.filter(note => note.subject === selectedSubject)
    : notes;

  const generateSummary = () => {
    setIsGenerating(true);
    
    // Simulate AI summarization with a delay
    setTimeout(() => {
      const subjectText = selectedSubject || 'all subjects';
      const notesCount = filteredNotes.length;
      
      const mockSummary = `
Summary for ${subjectText} (${notesCount} notes):

Key Topics:
• ${filteredNotes.map(note => note.title).slice(0, 3).join('\n• ')}

Main Points:
• Core concepts covered across ${notesCount} notes
• Fundamental principles and practical applications
• Important definitions and methodologies
• Key relationships between different topics

Study Recommendations:
• Review the main concepts regularly for better retention
• Create practice questions based on the key points
• Connect related topics across different notes
• Focus on understanding rather than memorization

This summary combines insights from your selected notes to help you study more effectively.
      `;
      
      setSummary(mockSummary.trim());
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Summarize Notes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject to Summarize
            </label>
            <div className="flex gap-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Subjects ({notes.length} notes)</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject} ({notes.filter(note => note.subject === subject).length} notes)
                  </option>
                ))}
              </select>
              
              <button
                onClick={generateSummary}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Notes Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Notes to Summarize ({filteredNotes.length})
            </h3>
            
            <div className="grid gap-3 max-h-40 overflow-y-auto">
              {filteredNotes.map(note => (
                <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{note.title}</span>
                    <span className="text-xs text-gray-500">{note.subject}</span>
                  </div>
                </div>
              ))}
              
              {filteredNotes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-2" />
                  <p>No notes found for the selected criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Output */}
          {(summary || isGenerating) && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Summary</h3>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 min-h-[300px]">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-gray-600">Analyzing your notes and generating summary...</p>
                    </div>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
                    {summary}
                  </pre>
                )}
              </div>
              
              {summary && !isGenerating && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => navigator.clipboard.writeText(summary)}
                    className="px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors duration-200"
                  >
                    Copy Summary
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}