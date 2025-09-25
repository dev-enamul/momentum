const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readJSON: (file) => ipcRenderer.invoke('readJSON', file),
  writeJSON: (file, data) => ipcRenderer.invoke('writeJSON', file, data),
  saveScreenshot: (base64) => ipcRenderer.invoke('saveScreenshot', base64),
  getAppPath: () => ipcRenderer.invoke('getAppPath'),
  onToggleWork: (callback) => ipcRenderer.on('toggle-work', callback),
  showWindow: () => ipcRenderer.send('show-window'),
  onNavigate: (callback) => ipcRenderer.on('navigate-to', callback),
  setLoginState: (loggedIn) => ipcRenderer.send('set-login-state', loggedIn),
  focusWindow: () => ipcRenderer.send('focus-window'),
  sendToken: (token) => ipcRenderer.send('set-token', token),
  
  startWork: (payload) => ipcRenderer.invoke('start-work', payload),
  endWork: (payload) => ipcRenderer.invoke('end-work', payload),
  resumeWork: () => ipcRenderer.send('resume-work'),

  onEndWorkDueToIdle: (callback) => ipcRenderer.on('end-work-due-to-idle', callback),
  startIdleTimer: () => ipcRenderer.send('start-idle-timer'),
  stopIdleTimer: () => ipcRenderer.send('stop-idle-timer'),
});