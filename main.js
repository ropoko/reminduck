const { app, Menu, Tray, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const Store = require('electron-store');

let tray;
let window;

const windowConfig = {
    width: 300,
    height: 450,
    show: true,
    //frame: false,
    titleBarStyle: 'hidden', // equivalent to frame false on MAC
    //fullscreenable: false,
    //resizable: false,
    webPreferences: {
        backgroundThrottling: false,
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
    }
};

if (app.dock) app.dock.hide(); // hide app in dock on MAC

const store = new Store({
    alarms: {
        type: 'array',
        items: {
            properties: {
                name: { type: 'string' },
                time: { type: 'string' },
                weekdays: { type: 'array' }
            }
        }
    },
    reminders: {
        type: 'array',
        items: {
            properties: {
                name: { type: 'string' },
                time: { type: 'string' },
                text: { type: 'string' },
                weekdays: { type: 'array' }

            }
        }
    }
});

function getWindowPosition() {
    const windowBounds = window.getBounds();
    //console.log(windowBounds);
    const trayBounds = tray.getBounds();
    //console.log(trayBounds);

    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
    //console.log(x)

    //const y = Math.round(trayBounds.y + trayBounds.height / 4)
    const y = 190
    //console.log(y)

    return { x: x, y: y }
}

function createWindow_alarm() {
    window = new BrowserWindow(windowConfig);

    window.loadURL(`file://${path.join(__dirname, 'views/alarm.html')}`);

    const position = getWindowPosition();
    window.setPosition(position.x, position.y, false);

    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide();
        }
    });
}

function createWindow_reminder() {
    window = new BrowserWindow(windowConfig);

    window.loadURL(`file://${path.join(__dirname, 'views/reminder.html')}`);

    const position = getWindowPosition();
    window.setPosition(position.x, position.y, false);

    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide();
        }
    });
}

function render(newTray = tray) {
    let storedAlarm = [];
    let storedReminder = [];

    let items_alarms = [];
    let items_reminders = [];

    if (store.get('lastID_alarm') !== undefined) {
        for (let i = 0; i <= store.get('lastID_alarm'); i++) {
            if (store.get(`alarm_${i}`) !== undefined) {
                let alarm = store.get(`alarm_${i}`);
                alarm['weekdays'] = JSON.parse(store.get(`alarm_${i}.weekdays`));

                storedAlarm.push(alarm);
            }
        }

        items_alarms = storedAlarm.map(({ name, time, weekdays }) => ({
            label: name,
            submenu: [
                {
                    label: `time: ${time}`
                },
                {
                    label: 'weekdays',
                    submenu: weekdays.map((w) => ({
                        label: w
                    }))
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Remove', click: () => {
                        for (let i = 0; i <= store.get('lastID_alarm'); i++) {
                            if (store.get(`alarm_${i}`) !== undefined) {
                                let get_item = [store.get(`alarm_${i}`)].filter(item => item.name == name);

                                let item_name = get_item[0] !== undefined ? get_item[0].name : undefined;

                                [store.get(`alarm_${i}.name`)].every((name) => {
                                    if (item_name === undefined) return;

                                    else {
                                        if (name == item_name) {
                                            let index = i;

                                            store.delete(`alarm_${index}`);
                                            render(tray);
                                            return;
                                        };
                                    }
                                });
                            }
                        }
                    }
                }
            ]
        }));
    }

    if (store.get('lastID_reminder') !== undefined) {
        for (let i = 0; i <= store.get('lastID_reminder'); i++) {
            if (store.get(`reminder_${i}`) !== undefined) {
                let reminder = store.get(`reminder_${i}`);
                reminder['weekdays'] = JSON.parse(store.get(`reminder_${i}.weekdays`));

                storedReminder.push(reminder);
            }
        }

        items_reminders = storedReminder.map(({ name, time, text, weekdays }) => ({
            label: name,
            submenu: [
                {
                    label: `time: ${time}`
                },
                {
                    label: `text: ${text}`
                },
                {
                    label: 'weekdays',
                    submenu: weekdays.map((w) => ({
                        label: w
                    }))
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Remove', click: () => {
                        for (let i = 0; i <= store.get('lastID_reminder'); i++) {
                            if (store.get(`reminder_${i}`) !== undefined) {
                                let get_item = [store.get(`reminder_${i}`)].filter(item => item.name == name);

                                let item_name = get_item[0] !== undefined ? get_item[0].name : undefined;

                                [store.get(`reminder_${i}.name`)].every((name) => {
                                    if (item_name === undefined) return;

                                    else {
                                        if (name == item_name) {
                                            let index = i;

                                            store.delete(`reminder_${index}`);
                                            render(tray);
                                            return;
                                        };
                                    }
                                });
                            }
                        }
                    }
                }
            ]
        }));
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Alarms',
            type: 'separator'
        },
        ...items_alarms,
        {
            label: 'Reminders',
            type: 'separator'
        },
        ...items_reminders,
        {
            type: 'separator'
        },
        {
            label: 'Create Alarm', type: 'normal', click: () => {
                createWindow_alarm();
            }
        },
        {
            label: 'Create Reminder', type: 'normal', click: () => {
                createWindow_reminder();
            }
        },
        {
            label: 'Quit',
            type: 'normal',
            role: 'quit'
        }
    ]);

    newTray.setToolTip('Quack!');
    newTray.setContextMenu(contextMenu);
}

