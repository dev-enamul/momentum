const { app, BrowserWindow, ipcMain, Menu, Tray, powerMonitor, screen, desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const { autoUpdater } = require('electron-updater');

let win;
let tray;
let apiToken = null;
let isQuitting = false;
let screenshotTimer = null;

ipcMain.on('set-token', (event, token) => {
  console.log('Received token:', token);
  apiToken = token;
});

app.on('before-quit', async (e) => {
  if (isQuitting) {
    return;
  }
  e.preventDefault();
  isQuitting = true;

  if (apiToken) {
    try {
      await endWork({ note: null });
    } catch (err) {
      // ignore error
    }
  }
  app.exit();
});

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  win = new BrowserWindow({
    width: Math.round(width * 0.6),
    height: Math.round(height * 0.8),
    title: "Momentum",
    icon: path.join(app.isPackaged ? process.resourcesPath : __dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    resizable: true
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist/index.html')}`;

  const loadUrlWithRetries = (url, retries = 20) => {
    win.loadURL(url).catch(err => {
      console.log(`Failed to load URL: ${url}. Retrying... (${retries} attempts left)`);
      if (retries > 0) {
        setTimeout(() => loadUrlWithRetries(url, retries - 1), 2000);
      } else {
        console.error('Could not connect to development server.');
      }
    });
  };

  loadUrlWithRetries(startUrl); 
 
  if (process.env.ELECTRON_START_URL) win.webContents.openDevTools();
  
  win.on('close', (e) => {
    e.preventDefault();
    win.hide();
  });
}

const loggedOutMenuTemplate = [];
const loggedInMenuTemplate = [
  { label: 'Dashboard', click: () => win.webContents.send('navigate-to', '/dashboard') },
  { label: 'Employees', click: () => win.webContents.send('navigate-to', '/employees') },
  { label: 'Projects', click: () => win.webContents.send('navigate-to', '/projects') },
  { label: 'Tasks', click: () => win.webContents.send('navigate-to', '/tasks') },
  { label: 'Reports', click: () => win.webContents.send('navigate-to', '/reports') }
];

app.whenReady().then(() => {
  createWindow();

  // Auto updater
  if (app.isPackaged) {
    autoUpdater.checkForUpdates();
  }

  autoUpdater.on('update-available', (info) => {
    win.webContents.send('update-available', info.version);
  });

  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('update-download-progress', Math.round(progress.percent));
  });

  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded');
  });

  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
  });

  const menu = Menu.buildFromTemplate(loggedOutMenuTemplate);
  Menu.setApplicationMenu(menu);

  tray = new Tray(path.join(app.isPackaged ? process.resourcesPath : __dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => win.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Momentum');
  tray.setContextMenu(contextMenu);

  powerMonitor.on('shutdown', async () => {
    if (apiToken) {
      await endWork({ note: 'System shutdown' });
    }
    app.quit();
  });

  powerMonitor.on('suspend', async () => {
    if (apiToken) {
      await endWork({ note: 'System suspended' });
      win.webContents.send('end-work-due-to-idle');
    }
  });

  const screenshotsDir = path.join(app.getPath('userData'), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);
});


app.on('window-all-closed', () => {
  // Do not quit the app, it should stay in the tray
});

ipcMain.handle('readJSON', (event, file) => {
  const filePath = path.join(__dirname, `${file}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return [];
});

ipcMain.handle('writeJSON', (event, file, data) => {
  const filePath = path.join(__dirname, `${file}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});

const API_BASE_URL = process.env.API_BASE_URL || 'https://crm.zoomdigital.net/api/';

// Start work function
async function startWork(payload) {
  console.log('startWork function called');
  try {
    await axios.post(`${API_BASE_URL}start-work`, payload, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });
    startScreenshotInterval();
  } catch (err) {
    console.error('Start work error:', err.message);
    throw err; // re-throw error to be caught in renderer
  }
}

// End work function
async function endWork(payload) {
  try {
    await axios.post(`${API_BASE_URL}end-work`, payload, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });
    stopScreenshotInterval();
  } catch (err) {
    console.error('End work error:', err.message);
    throw err; // re-throw error to be caught in renderer
  }
}

// Screenshot interval every 5-10 minutes
function scheduleNextScreenshot() {
  const minMinutes = 1;
  const maxMinutes = 2;
  const randomInterval = Math.floor(Math.random() * (maxMinutes - minMinutes + 1) + minMinutes) * 60 * 1000;
  
  console.log(`Scheduling next screenshot in ${(randomInterval / 60000).toFixed(2)} minutes.`);

  screenshotTimer = setTimeout(async () => {
    await takeScreenshot();
    scheduleNextScreenshot(); // Reschedule after taking the screenshot
  }, randomInterval);
}

function startScreenshotInterval() {
  console.log('startScreenshotInterval function called');
  scheduleNextScreenshot(); // Start the process
}

function stopScreenshotInterval() {
  console.log('stopScreenshotInterval function called');
  if (screenshotTimer) {
    clearTimeout(screenshotTimer);
    screenshotTimer = null;
  }
}

// Take and upload screenshot
async function takeScreenshot() {
  console.log('takeScreenshot function called');
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 }
    });

    if (!sources || sources.length === 0) {
      console.error('No screen sources found');
      return;
    }

    const buffer = sources[0].thumbnail.toPNG();

    const screenshotsDir = path.join(app.getPath('userData'), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);
    const filePath = path.join(screenshotsDir, `screenshot-${Date.now()}.png`);
    fs.writeFileSync(filePath, buffer);

    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));

    await axios.post(`${API_BASE_URL}work-screenshort-upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${apiToken}`
      }
    });

    console.log('Screenshot uploaded');
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Screenshot upload error:', err.message);
  }
}

ipcMain.handle('start-work', async (event, payload) => {
  console.log('IPC event start-work received with payload:', payload);
  await startWork(payload);
});

ipcMain.handle('end-work', async (event, payload) => {
  await endWork(payload);
});

ipcMain.on('resume-work', () => {
  console.log('resume-work event received');
  startScreenshotInterval();
});



ipcMain.handle('getAppPath', () => app.getAppPath());

ipcMain.on('show-window', () => win.show());

ipcMain.on('focus-window', () => {
  if (win) {
    win.focus();
  }
});

let idleInterval;

ipcMain.on('start-idle-timer', () => {
  let idleTime = 0;
  idleInterval = setInterval(async () => {
    idleTime = powerMonitor.getSystemIdleTime();
    console.log(`System idle time: ${idleTime} seconds`);
    if (idleTime >= 3600) { // 60 minutes
      if (apiToken) {
        await endWork({ note: 'Ended due to inactivity' });
      }
      win.webContents.send('end-work-due-to-idle');
      clearInterval(idleInterval);
    }
  }, 5000); // Check every 5 seconds
});

ipcMain.on('stop-idle-timer', () => {
  clearInterval(idleInterval);
});