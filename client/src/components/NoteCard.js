import React from "react";

function NoteCard({ note, onEdit, onDelete, onSummarize }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content.slice(0, 80)}{note.content.length > 80 ? "..." : ""}</p>
      <div className="note-actions">
        <button onClick={() => onEdit(note)}>Edit</button>
        <button onClick={() => onDelete(note.id)} className="danger-btn">Delete</button>
        <button onClick={() => onSummarize(note)}>Summarize</button>
      </div>
    </div>
  );
}

export default NoteCard;
