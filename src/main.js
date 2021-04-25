const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const app_express = require('./server.js');

const Store = require('electron-store');
const store = new Store();

let mainWin;
let loading;

function serverInit() {
  app_express.listen(3000);
}

function createWindow() {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  //main.removeMenu();
  mainWin.loadURL('http://localhost:3000/');
  mainWin.once('ready-to-show', () => {
    loading.destroy();
    mainWin.show();
  });
}

function createLoadingScreen() {
  loading = new BrowserWindow({
    width: 500,
    height: 180,
    show: true,
    frame: false
  });

  setTimeout(() => {
    loading.loadURL('http://localhost:3000/splash_screen/');
    loading.show();
    createWindow();
  }, 4000)

  //setTimeout(() => createWindow(), 3000);
  //createWindow();
}

app.whenReady().then(() => {
  serverInit();
  createLoadingScreen();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

ipcMain.on('submitForm', async (event, alarm) => {
  let key = 'alarm_' + alarm.id;

  store.set(key, alarm.id);
  store.set(key + '.alarm_name', alarm.name);
  store.set(key + '.alarm_time', alarm.time);
  store.set(key + '.alarm_weekdays', alarm.weekdays);

  await mainWin.webContents.send('get_last_id', alarm.id);
});