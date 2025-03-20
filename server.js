const express = require('express');
const gtts = require('node-gtts');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('.')); // Serve static files from root directory

// TTS endpoint
app.post('/api/tts', (req, res) => {
    const { text, lang = 'en' } = req.body;
    
    // Create temporary file path
    const tempFile = path.join('temp', `speech-${Date.now()}.mp3`);
    
    // Ensure temp directory exists
    if (!fs.existsSync('temp')) {
        fs.mkdirSync('temp');
    }
    
    // Initialize TTS with specified language
    const tts = gtts(lang);
    
    // Create MP3 file
    tts.save(tempFile, text, () => {
        // Send file to client
        res.download(tempFile, 'speech.mp3', (err) => {
            // Delete temporary file after sending
            fs.unlink(tempFile, (deleteErr) => {
                if (deleteErr) console.error('Error deleting temp file:', deleteErr);
            });
            
            if (err) console.error('Error sending file:', err);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 