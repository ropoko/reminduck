const { ipcRenderer } = require('electron');

let form = document.getElementById('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let reminder = {
        name: document.getElementById('reminder_name').value,
        time: document.getElementById('reminder_time').value,
        text: document.getElementById('reminder_text').value
    }

    ipcRenderer.send('create-reminder', reminder);
});