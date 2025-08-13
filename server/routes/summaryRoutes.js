// routes/summaryRoutes.js
const express = require('express');
const fetch = require('node-fetch');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'No text to summarize' });

    const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
    const HF_TOKEN = process.env.HF_API_KEY;
    if (!HF_TOKEN) {
      return res.status(500).json({ message: 'HF_API_KEY not set in backend .env' });
    }

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Hugging Face API error:', response.status, errText);
      return res.status(500).json({ message: 'Hugging Face API error', details: errText });
    }

    const data = await response.json();
    const summary = data[0]?.summary_text?.trim() || '';
    if (!summary) {
      return res.status(500).json({ message: 'No summary generated' });
    }

    res.json({ summary });
  } catch (err) {
    console.error('Summary API error:', err);
    res.status(500).json({ message: 'Failed to generate summary' });
  }
});

module.exports = router;
