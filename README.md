# WhatsApp Chat to PDF Converter

<div align="center">

![WhatsApp Chat to PDF](https://img.shields.io/badge/WhatsApp-Chat%20to%20PDF-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Transform your WhatsApp chat exports into beautiful, screenshot-like PDF documents** 📱✨

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing)

</div>

---

## 🌟 Features

- 📱 **Authentic WhatsApp UI** - PDFs that look exactly like real WhatsApp screenshots
- 🖼️ **Image Support** - Automatically includes all images from your chat exports
- 🎨 **Beautiful Design** - Modern, responsive interface with smooth animations
- 🔒 **100% Private** - All processing happens locally in your browser - no data ever leaves your device
- 🚀 **Zero Installation** - Just open the HTML file and start converting
- 💨 **Fast & Efficient** - Handles large chat histories with ease
- 🌈 **Smart Parser** - Supports multiple WhatsApp export formats
- 📄 **Professional Output** - High-quality PDF generation with proper formatting

## 🎥 Demo

<div align="center">
<img src="https://via.placeholder.com/800x500/25D366/ffffff?text=WhatsApp+Chat+to+PDF+Converter" alt="Demo Screenshot" width="800"/>
</div>

## 🚀 Quick Start

### Option 1: Direct Use (No Installation)

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Drop your WhatsApp chat ZIP file
4. Click "Generate PDF"
5. Done! 🎉

### Option 2: Run with Server

```bash
# Clone the repository
git clone https://github.com/shubhamsinghal06/whatsapp-chat-to-pdf.git
cd whatsapp-chat-to-pdf

# Start the server
python3 -m http.server 8080

# Open http://localhost:8080 in your browser
```

### Option 3: Quick Start Script

```bash
# On macOS/Linux
./start.sh

# On Windows
start.bat
```

## 📖 Usage

### Step 1: Export Your WhatsApp Chat

1. Open WhatsApp on your phone
2. Go to the chat you want to export
3. Tap the menu (⋮) → **More** → **Export chat**
4. Choose **Include Media** or **Without Media**
5. Save the ZIP file to your computer

### Step 2: Convert to PDF

1. Open the converter in your browser
2. Drag and drop the ZIP file (or click to browse)
3. Preview the first 50 messages
4. Click **Generate PDF**
5. Download your PDF! 📄

## 💻 Development

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (optional, for local server)

### Run in Development Mode

```bash
# Using Python
python3 server.py

# Or use the built-in server
python3 -m http.server 8080
```

### VS Code / Cursor IDE

Press `F5` to run with automatic server startup and Chrome launch.

## 🛠️ Technologies Used

- **HTML5/CSS3** - Modern, responsive UI
- **Vanilla JavaScript** - No framework dependencies
- **JSZip** - ZIP file parsing
- **html2pdf.js** - PDF generation
- **Python HTTP Server** - Simple local development server

## 📦 Project Structure

```
whatsapp-chat-to-pdf/
├── index.html              # Main application file
├── server.py               # Development server
├── start.sh                # Quick start script (Unix)
├── start.bat               # Quick start script (Windows)
├── README.md               # This file
├── QUICKSTART.md           # Quick start guide
├── LICENSE                 # MIT License
└── .vscode/
    ├── launch.json         # VS Code launch configuration
    └── tasks.json          # VS Code tasks
```

## 🎨 Features in Detail

### Smart Chat Parser

Automatically detects and parses multiple WhatsApp export formats:
- `[DD/MM/YY, HH:MM:SS] Sender: Message`
- `DD/MM/YY, HH:MM - Sender: Message`
- `M/D/YY, H:MM AM/PM - Sender: Message`

### Image Handling

Supports all common image formats:
- JPG/JPEG
- PNG
- GIF
- WebP

### Privacy & Security

- ✅ All processing happens in your browser
- ✅ No data sent to any server
- ✅ No tracking or analytics
- ✅ Works completely offline (after initial page load)

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full Support |
| Firefox | ✅ Full Support |
| Safari  | ✅ Full Support |
| Edge    | ✅ Full Support |
| Opera   | ✅ Full Support |

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- 🎨 Custom color themes (Dark mode, custom colors)
- 📅 Date range filtering
- 🔍 Search functionality within chats
- 📊 Chat statistics and analytics
- 🌍 Internationalization support
- 📱 Mobile-responsive improvements

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WhatsApp for the chat export feature
- [JSZip](https://stuk.github.io/jszip/) for ZIP file handling
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for PDF generation

## 📧 Contact

**Shubham Singhal** - [@shubhamsinghal06](https://github.com/shubhamsinghal06)

Project Link: [https://github.com/shubhamsinghal06/whatsapp-chat-to-pdf](https://github.com/shubhamsinghal06/whatsapp-chat-to-pdf)

## ⭐ Show Your Support

If you find this project useful, please give it a star! ⭐

---

<div align="center">
Made with ❤️ for preserving your WhatsApp memories
</div>
