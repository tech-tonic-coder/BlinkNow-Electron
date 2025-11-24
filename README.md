# 👁️ BlinkNow - Electron Edition

> **Stop the strain. Start the routine. Your eyes will thank you.**

A lightweight, modern desktop application designed to combat digital eye strain with timely reminders to blink and rest your eyes.

## ✨ Features

- **⚡ Portable & Zero-Install**: Download and run the executable—no setup required
- **🔔 Native Notifications**: Uses Windows native notification system
- **💻 Modern UI**: Clean, contemporary design with light/dark theme support
- **🌗 Theme Toggle**: Switch between light and dark modes (Ctrl+T)
- **📍 System Tray**: Minimize to tray for unobtrusive operation
- **⚙️ Customizable**: Configure reminder intervals and messages
- **⌨️ Keyboard Shortcuts**: Quick controls for efficient use
- **🪶 Lightweight**: ~80-120MB installed, ~50-80MB RAM usage

### **✅ Compatibility**

| Operating System | Minimum Version | Notes |
| :--------------- | :-------------- | :---- |
| Windows 11       | Supported       | Full compatibility. |
| Windows 10       | **10.0.17763.0** | **Required for native notifications.** (Windows 10 October 2018 Update or newer) |

## 🚀 Quick Start

### For Users
1. Download the compatible file with your device architecture from the releases
2. Double-click to run
3. Configure your preferences and start

### For Developers

#### Prerequisites
- Node.js 20.x or later
- npm (included with Node.js)

#### Installation
```bash
# Clone or extract the project
cd BlinkNow-Electron

# Install dependencies
npm install

# Run in development
npm start

# Build portable executable
npm run build:portable

# Build installer and portable executable
npm run build:win
```

## 🎨 Design

- **Window Size**: 520x620px (fixed, non-resizable)
- **Theme**: Light and Dark mode support
- **Style**: Modern, clean interface
- **Animations**: Smooth transitions throughout

| Shortcut | Action |
|----------|--------|
| `Space` | Start/Stop timer |
| `Ctrl+T` | Toggle theme |
| `ctrl+S` | Open settings |
| `Esc` | Close window |

## ⚙️ Settings

Access settings via the gear icon in the top-right corner:

- **Run on Windows startup**: Launch app automatically when Windows starts
- **Minimize to tray on close**: Keep app running in system tray when closed
- **Minimize to tray on minimize**: Hide to tray when minimized
- **Reminder Interval**: 1-120 minutes (default: 20)
- **Custom Messages**: Personalize reminder notifications

All settings are automatically saved and persist between sessions.

## 🏗️ Architecture

The project follows clean architecture principles:

```
src/
├── main/           # Main process (Node.js)
│   ├── main.js     # Application entry point
│   ├── timer.js    # Timer service
│   ├── notification.js  # Notification service
│   └── tray.js     # System tray manager
├── renderer/       # Renderer process (UI)
│   ├── index.html  # Main HTML
│   ├── styles.css  # Styling
│   └── renderer.js # UI controller
└── preload/        # Secure bridge
    └── preload.js  # IPC bridge
```

### Design Principles
- **SOLID**: Single responsibility, clean separation
- **DRY**: No code duplication
- **KISS**: Simple, straightforward solutions
- **YAGNI**: Only necessary features

## 🛠️ Build Configuration

The project uses `electron-builder` for packaging:

- **Target**: Windows Portable (x64)
- **Compression**: Maximum
- **ASAR**: Enabled for better performance
- **Output**: `dist/BlinkNow-{version}-portable.exe`

## 📦 Dependencies

### Runtime
- electron: ^28.0.0
- auto-launch: ^5.0.6
- bootstrap-icons: ^1.11.3 (optional)

### Development
- electron-builder: ^24.9.1

## 🔒 Security

- Context isolation enabled
- Node integration disabled
- Secure IPC communication via preload script
- No eval() or dynamic code execution

## 📊 Performance

| Metric | Value |
|--------|-------|
| Build Size | 80-120 MB |
| RAM Usage | 50-80 MB |
| CPU Usage | <1% idle |
| Startup Time | <2 seconds |

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and principles.

## 📄 License

MIT License - Feel free to use and modify

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Notifications Not Working
- Ensure Windows notifications are enabled
- Check Focus Assist settings
- Run app as administrator (if needed)

## 🔮 Future Enhancements

- [ ] Statistics tracking
- [ ] Multiple reminder profiles
- [ ] Sound notifications
- [ ] Multi-language support

## 💡 Tips

1. Use the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds
2. Blink frequently to keep eyes lubricated
3. Adjust screen brightness and position
4. Take regular breaks from screen time

---

**Made with 👁️ for healthier screen time**
