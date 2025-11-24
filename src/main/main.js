const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const TrayManager = require('./tray');
const NotificationService = require('./notification');
const TimerService = require('./timer');
const SettingsService = require('./settings');

class Application {
  constructor() {
    this.window = null;
    this.trayManager = null;
    this.notificationService = null;
    this.timerService = null;
    this.settingsService = null;
    this.settings = {
      closeToTray: true,
      minimizeToTray: true,
      runOnStartup: false
    };
  }

  async initialize() {
    await app.whenReady();
    this.createWindow();
    await this.initializeServices();
    this.setupEventHandlers();
    this.setupIPCHandlers();
  }

  createWindow() {
    this.window = new BrowserWindow({
      width: 520,
      height: 620,
      resizable: false,
      maximizable: false,
      autoHideMenuBar: true,
      icon: path.join(__dirname, '../../assets/icon.ico'),
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    this.window.loadFile('src/renderer/index.html');

    // Handle window close
    this.window.on('close', (event) => {
      if (this.settings.closeToTray && !app.isQuitting) {
        event.preventDefault();
        this.window.hide();
      }
    });

    // Handle minimize
    this.window.on('minimize', (event) => {
      if (this.settings.minimizeToTray) {
        event.preventDefault();
        this.window.hide();
      }
    });
  }

  async initializeServices() {
    this.settingsService = new SettingsService();
    await this.settingsService.initialize();
    
    // Load saved settings
    this.settings = await this.settingsService.getAll();
    
    this.trayManager = new TrayManager(this.window);
    this.notificationService = new NotificationService();
    this.timerService = new TimerService(
      (message) => this.notificationService.show(message),
      (timeData) => this.sendToRenderer('timer-update', timeData)
    );
  }

  setupEventHandlers() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    app.on('before-quit', () => {
      app.isQuitting = true;
      this.cleanup();
    });
  }

  setupIPCHandlers() {
    ipcMain.handle('start-timer', (_, data) => {
      return this.timerService.start(data.interval, data.message);
    });

    ipcMain.handle('stop-timer', () => {
      return this.timerService.stop();
    });

    ipcMain.handle('get-timer-status', () => {
      return this.timerService.getStatus();
    });

    ipcMain.handle('update-settings', async (_, newSettings) => {
      this.settings = { ...this.settings, ...newSettings };
      
      // Handle auto-launch
      if (newSettings.hasOwnProperty('runOnStartup')) {
        await this.settingsService.setAutoLaunch(newSettings.runOnStartup);
      }
      
      // Save all settings
      await this.settingsService.saveAll(this.settings);
      
      return { success: true };
    });

    ipcMain.handle('get-settings', () => {
      return this.settings;
    });
  }

  sendToRenderer(channel, data) {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send(channel, data);
    }
  }

  cleanup() {
    if (this.timerService) {
      this.timerService.stop();
    }
    if (this.trayManager) {
      this.trayManager.destroy();
    }
  }
}

// Run application
const application = new Application();
application.initialize().catch(console.error);

// Handle unhandled errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});