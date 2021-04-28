const createReminder = require('./../../public/js/index');

let form = document.getElementById('create_reminder');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    createReminder();
});
