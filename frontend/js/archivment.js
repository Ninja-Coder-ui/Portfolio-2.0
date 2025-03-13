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
let audioBlob = null;

// Get the base URL dynamically
const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://ninjacoder-backend.vercel.app'; // Replace with your actual backend URL

// Function to check if backend is available
async function checkBackendHealth() {
    try {
        const response = await fetch(`${baseUrl}/health`);
        return response.ok;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
    }
}

function populateVoiceList() {
    const voices = speechSynthesis.getVoices();
    voiceList.innerHTML = '';
    
    // Add default English option first
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'English (en-US)';
    defaultOption.value = 'en-US';
    voiceList.appendChild(defaultOption);

    // Add other voices
    voices.forEach((voice) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.lang;
        voiceList.appendChild(option);
    });
}

// Handle voice loading for different browsers
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
} else {
    // Fallback for browsers that don't support onvoiceschanged
    populateVoiceList();
}

// Add a timeout to ensure voices are loaded
setTimeout(populateVoiceList, 1000);

convertBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const text = textarea.value;

    if (!text) {
        alert('Please enter some text');
        return;
    }

    try {
        // Check backend health first
        const isBackendHealthy = await checkBackendHealth();
        if (!isBackendHealthy) {
            throw new Error('Backend service is not available');
        }

        const selectedLang = voiceList.value;
        const response = await fetch(`${baseUrl}/generate-tts`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({ text, lang: selectedLang })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        audioBlob = await response.blob();
        downloadBtn.classList.remove('hide');
        downloadBtn.classList.add('show');

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate audio. Please check your internet connection and try again. If the problem persists, please try again later.');
    }
});

downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!audioBlob) {
        alert('No audio available to download');
        return;
    }

    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = '';
    downloadBtn.classList.add('hide');
    downloadBtn.classList.remove('show');
});