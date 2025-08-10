const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware');

// CREATE note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ user: req.user, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ all notes for this user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user });
    res.json(notes);
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
