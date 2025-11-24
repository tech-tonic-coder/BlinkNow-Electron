class TimerService {
  constructor(onNotification, onTick) {
    this.interval = null;
    this.totalSeconds = 0;
    this.remainingSeconds = 0;
    this.message = '';
    this.isRunning = false;
    this.onNotification = onNotification;
    this.onTick = onTick;
  }

  start(intervalMinutes, message) {
    if (this.isRunning) {
      return { success: false, error: 'Timer already running' };
    }

    this.totalSeconds = intervalMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.message = message;
    this.isRunning = true;

    this.interval = setInterval(() => this.tick(), 1000);
    this.emitUpdate();

    return { success: true };
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    this.remainingSeconds = 0;
    
    return { success: true };
  }

  tick() {
    this.remainingSeconds--;
    this.emitUpdate();

    if (this.remainingSeconds <= 0) {
      this.onNotification(this.message);
      this.remainingSeconds = this.totalSeconds;
    }
  }

  emitUpdate() {
    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
    const seconds = this.remainingSeconds % 60;
    const progress = (this.remainingSeconds / this.totalSeconds) * 100;

    this.onTick({
      hours,
      minutes,
      seconds,
      progress,
      isRunning: this.isRunning,
      nextNotificationTime: new Date(Date.now() + this.remainingSeconds * 1000)
    });
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      remainingSeconds: this.remainingSeconds,
      totalSeconds: this.totalSeconds,
      message: this.message
    };
  }
}

module.exports = TimerService;