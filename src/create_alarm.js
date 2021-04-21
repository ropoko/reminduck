let form = document.getElementById('create_alarm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let alarm = {
        name: document.getElementById('alarm_name').value,
        time: document.getElementById('alarm_time').value
    };

    console.log(alarm.name);
    console.log(alarm.time);
});