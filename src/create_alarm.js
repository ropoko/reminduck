const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store();

let last_id;

let form = document.getElementById('create_alarm');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let alarm = {
        id: store.get('LAST_ID') + 1,
        name: document.getElementById('alarm_name').value,
        time: document.getElementById('alarm_time').value,
        weekdays: 0
    };

    ipcRenderer.send('submitForm', alarm);
});

ipcRenderer.on('get_last_id', (event, id) => {
    console.log('last_id: ', id);
    store.set('LAST_ID', id);
})