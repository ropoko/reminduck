const { app, BrowserWindow } = require('electron');
const path = require('path');

let loading;

function createWindow() {
  const main = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js')
    }
  });

  main.loadFile('./pages/index.html');
  main.once('ready-to-show', () => {
    loading.destroy();
    main.show();
  });
}

function createLoadingScreen() {
  loading = new BrowserWindow({
    width: 800,
    height: 600,
    show: true
  });

  loading.loadFile('./pages/splash_screen.html');
  setTimeout(() => createWindow(), 3000);
}

app.whenReady().then(() => {
  createLoadingScreen();
  //createWindow();

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