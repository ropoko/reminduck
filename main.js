const { app, Menu, Tray, BrowserWindow, ipcMain } = require('electron');
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

if (app.dock) {
    app.dock.hide(); // hide app in dock on MAC
}

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
    //window.webContents.openDevTools();

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
    //window.webContents.openDevTools();

    const position = getWindowPosition();
    window.setPosition(position.x, position.y, false);

    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide();
        }
    });
}

function render(newTray = tray) {
    const storedAlarms = store.get('alarms');
    const storedReminders = store.get('reminders');

    const alarms = storedAlarms ? JSON.parse(storedAlarms) : [];
    const reminders = storedReminders ? JSON.parse(storedReminders) : [];

    const items_alarms = alarms.map(({ name, time, weekdays }) => ({
        label: name,
        submenu: [
            {
                label: `time: ${time}`
            },
            {
                label: `weekdays: ${weekdays}`
            }
        ]
    }));

    const items_reminders = reminders.map(({ name, time, text, weekdays }) => ({
        label: name,
        submenu: [
            {
                label: `time: ${time}`
            },
            {
                label: 'text', click: () => {
                    console.log('my_text_reminder', text);
                }
            },
            {
                label: `weekdays: ${weekdays}`
            }
        ]
    }));

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

app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, 'assets/iconTemplate.png'));

    render(tray);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on('create-alarm', async (event, alarm) => {
    console.log(alarm);
});

ipcMain.on('create-reminder', async (event, reminder) => {
    console.log(reminder);
});