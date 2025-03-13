const express = require('express');
const path = require('path');
const gtts = require('gtts');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Static file serving - organized by resource type
app.use(express.static(path.join(__dirname, '../frontend')));

// Asset directories
const assetPaths = {
    styles: '/css',
    scripts: '/js',
    images: '/img',
    achievements: '/Achievements'
};

// Map each asset type to its directory
Object.entries(assetPaths).forEach(([type, route]) => {
    app.use(route, express.static(path.join(__dirname, `../frontend${route}`)));
});

app.post('/generate-tts', (req, res) => {
    const { text, lang } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const tts = new gtts(text, lang || 'hi');
        const filename = `tts-${Date.now()}.mp3`;
        const filePath = path.join(__dirname, filename);

        tts.save(filePath, (err) => {
            if (err) {
                console.error('TTS save error:', err);
                return res.status(500).json({ error: 'TTS generation failed' });
            }

            res.download(filePath, (err) => {
                if (err) console.error('Download error:', err);
                require('fs').unlinkSync(filePath);
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = 5503;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});