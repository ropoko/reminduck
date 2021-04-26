const { ipcRenderer } = require('electron');

const Store = require('electron-store');
const store = new Store();

function createReminder() {
    let reminder = {
        id: store.get('LAST_ID_REMINDER') == undefined ? 0 : store.get('LAST_ID_REMINDER') + 1,
        name: document.getElementById('reminder_name').value,
        time: document.getElementById('reminder_time').value,
        text: document.getElementById('reminder_text').value
    };

    ipcRenderer.send('submitForm_reminder', reminder)
}

let form = document.getElementById('create_reminder');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    createReminder();
});

ipcRenderer.on('get_last_id_reminder', (event, id_reminder) => {
    store.set('LAST_ID_REMINDER', id_reminder);
});
