const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  subject: { type: String },
  summary: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
