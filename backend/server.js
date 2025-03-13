const express = require('express');
const path = require('path');
const gTTS = require('node-gtts');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Configure CORS
app.use(cors({
    origin: ['https://ninjacoder.vercel.app', 'http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));
app.use('/Achievements', express.static(path.join(__dirname, '../frontend/Achievements')));

app.post('/generate-tts', (req, res) => {
    const { text, lang } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const gtts = new gTTS(lang || 'en');
        const filename = `audio${Date.now()}.mp3`;
        const filePath = path.join(__dirname, filename);

        gtts.save(filePath, text, (err) => {
            if (err) {
                console.error('TTS save error:', err);
                return res.status(500).json({ error: 'TTS generation failed' });
            }

            res.download(filePath, (err) => {
                if (err) {
                    console.error('Download error:', err);
                    return res.status(500).json({ error: 'File download failed' });
                }
                // Delete the file after sending
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('File cleanup error:', unlinkErr);
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});