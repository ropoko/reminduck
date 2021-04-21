let form = document.getElementById('create_reminder');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let reminder = {
        name: document.getElementById('reminder_name').value,
        time: document.getElementById('reminder_time').value
    };

    console.log(reminder.name);
    console.log(reminder.time);
});