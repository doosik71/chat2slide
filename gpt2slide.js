var gpt_slide_index = -1;

var gpt_voice_list = [];

// Korean: Heami, InJoon, SunHi.
// English: Aria, Ana, Christopher, Eric, Guy, Jenny, Michelle, Roger, Steffan.

const gpt_korean_regex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;

window.speechSynthesis.onvoiceschanged = function () {
    gpt_voice_list = []
    voices = speechSynthesis.getVoices();

    for (let i = 0; i < voices.length; i++) {
        gpt_voice_list.push(voices[i].name);
    }
};

function onVoiceChanged() {
    var selectedElement = document.getElementById("voiceSelect");
    var selectedText = selectedElement.options[selectedElement.selectedIndex].text;

    const match = selectedText.match(/\[(\d+)\]/);

    if (match) {
        voiceIndex = Number(match[1]);
    }
}

function start_speak(text, voice) {
    if (!('speechSynthesis' in window))
        return;

    let i = 0;
    for (; i < gpt_voice_list.length; i++) {
        if (gpt_voice_list[i].includes(voice))
            break;
    }

    if (i >= gpt_voice_list.length)
        i = 0;

    var message = new SpeechSynthesisUtterance();
    message.text = text;
    message.voice = speechSynthesis.getVoices()[i];
    message.rate = 1;
    window.speechSynthesis.speak(message);
}

function stop_speak() {
    window.speechSynthesis.cancel();
}

function add_question(text, voice) {
    if (voice === undefined) {
        voice = gpt_korean_regex.test(text) ? "InJoon" : "Christopher";
    }

    start_speak(text, voice);

    const q = document.createElement('h2');
    q.textContent = text;

    document.querySelector('main').appendChild(q);
}

function add_response(text, voice) {
    if (voice === undefined) {
        voice = gpt_korean_regex.test(text) ? "SunHi" : "Aria";
    }

    start_speak(text, voice);

    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.textContent = text;

    ul.appendChild(li);
    document.querySelector('main').appendChild(ul);
}

function speak(text, male = false) {
    if (text === null || text === undefined)
        return;

    let voice;

    if (male)
        voice = gpt_korean_regex.test(text) ? "InJoon" : "Christopher";
    else
        voice = gpt_korean_regex.test(text) ? "SunHi" : "Aria";

    stop_speak();
    start_speak(text, voice);
}

function continue_slide(event) {
    if (event.keyCode === 32) { // space key.
        if (gpt_slide_index < 0) {
            const head = document.querySelector('h1');
            speak(head.textContent);
            gpt_slide_index = 0;
        } else {
            const headings = document.querySelectorAll('h2, h3');

            if (gpt_slide_index < headings.length) {
                const head = headings[gpt_slide_index];
                head.style.display = 'block';
                speak(head.textContent, head.tagName === "H2");
                gpt_slide_index++;
            } else {
                document.removeEventListener('keydown', continue_slide)
            }
        }
    } else if (event.keyCode === 27) { // escape key.
        stop_speak();
    }
}

document.body.addEventListener('keydown', continue_slide);
