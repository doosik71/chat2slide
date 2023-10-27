var chat_slide_index = -1;

var chat_voice_list = [];

// Korean: Heami, InJoon, SunHi.
// English: Aria, Ana, Christopher, Eric, Guy, Jenny, Michelle, Roger, Steffan.

const chat_korean_regex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;

window.speechSynthesis.onvoiceschanged = function () {
    chat_voice_list = []
    voices = speechSynthesis.getVoices();

    for (let i = 0; i < voices.length; i++) {
        chat_voice_list.push(voices[i].name);
    }
};

function start_speak(text, voice) {
    if (!('speechSynthesis' in window))
        return;

    let i = 0;
    for (; i < chat_voice_list.length; i++) {
        if (chat_voice_list[i].includes(voice))
            break;
    }

    if (i >= chat_voice_list.length)
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

function speak(text, male = false) {
    if (text === null || text === undefined)
        return;

    let voice;

    if (male)
        voice = chat_korean_regex.test(text) ? "InJoon" : "Christopher";
    else
        voice = chat_korean_regex.test(text) ? "SunHi" : "Aria";

    stop_speak();
    start_speak(text, voice);
}

function add_question(text) {
    speak(text, true);

    const q = document.createElement('h2');
    q.textContent = text;

    document.querySelector('main').appendChild(q);
}

function add_response(text, voice) {
    speak(text, false);

    const a = document.createElement('h3');
    a.textContent = text;

    document.querySelector('main').appendChild(a);
}

function continue_slide(event) {
    if (event.keyCode === 32) { // space key.
        if (chat_slide_index < 0) {
            const head = document.querySelector('h1');
            speak(head.textContent);
            chat_slide_index = 0;
        } else {
            const headings = document.querySelectorAll('h2, h3');

            if (chat_slide_index < headings.length) {
                const head = headings[chat_slide_index];
                head.style.display = 'block';
                speak(head.textContent, head.tagName === "H2");
                chat_slide_index++;
            } else {
                document.removeEventListener('keydown', continue_slide)
            }
        }
    } else if (event.keyCode === 27) { // escape key.
        stop_speak();
    }
}

document.body.addEventListener('keydown', continue_slide);
