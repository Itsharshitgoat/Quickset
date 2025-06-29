const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Create the main application window
function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 450,
    frame: false,
    transparent: true,
    resizable: false,
    icon: path.join(__dirname, 'assets/clock-icon.png'), // Set clock-icon.png as the app icon
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  win.setHasShadow(true);
}

// Initialize the app
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle IPC close request
ipcMain.on('close-app', () => {
  app.quit();
});