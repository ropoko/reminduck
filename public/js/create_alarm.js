const { createAlarm } = require('./index');

let form = document.getElementById('create_alarm');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    createAlarm();
});
