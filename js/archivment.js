// Card carousel variables
var $num = $('.card-carousel .my-card').length; // Total number of cards
var $currentIndex = 0; // Current active card index

/**
 * Initialize the card carousel
 * Sets up initial positions for active, previous and next cards
 */
function initializeCards() {
    // Remove all position classes
    $('.card-carousel .my-card').removeClass('active prev next');
    // Set active card
    $('.card-carousel .my-card').eq($currentIndex).addClass('active');
    // Set previous card (handles wrap-around using modulo)
    $('.card-carousel .my-card').eq(($currentIndex - 1 + $num) % $num).addClass('prev');
    // Set next card
    $('.card-carousel .my-card').eq(($currentIndex + 1) % $num).addClass('next');
}

/**
 * Rotate cards in the carousel
 * Moves cards one position forward in the rotation
 */
function rotateCards() {
    // Update current index with wrap-around
    $currentIndex = ($currentIndex + 1) % $num;
    // Remove all position classes
    $('.card-carousel .my-card').removeClass('active prev next');
    // Set new positions
    $('.card-carousel .my-card').eq($currentIndex).addClass('active');
    $('.card-carousel .my-card').eq(($currentIndex - 1 + $num) % $num).addClass('prev');
    $('.card-carousel .my-card').eq(($currentIndex + 1) % $num).addClass('next');
}

// Initialize carousel and start auto-rotation
initializeCards();
setInterval(rotateCards, 4000); // Rotate every 4 seconds

/*******************************************
 * DISABLE RIGHT CLICK
 * Prevents context menu from appearing
 *******************************************/
document.addEventListener('contextmenu', event => event.preventDefault());

/**
 * Keyboard Navigation
 * Allows using left/right arrow keys to navigate carousel
 */
$('html body').keydown(function(e) {
    if (e.keyCode == 37) { // left arrow key
        $('.card-carousel .active').prev().trigger('click');
    }
    else if (e.keyCode == 39) { // right arrow key
        $('.card-carousel .active').next().trigger('click');
    }
});

/******************************************* TEXT TO SPEECH SECTION******************************************/

// Initialize Text-to-Speech variables
const textarea = document.querySelector("textarea"),
voiceList = document.querySelector("select"),
speechBtn = document.getElementById("convert_speech"),
clearBtn = document.getElementById("clearBtn");

// Speech synthesis setup
let synth = speechSynthesis,
isSpeaking = true,
utterance;

// Initialize available voices
voices();

/**
 * Textarea input handler
 * Shows/hides clear button based on content
 */
textarea.addEventListener("input", function () {
    if (textarea.value.length > 0) {
        // Show clear button when text exists
        clearBtn.classList.add("show");
        clearBtn.classList.remove("hide");
    } else {
        // Hide clear button when text is empty
        clearBtn.classList.add("hide");
        clearBtn.classList.remove("show");
    }
});

/**
 * Clear button handler
 * Clears textarea content and hides clear button
 */
clearBtn.addEventListener("click", e => {
    textarea.value = "";
    clearBtn.classList.add("hide");
    clearBtn.classList.remove("show");
});

/**
 * Initialize voice options
 * Populates voice selection dropdown with available voices
 */
function voices() {
    let defaultVoice = "hi-IN"; // Default to Hindi voice if available

    for (let voice of synth.getVoices()) {
        // Set selected state for Google US English or Hindi voices
        let selected = (voice.name === "Google US English" || voice.lang === "hi-IN") ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}

// Update voices when the list changes
synth.addEventListener("voiceschanged", voices);

/**
 * Text-to-Speech conversion
 * @param {string} text - The text to convert to speech
 */
function textToSpeech(text) {
    utterance = new SpeechSynthesisUtterance(text);
    // Set selected voice
    for(let voice of synth.getVoices()) {
        if(voice.name === voiceList.value) {
            utterance.voice = voice;
        }
    }
    
    // Create download request
    fetch('/api/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            lang: utterance.voice.lang.split('-')[0] // Use language code from selected voice
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.classList.remove('hide');
        downloadBtn.classList.add('show');
        
        downloadBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = 'speech.mp3';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        };
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to generate speech file. Please try again.');
    });

    synth.speak(utterance);
}

/**
 * Speech button click handler
 * Manages speech synthesis and button states
 */
speechBtn.addEventListener("click", e => {
    e.preventDefault();
    if(textarea.value !== "") {
        // Start speech if not already speaking
        if(!synth.speaking) {
            textToSpeech(textarea.value);
        }
        // Handle pause/resume for longer text
        if(textarea.value.length > 20) {
            setInterval(() => {
                if(!synth.speaking && !isSpeaking) {
                    isSpeaking = true;
                    speechBtn.innerText = "Convert To Speech";
                }
            }, 500);
            // Toggle between pause and resume
            if(isSpeaking) {
                synth.resume();
                isSpeaking = false;
                speechBtn.innerText = "Pause";
            } else {
                synth.pause();
                isSpeaking = true;
                speechBtn.innerText = "Resume";
            }
        } else {
            speechBtn.innerText = "Convert To Speech";
        }
    }
});