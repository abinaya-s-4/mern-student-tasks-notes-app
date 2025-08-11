import React, { useEffect, useState, useRef } from "react";
import NoteCard from "../components/NoteCard";
import { mockFetchNotes, mockDeleteNote, mockSummarizeNote } from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summaries, setSummaries] = useState({});
  const navigate = useNavigate();
  const summaryRefs = useRef({});

  useEffect(() => {
    mockFetchNotes()
      .then(data => { setNotes(data); setLoading(false); })
      .catch(() => { setError("Failed to load notes."); setLoading(false); });
  }, []);

  const handleEdit = note => navigate(`/edit/${note.id}`);
  const handleDelete = id => {
    mockDeleteNote(id)
      .then(() => setNotes(notes.filter(n => n.id !== id)))
      .catch(() => setError("Failed to delete note."));
  };

  const handleSummarize = note => {
    mockSummarizeNote(note).then(summary => {
      setSummaries(prev => ({ ...prev, [note.id]: summary }));
      setTimeout(() => {
        summaryRefs.current[note.id]?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
  };

  return (
    <main>
      <h2>Your Notes & Tasks</h2>
      {loading && <p>Loading your notes...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && notes.length === 0 && <p>No notes yet. Start by adding a new note!</p>}

      <div className="notes-grid">
        {notes.map(note => (
          <div key={note.id}>
            <NoteCard note={note} onEdit={handleEdit} onDelete={handleDelete} onSummarize={handleSummarize} />
            {summaries[note.id] && (
              <div className="summary" ref={el => summaryRefs.current[note.id] = el}>
                <strong>AI Summary:</strong>
                <p>{summaries[note.id]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;



