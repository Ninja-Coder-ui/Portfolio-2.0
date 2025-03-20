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

function populateVoiceList() {
    const voices = speechSynthesis.getVoices();
    voiceList.innerHTML = '';
    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.lang;
        voiceList.appendChild(option);
    });
}

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

convertBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const text = textarea.value;

    if (!text) {
        alert('Please enter some text');
        return;
    }

    try {
        const selectedLang = voiceList.value;
        const response = await fetch('http://localhost:3000/generate-tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang: selectedLang })
        });

        if (!response.ok) {
            const fallbackResponse = await fetch('http://localhost:3000/generate-tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, lang: 'en' })
            });

            if (!fallbackResponse.ok) throw new Error('TTS generation failed');

            audioBlob = await fallbackResponse.blob();
        } else {
            audioBlob = await response.blob();
        }

        downloadBtn.classList.remove('hide');
        downloadBtn.classList.add('show');

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate audio');
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
    a.download = 'tts-audio.mp3';
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