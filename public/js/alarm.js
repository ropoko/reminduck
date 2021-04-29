const { ipcRenderer } = require('electron');

let form = document.getElementById('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let alarm = {
        name: document.getElementById('alarm_name').value,
        time: document.getElementById('alarm_time').value
    };

    ipcRenderer.send('create-alarm', alarm);
})