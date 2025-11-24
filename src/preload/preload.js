const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Timer operations
  startTimer: (interval, message) => 
    ipcRenderer.invoke('start-timer', { interval, message }),
  
  stopTimer: () => 
    ipcRenderer.invoke('stop-timer'),
  
  getTimerStatus: () => 
    ipcRenderer.invoke('get-timer-status'),
  
  // Settings operations
  updateSettings: (settings) => 
    ipcRenderer.invoke('update-settings', settings),
  
  getSettings: () => 
    ipcRenderer.invoke('get-settings'),
  
  // Event listeners
  onTimerUpdate: (callback) => {
    const subscription = (_, data) => callback(data);
    ipcRenderer.on('timer-update', subscription);
    
    // Return unsubscribe function
    return () => ipcRenderer.removeListener('timer-update', subscription);
  }
});