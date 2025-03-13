const express = require('express');
const path = require('path');
const gtts = require('gtts');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));
app.use('/Achievements', express.static(path.join(__dirname, '../frontend/Achievements')));
=======
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
>>>>>>> 011c1dffad2ea87b68377440b46a074837748c8f

app.post('/generate-tts', (req, res) => {
    const { text, lang } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const tts = new gtts(text, lang || 'hi');
<<<<<<< HEAD
        const filename = `audio-${Date.now()}.mp3`;
=======
        const filename = `tts-${Date.now()}.mp3`;
>>>>>>> 011c1dffad2ea87b68377440b46a074837748c8f
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

<<<<<<< HEAD
const PORT = 3000;
=======
const PORT = 5503;
>>>>>>> 011c1dffad2ea87b68377440b46a074837748c8f
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});