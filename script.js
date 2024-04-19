const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");
let notes = document.querySelectorAll(".input-box");

function showNotes() {
    notesContainer.innerHTML = localStorage.getItem("notes");
}
showNotes();

function updateStorage() {
    localStorage.setItem("notes", notesContainer.innerHTML);
}

createBtn.addEventListener("click", () => {
    let inputBox = document.createElement("p");
    let img = document.createElement("img");
    inputBox.className = "input-box";
    inputBox.setAttribute("contenteditable", "true");
    img.src = "delete.png";
    notesContainer.appendChild(inputBox).appendChild(img);
    updateStorage();
});

notesContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG") {
        e.target.parentElement.remove();
        updateStorage();
    } else if (e.target.tagName === "P") {
        notes = document.querySelectorAll(".input-box");
        notes.forEach(nt => {
            nt.onkeyup = function () {
                updateStorage();
            }
        });
    }
});

const noteTextArea = document.getElementById('note-text');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
let recognition = new webkitSpeechRecognition();
let recordedSpeech = ''; // Variable to store recorded speech without repetition

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.onstart = () => {
    console.log('Speech recognition started');
};

recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
    if (transcript !== recordedSpeech) { // Check for repetition
        recordedSpeech = transcript;
        noteTextArea.value = recordedSpeech;
        updateNotesContainer(recordedSpeech); // Update notes container with the recorded speech
    }
};

function updateNotesContainer(text) {
    const existingNote = notesContainer.querySelector(".input-box");
    if (existingNote) {
        existingNote.textContent = text;
    } else {
        let inputBox = document.createElement("p");
        let img = document.createElement("img");
        inputBox.className = "input-box";
        inputBox.setAttribute("contenteditable", "true");
        inputBox.textContent = text;
        img.src = "delete.png";
        notesContainer.appendChild(inputBox).appendChild(img);
    }
    updateStorage();
}

startBtn.addEventListener('click', () => {
    recognition.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
    recognition.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        document.execCommand("insertLineBreak");
        event.preventDefault();
    }
});