const { ipcRenderer } = require('electron');

const Store = require('electron-store');
const store = new Store();

function saveData(action, obj) {
    ipcRenderer.send(action, obj);
}

function getId(type) {
    let id = 0;

    if (type.equals('alarm')) {
        id = store.get('LAST_ID_ALARM') == undefined ? 0 : store.get('LAST_ID_ALARM') + 1
    } else {
        store.get('LAST_ID_REMINDER') == undefined ? 0 : store.get('LAST_ID_REMINDER') + 1
    }

    return id;
}

ipcRenderer.on('get_last_id_reminder', (event, id_reminder) => {
    store.set('LAST_ID_REMINDER', id_reminder);
});

ipcRenderer.on('get_last_id_alarm', (event, id_alarm) => {
    store.set('LAST_ID_ALARM', id_alarm);
});

module.exports = { saveData, getId }