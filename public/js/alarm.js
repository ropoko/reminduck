const { ipcRenderer } = require('electron');

let weekdays_selected = [];

let buttons_weekdays = document.getElementsByClassName('weekdays');

for (let i = 0; i < buttons_weekdays.length; i++) {
    [buttons_weekdays].forEach(element => {
        element[i].addEventListener('click', () => {
            if (element[i].style.color == 'red') {
                element[i].style.color = 'black';
                
                let index = weekdays_selected.indexOf(element[i].value);
                weekdays_selected.splice(index, 1);
            } else {
                element[i].style.color = 'red';
                weekdays_selected.push(element[i].value);
            }
        })
    });
}

let form = document.getElementById('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let alarm = {
        name: document.getElementById('alarm_name').value.trim(),
        time: document.getElementById('alarm_time').value,
        weekdays: JSON.stringify(weekdays_selected)
    };

    ipcRenderer.send('create-alarm', alarm);
});