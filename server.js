const express = require('express');
const path = require('path');
const gtts = require('gtts');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/Achievements', express.static(path.join(__dirname, 'Achievements')));

app.post('/generate-tts', (req, res) => {
    const { text, lang = 'en' } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        // Set mobile-friendly headers
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        const tts = new gtts(text, lang);
        const filename = `tts-${Date.now()}.mp3`;
        const filePath = path.join(__dirname, 'temp', filename);

        // Ensure temp directory exists
        const fs = require('fs');
        if (!fs.existsSync(path.join(__dirname, 'temp'))) {
            fs.mkdirSync(path.join(__dirname, 'temp'));
        }

        tts.save(filePath, (err) => {
            if (err) {
                console.error('TTS save error:', err);
                return res.status(500).json({ error: 'TTS generation failed' });
            }

            // Send file directly instead of streaming
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Send file error:', err);
                }
                // Clean up file after sending
                fs.unlink(filePath, (err) => {
                    if (err) console.error('File cleanup error:', err);
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Handle all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});