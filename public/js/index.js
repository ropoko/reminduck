const { saveData, getId } = require('../../src/services/save_data');

function createAlarm() {
    let alarm = {
        id: getId('alarm'),
        name: document.getElementById('alarm_name').value,
        time: document.getElementById('alarm_time').value,
        weekdays: 0
    };

    saveData('save_alarm', alarm);
}

function createReminder() {
    let reminder = {
        id: getId('reminder'),
        name: document.getElementById('reminder_name').value,
        time: document.getElementById('reminder_time').value,
        text: document.getElementById('reminder_text').value
    };

    saveData('save_reminder', reminder);
}

module.exports = { createAlarm, createReminder }