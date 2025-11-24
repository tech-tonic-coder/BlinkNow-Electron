class UIController {
  constructor() {
    this.elements = this.initializeElements();
    this.state = {
      isRunning: false,
      currentTheme: "light",
      settings: {
        runOnStartup: false,
        closeToTray: true,
        minimizeToTray: true,
      },
    };
    this.timerUnsubscribe = null;
  }

  initializeElements() {
    return {
      formView: document.getElementById("formView"),
      timerView: document.getElementById("timerView"),
      intervalInput: document.getElementById("intervalInput"),
      messageInput: document.getElementById("messageInput"),
      startBtn: document.getElementById("startBtn"),
      stopBtn: document.getElementById("stopBtn"),
      themeToggle: document.getElementById("themeToggle"),
      settingsBtn: document.getElementById("settingsBtn"),
      settingsModal: document.getElementById("settingsModal"),
      closeSettings: document.getElementById("closeSettings"),
      timerText: document.getElementById("timerText"),
      progressCircle: document.getElementById("progressCircle"),
      nextNotificationText: document.getElementById("nextNotificationText"),
      errorToast: document.getElementById("errorToast"),
      errorMessage: document.getElementById("errorMessage"),
      runOnStartup: document.getElementById("runOnStartup"),
      closeToTray: document.getElementById("closeToTray"),
      minimizeToTray: document.getElementById("minimizeToTray"),
    };
  }

  async initialize() {
    this.setupEventListeners();
    this.initializeTheme();
    await this.loadSettings();
    this.subscribeToTimerUpdates();
  }

  setupEventListeners() {
    // Timer controls
    this.elements.startBtn.addEventListener("click", () => this.startTimer());
    this.elements.stopBtn.addEventListener("click", () => this.stopTimer());

    // Theme toggle
    this.elements.themeToggle.addEventListener("click", () =>
      this.toggleTheme()
    );

    // Settings modal
    this.elements.settingsBtn.addEventListener("click", () =>
      this.openSettings()
    );
    this.elements.closeSettings.addEventListener("click", () =>
      this.closeSettings()
    );
    this.elements.settingsModal.addEventListener("click", (e) => {
      if (e.target === this.elements.settingsModal) {
        this.closeSettings();
      }
    });

    // Toggle switches
    this.elements.runOnStartup.addEventListener("click", () =>
      this.toggleSetting("runOnStartup")
    );
    this.elements.closeToTray.addEventListener("click", () =>
      this.toggleSetting("closeToTray")
    );
    this.elements.minimizeToTray.addEventListener("click", () =>
      this.toggleSetting("minimizeToTray")
    );

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  handleKeyboard(e) {
    // Don't handle shortcuts when modal is open
    if (this.elements.settingsModal.style.display === "flex") {
      if (e.key === "Escape") {
        this.closeSettings();
      }
      return;
    }

    if (e.key === "Escape") {
      window.close();
    } else if (e.key === " " && !this.isInputFocused()) {
      e.preventDefault();
      this.toggleTimer();
    } else if (e.ctrlKey && e.key === "t") {
      e.preventDefault();
      this.toggleTheme();
    } else if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      this.openSettings()
    }
  }

  isInputFocused() {
    const active = document.activeElement;
    return active.tagName === "INPUT" || active.tagName === "TEXTAREA";
  }

  // Theme Management
  initializeTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    this.applyTheme(savedTheme);
  }

  toggleTheme() {
    const newTheme = this.state.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    this.state.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.updateThemeIcon(theme);
  }

  updateThemeIcon(theme) {
    const icon = this.elements.themeToggle.querySelector(".icon");
    if (theme === "dark") {
      icon.innerHTML =
        '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    } else {
      icon.innerHTML =
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  }

  // Settings Management
  openSettings() {
    this.elements.settingsModal.style.display = "flex";
  }

  closeSettings() {
    this.elements.settingsModal.style.display = "none";
  }

  async loadSettings() {
    try {
      const settings = await window.api.getSettings();
      this.state.settings = settings;
      this.updateToggleStates();
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }

  updateToggleStates() {
    this.updateToggle("runOnStartup", this.state.settings.runOnStartup);
    this.updateToggle("closeToTray", this.state.settings.closeToTray);
    this.updateToggle("minimizeToTray", this.state.settings.minimizeToTray);
  }

  updateToggle(name, active) {
    const toggle = this.elements[name];
    if (active) {
      toggle.classList.add("active");
    } else {
      toggle.classList.remove("active");
    }
  }

  async toggleSetting(name) {
    this.state.settings[name] = !this.state.settings[name];
    this.updateToggle(name, this.state.settings[name]);

    try {
      await window.api.updateSettings(this.state.settings);
    } catch (error) {
      this.showError("Failed to update settings");
      // Revert on error
      this.state.settings[name] = !this.state.settings[name];
      this.updateToggle(name, this.state.settings[name]);
    }
  }

  // Timer Management
  async startTimer() {
    if (!this.validateInput()) return;

    const interval = parseInt(this.elements.intervalInput.value);
    const message = this.elements.messageInput.value.trim();

    try {
      const result = await window.api.startTimer(interval, message);
      if (result.success) {
        this.state.isRunning = true;
        this.showTimerView();
      }
    } catch (error) {
      this.showError("Failed to start timer");
    }
  }

  async stopTimer() {
    try {
      await window.api.stopTimer();
      this.state.isRunning = false;
      this.showFormView();
    } catch (error) {
      this.showError("Failed to stop timer");
    }
  }

  toggleTimer() {
    if (this.state.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  validateInput() {
    const interval = parseInt(this.elements.intervalInput.value);
    const message = this.elements.messageInput.value.trim();

    if (isNaN(interval) || interval < 1 || interval > 120) {
      this.showError("Please enter a valid interval between 1 and 120 minutes");
      return false;
    }

    if (!message) {
      this.showError("Please enter a reminder message");
      return false;
    }

    return true;
  }

  // Timer Updates
  subscribeToTimerUpdates() {
    this.timerUnsubscribe = window.api.onTimerUpdate((data) => {
      this.updateTimerDisplay(data);
    });
  }

  updateTimerDisplay(data) {
    const { hours, minutes, seconds, progress } = data;

    // Update time display
    if (hours > 0) {
      this.elements.timerText.textContent = `${String(hours).padStart(
        2,
        "0"
      )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
      this.elements.timerText.style.fontSize = "40px";
    } else {
      this.elements.timerText.textContent = `${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
      this.elements.timerText.style.fontSize = "52px";
    }

    // Update progress ring
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (progress / 100) * circumference;
    this.elements.progressCircle.style.strokeDashoffset = offset;

    // Update next notification time
    if (data.nextNotificationTime) {
      const time = new Date(data.nextNotificationTime);
      this.elements.nextNotificationText.textContent = `Next reminder: ${time.toLocaleTimeString()}`;
    }
  }

  // View Management
  showFormView() {
    this.elements.formView.style.display = "block";
    this.elements.timerView.style.display = "none";
  }

  showTimerView() {
    this.elements.formView.style.display = "none";
    this.elements.timerView.style.display = "block";
  }

  // Error Handling
  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorToast.classList.add("show");

    setTimeout(() => {
      this.elements.errorToast.classList.remove("show");
    }, 3000);
  }

  destroy() {
    if (this.timerUnsubscribe) {
      this.timerUnsubscribe();
    }
  }
}

// Initialize application
const app = new UIController();
app.initialize().catch(console.error);

// Cleanup on unload
window.addEventListener("beforeunload", () => {
  app.destroy();
});
