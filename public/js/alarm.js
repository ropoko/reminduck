const { ipcRenderer } = require('electron');

const Store = require('electron-store');
const store = new Store();

function createAlarm() {
    let alarm = {
        id: store.get('LAST_ID_ALARM') == undefined ? 0 : store.get('LAST_ID_ALARM') + 1,
        name: document.getElementById('alarm_name').value,
        time: document.getElementById('alarm_time').value,
        weekdays: 0
    };

    ipcRenderer.send('submitForm_alarm', alarm);    
}

let form = document.getElementById('create_alarm');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    createAlarm();
});

ipcRenderer.on('get_last_id_alarm', (event, id_alarm) => {
    store.set('LAST_ID_ALARM', id_alarm);
});
