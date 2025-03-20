var $num = $('.card-carousel .my-card').length;
var $currentIndex = 0;

function initializeCards() {
    $('.card-carousel .my-card').removeClass('active prev next');
    $('.card-carousel .my-card').eq($currentIndex).addClass('active');
    $('.card-carousel .my-card').eq(($currentIndex - 1 + $num) % $num).addClass('prev');
    $('.card-carousel .my-card').eq(($currentIndex + 1) % $num).addClass('next');
}

function rotateCards() {
    $currentIndex = ($currentIndex + 1) % $num;
    $('.card-carousel .my-card').removeClass('active prev next');
    $('.card-carousel .my-card').eq($currentIndex).addClass('active');
    $('.card-carousel .my-card').eq(($currentIndex - 1 + $num) % $num).addClass('prev');
    $('.card-carousel .my-card').eq(($currentIndex + 1) % $num).addClass('next');
}

initializeCards();
setInterval(rotateCards, 4000);


/*******************************************DISABLE RIGHT CLICK*******************************************/

    document.addEventListener('contextmenu', event => event.preventDefault());


    // Keyboard nav
    $('html body').keydown(function(e) {
        if (e.keyCode == 37) { // left
            $('.card-carousel .active').prev().trigger('click');
        }
        else if (e.keyCode == 39) { // right
            $('.card-carousel .active').next().trigger('click');
        }
    });

/******************************************TTS SECTION***************************************/

const textarea = document.getElementById('ttsText');
const voiceList = document.getElementById('voiceList');
const convertBtn = document.getElementById('convert_speech');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Define supported languages
const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
];

// Initialize language dropdown
function initializeLanguages() {
    voiceList.innerHTML = '<option value="">Select Language</option>';
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        voiceList.appendChild(option);
    });
}

// Add download button functionality
downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    const selectedLang = voiceList.value;

    if (!text || !selectedLang) {
        alert('Please enter text and select a language first');
        return;
    }

    try {
        // Show loading state
        downloadBtn.textContent = 'Preparing Download...';
        downloadBtn.disabled = true;

        const response = await fetch('/generate-tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({ 
                text, 
                lang: selectedLang 
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate audio');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Create temporary link for download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `speech-${selectedLang}-${Date.now()}.mp3`;
        
        // Add to document, click and remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Cleanup
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download audio. Please try again.');
    } finally {
        // Reset button state
        downloadBtn.textContent = 'Download Audio';
        downloadBtn.disabled = false;
    }
});

// Update the convert function to properly show download button
async function convertToSpeech() {
    const text = textarea.value.trim();
    const selectedLang = voiceList.value;

    if (!text) {
        alert('Please enter some text');
        return;
    }

    if (!selectedLang) {
        alert('Please select a language');
        return;
    }

    try {
        convertBtn.disabled = true;
        convertBtn.textContent = 'Converting...';

        const response = await fetch('/generate-tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({ 
                text, 
                lang: selectedLang 
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate audio');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        // Play audio
        await audio.play();
        
        // Show download button
        downloadBtn.classList.remove('hide');
        downloadBtn.style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate audio. Please try again.');
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert To Speech';
    }
}

// Update clear function to properly hide download button
function clearText() {
    textarea.value = '';
    downloadBtn.classList.add('hide');
    downloadBtn.style.display = 'none';
}

// Initialize event listeners
window.addEventListener('load', initializeLanguages);
convertBtn.addEventListener('click', convertToSpeech);
clearBtn.addEventListener('click', clearText);

// Mobile-specific adjustments
if (/Mobi|Android/i.test(navigator.userAgent)) {
    // Prevent zoom on focus
    textarea.style.fontSize = '16px';
    voiceList.style.fontSize = '16px';
    
    // Add touch event handling
    convertBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        convertToSpeech();
    });
    
    clearBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        clearText();
    });
}