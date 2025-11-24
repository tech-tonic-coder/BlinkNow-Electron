const { app } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const AutoLaunch = require('auto-launch');

class SettingsService {
  constructor() {
    this.settingsPath = path.join(app.getPath('userData'), 'settings.json');
    this.autoLauncher = new AutoLaunch({
      name: 'BlinkNow',
      path: app.getPath('exe')
    });
    this.defaultSettings = {
      closeToTray: true,
      minimizeToTray: true,
      runOnStartup: false
    };
  }

  async initialize() {
    // Ensure settings file exists
    try {
      await fs.access(this.settingsPath);
    } catch {
      // File doesn't exist, create with defaults
      await this.saveAll(this.defaultSettings);
    }
  }

  async getAll() {
    try {
      const data = await fs.readFile(this.settingsPath, 'utf8');
      const settings = JSON.parse(data);
      
      // Verify auto-launch state
      const isEnabled = await this.autoLauncher.isEnabled();
      settings.runOnStartup = isEnabled;
      
      return { ...this.defaultSettings, ...settings };
    } catch (error) {
      console.error('Failed to read settings:', error);
      return this.defaultSettings;
    }
  }

  async saveAll(settings) {
    try {
      await fs.writeFile(
        this.settingsPath, 
        JSON.stringify(settings, null, 2),
        'utf8'
      );
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  async setAutoLaunch(enabled) {
    try {
      if (enabled) {
        await this.autoLauncher.enable();
      } else {
        await this.autoLauncher.disable();
      }
      return true;
    } catch (error) {
      console.error('Failed to set auto-launch:', error);
      return false;
    }
  }

  async isAutoLaunchEnabled() {
    try {
      return await this.autoLauncher.isEnabled();
    } catch (error) {
      console.error('Failed to check auto-launch status:', error);
      return false;
    }
  }
}

module.exports = SettingsService;