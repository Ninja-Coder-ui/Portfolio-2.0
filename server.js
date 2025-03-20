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
        // Set response headers for better mobile compatibility
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'no-cache');

        const tts = new gtts(text, lang);
        const filename = `tts-${Date.now()}.mp3`;
        const filePath = path.join(__dirname, filename);

        tts.save(filePath, (err) => {
            if (err) {
                console.error('TTS save error:', err);
                return res.status(500).json({ error: 'TTS generation failed' });
            }

            // Stream the file instead of downloading
            const stream = require('fs').createReadStream(filePath);
            stream.pipe(res);
            
            // Clean up file after streaming
            stream.on('end', () => {
                require('fs').unlinkSync(filePath);
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