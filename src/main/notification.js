const { Notification } = require('electron');
const path = require('path');


class NotificationService {
  constructor() {
    this.iconPath = path.join(__dirname, '../../assets/icon.ico');
  }

  show(message) {
    if (!Notification.isSupported()) {
      console.warn('Notifications are not supported on this system');
      return false;
    }

    try {
      const notification = new Notification({
        title: '👁️ Eye Care Reminder',
        body: message,
        icon: this.iconPath,
        silent: false
      });

      notification.show();
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }

  showInfo(title, message) {
    if (!Notification.isSupported()) return false;

    try {
      const notification = new Notification({
        title,
        body: message,
        icon: this.iconPath
      });

      notification.show();
      return true;
    } catch (error) {
      console.error('Failed to show info notification:', error);
      return false;
    }
  }
}

module.exports = NotificationService;