function notificationAlarm() {
    if (store.get('lastID_alarm') !== undefined) {
        for (let i = 0; i <= store.get('lastID_alarm'); i++) {
            if (store.get(`alarm_${i}`) !== undefined) {
                let alarm = store.get(`alarm_${i}`);
                alarm['weekdays'] = JSON.parse(store.get(`alarm_${i}.weekdays`));

                var d = new Date();
                let weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

                if (alarm['weekdays'].includes(weekday[d.getDay()])) {
                    let hour_alarm = new Date().setTime(alarm.time.split(':')[0]);
                    let minute_alarm = new Date().setTime(alarm.time.split(':')[1]);

                    let current_hour = new Date().getHours();
                    let current_minute = new Date().getMinutes();

                    if (current_hour == hour_alarm) {
                        if (current_minute == minute_alarm) {
                            _ = new Notification({
                                title: alarm.name,
                                urgency: 'normal',
                                sound: path.join(__dirname, 'assets/quack.mp3'),
                                icon: path.join(__dirname, 'assets/icon.png')
                            }).show();
                        }
                    }
                }
            }
        }
    }

    setTimeout(notificationAlarm, 40000);
}

function notificationReminder() {
    if (store.get('lastID_reminder') !== undefined) {
        for (let i = 0; i <= store.get('lastID_reminder'); i++) {
            if (store.get(`reminder_${i}`) !== undefined) {
                let reminder = store.get(`reminder_${i}`);
                reminder['weekdays'] = JSON.parse(store.get(`reminder_${i}.weekdays`));

                var d = new Date();
                let weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

                if (reminder['weekdays'].includes(weekday[d.getDay()])) {
                    let hour_reminder = new Date().setTime(reminder.time.split(':')[0]);
                    let minute_reminder = new Date().setTime(reminder.time.split(':')[1]);

                    let current_hour = new Date().getHours();
                    let current_minute = new Date().getMinutes();

                    if (current_hour == hour_reminder) {
                        if (current_minute == minute_reminder) {
                            _ = new Notification({
                                title: reminder.name,
                                body: reminder.text,
                                urgency: 'normal',
                                sound: path.join(__dirname, 'assets/quack.mp3'),
                                icon: path.join(__dirname, 'assets/icon.png')
                            }).show();
                        }
                    }
                }
            }
        }
    }

    setTimeout(notificationReminder, 40000);
}

app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, 'assets/iconTemplate.png'));

    render(tray);
    notificationAlarm();
    notificationReminder();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on('create-alarm', async (event, alarm) => {
    id = store.get('lastID_alarm') == undefined ? 0 : store.get('lastID_alarm') + 1;
    store.set('lastID_alarm', id);

    store.set(`alarm_${id}`, alarm);
    render(tray);
});

ipcMain.on('create-reminder', async (event, reminder) => {
    id = store.get('lastID_reminder') == undefined ? 0 : store.get('lastID_reminder') + 1;
    store.set('lastID_reminder', id);

    store.set(`reminder_${id}`, reminder);
    render(tray);
});
