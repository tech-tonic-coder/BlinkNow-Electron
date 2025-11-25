# 👁️ BlinkNow - Electron Edition

> **Stop the strain. Start the routine. Your eyes will thank you.**

A lightweight, modern desktop application designed to combat digital eye strain with timely reminders to blink and rest your eyes.

## ✨ Features

- **🔔 Native Notifications**: Uses Windows native notification system
- **💻 Modern UI**: Clean, contemporary design with light/dark theme support
- **🌗 Theme Toggle**: Switch between light and dark modes (Ctrl+T)
- **📍 System Tray**: Minimize to tray for unobtrusive operation
- **⚙️ Customizable**: Configure reminder intervals and messages
- **⌨️ Keyboard Shortcuts**: Quick controls for efficient use
- **🎈 Lightweight**: ~50-100MB RAM usage
- **🐧 Cross-Platform**: Windows and Linux support

### **✅ Compatibility**

| Operating System | Minimum Version | Notes |
| :--------------- | :-------------- | :---- |
| Windows 11       | Supported       | Full compatibility (x64 & x86) |
| Windows 10       | **10.0.17763.0** | **Required for native notifications.** (Windows 10 October 2018 Update or newer) |
| Linux            | Supported       | AppImage, deb, rpm, and pacman formats **Required the libnotify package** |

## 🚀 Quick Start

### For Users

#### Windows
- **Installer**: `BlinkNow Setup-1.0.0-x64.exe` or `BlinkNow Setup-1.0.0-ia32.exe`
- **Portable**: `BlinkNow Portable-1.0.0-x64.exe` or `BlinkNow Portable-1.0.0-ia32.exe`

Download from releases, install/run, and configure your preferences.

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

# Build for Windows (installer + portable)
npm run build:win

# Build portable only
npm run build:portable

# Build for Linux (all formats)
npm run build:linux

# Build for all platforms
npm run build:all
```
#### Linux system notification
Ensure the libnotify package is installed.

## 🎨 Design

- **Window Size**: 520x620px (fixed, non-resizable)
- **Theme**: Light and Dark mode support
- **Style**: Modern, clean interface with Bootstrap Icons
- **Animations**: Smooth transitions throughout

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Start/Stop timer |
| `Ctrl+T` | Toggle theme |
| `Ctrl+S` | Open settings |
| `Esc` | Close window |

## ⚙️ Settings

Access settings via the gear icon in the top-right corner:

- **Run on Windows startup**: Launch app automatically when Windows starts (Windows only)
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

### Windows
- **Targets**: NSIS Installer + Portable (x64 & x86)
- **Installer**: Customizable installation directory
- **Icon**: `assets/icon.ico`

### Linux
- **Targets**: AppImage, deb, rpm, pacman
- **Category**: Utility
- **Icon**: `assets/icon.png`

### Common
- **Compression**: Maximum
- **ASAR**: Enabled for better performance
- **App ID**: com.blinknow.app

## 📦 Dependencies

### Runtime
- electron: ^39.2.3
- auto-launch: ^5.0.6
- bootstrap-icons: ^1.13.1

### Development
- electron-builder: ^26.0.12

## 🔒 Security

- Context isolation enabled
- Node integration disabled
- Secure IPC communication via preload script
- No eval() or dynamic code execution

## 📊 Performance on Windows

| Metric | Value |
|--------|-------|
| Build Size | 80-120 MB |
| RAM Usage | 50-80 MB |
| CPU Usage | <1% idle |
| Startup Time | <2 seconds |

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and principles.

## 📄 License

GPL-3.0-only - See LICENSE file for details

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Windows - Notifications Not Working
- Ensure Windows notifications are enabled
- Check Focus Assist settings
- Run app as administrator (if needed)

### Linux - AppImage Won't Run
```bash
# Make executable
chmod +x BlinkNow-*.AppImage

# Run
./BlinkNow-*.AppImage
```

### Linux - Notifications Not Working
- Ensure libnotify is installed
| Linux Distribution | Installation Command |
|--------------------|----------------------|
| Debian/Ubuntu and Derivatives | sudo apt install libnotify-bin |
| Fedora and Derivatives (RHEL/CentOS) | sudo dnf install libnotify |
| Arch Linux | sudo pacman -S libnotify |

## 🔮 Future Enhancements

- [ ] Statistics tracking
- [ ] Multiple reminder profiles
- [ ] Sound notifications
- [ ] Multi-language support
- [ ] Linux support
- [ ] macOS support

## 💡 Tips

1. Use the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds
2. Blink frequently to keep eyes lubricated
3. Adjust screen brightness and position
4. Take regular breaks from screen time

---

**Made with 👁️ for healthier screen time**

**Author**: TECH-TONIC-CODER
