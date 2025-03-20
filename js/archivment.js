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
const supportedLanguages = [
    { code: 'en-US', name: 'English (United States)' },
    { code: 'en-GB', name: 'English (United Kingdom)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'it-IT', name: 'Italian' }
];

// Populate language list
function loadLanguages() {
    voiceList.innerHTML = '<option value="">Select a language</option>';
    supportedLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        voiceList.appendChild(option);
    });
}

// Initialize languages when page loads
window.addEventListener('load', loadLanguages);

convertBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const text = textarea.value;
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
        // Use your backend API endpoint
        const response = await fetch('/api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text, 
                lang: selectedLang 
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate audio');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Show download button
        downloadBtn.classList.remove('hide');
        
        // Play audio
        audio.play().catch(error => {
            console.error('Audio playback failed:', error);
            alert('Audio playback failed. You can still download the audio file.');
        });

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate audio. Please try again.');
    }
});

clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    textarea.value = '';
    downloadBtn.classList.add('hide');
});

downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const text = textarea.value;
    const selectedLang = voiceList.value;

    if (!text || !selectedLang) {
        alert('Please enter text and select a language first');
        return;
    }

    try {
        fetch('/api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text, 
                lang: selectedLang,
                download: true 
            })
        })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `speech-${selectedLang}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download audio file');
    }
});