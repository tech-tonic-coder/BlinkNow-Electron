const { Tray, Menu, app } = require('electron');
const path = require('path');

class TrayManager {
  constructor(window) {
    this.window = window;
    this.tray = null;
    this.initialize();
  }

  initialize() {
    const iconPath = path.join(__dirname, '../../assets/icon.ico');
    this.tray = new Tray(iconPath);
    this.tray.setToolTip('BlinkNow - Eye Care Reminder');
    
    this.buildMenu();
    this.setupEventHandlers();
  }

  buildMenu() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Window',
        click: () => this.showWindow()
      },
      { type: 'separator' },
      {
        label: 'About',
        click: () => this.showAbout()
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => this.quit()
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  setupEventHandlers() {
    this.tray.on('double-click', () => {
      this.showWindow();
    });
  }

  showWindow() {
    if (this.window) {
      this.window.show();
      this.window.focus();
    }
  }

  showAbout() {
    const { dialog } = require('electron');
    dialog.showMessageBox({
      type: 'info',
      title: 'About BlinkNow',
      message: 'BlinkNow v1.0.0',
      detail: 'Eye care reminder application\nHelps reduce eye strain during screen time',
      buttons: ['OK']
    });
  }

  quit() {
    app.isQuitting = true;
    app.quit();
  }

  destroy() {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}

module.exports = TrayManager;