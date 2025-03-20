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

// Convert text to speech
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

    // Show loading state
    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';

    try {
        const response = await fetch('/generate-tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang: selectedLang })
        });

        if (!response.ok) {
            throw new Error('Failed to generate audio');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create and play audio
        const audio = new Audio(audioUrl);
        
        // Show download button
        downloadBtn.classList.remove('hide');
        
        // Play audio
        await audio.play();
        
        // Enable download
        const downloadLink = document.createElement('a');
        downloadLink.href = audioUrl;
        downloadLink.download = `speech-${selectedLang}.mp3`;
        downloadLink.click();

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate audio. Please try again.');
    } finally {
        // Reset button state
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert To Speech';
    }
}

// Clear text function
function clearText() {
    textarea.value = '';
    downloadBtn.classList.add('hide');
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