import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mockFetchNote, mockSummarizeNote } from "../api";

function NoteView() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    mockFetchNote(id).then(setNote);
  }, [id]);

  const handleSummarize = () => {
    mockSummarizeNote(note).then(setSummary);
  };

  if (!note) return <p>Loading...</p>;

  return (
    <div className="single-note-view">
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <button className="primary-btn" onClick={handleSummarize}>Summarize</button>
      <div className="summary">
        <h4>AI Generated Summary:</h4>
        <p>{summary || <i>(No summary yet)</i>}</p>
      </div>
    </div>
  );
}

export default NoteView;
