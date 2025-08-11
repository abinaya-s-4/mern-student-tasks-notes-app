import React, { useState, useEffect } from "react";

function NoteForm({ initial, loading, error, onSave }) {
  const [form, setForm] = useState(initial || { title: "", content: "" });
  useEffect(() => { if (initial) setForm(initial); }, [initial]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onSave(form.title, form.content);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{initial ? "Edit Note" : "Add Note"}</h2>
      <input name="title" placeholder="Note title" value={form.title} onChange={handleChange} required />
      <textarea name="content" placeholder="Note content" rows={5} value={form.content} onChange={handleChange} required />
      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? "Saving..." : (initial ? "Update" : "Add Note")}
      </button>
      {error && <span className="error">{error}</span>}
    </form>
  );
}

export default NoteForm;
