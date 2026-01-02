# Quick Start Guide

## ✅ How to Run from Cursor IDE

### Option 1: Press F5 (Recommended)
1. Press `F5` key
2. Select "🚀 Run App in Chrome" from the dropdown (if asked)
3. Chrome will open automatically with your app!

### Option 2: Using Run Menu
1. Click on Run menu → "Start Debugging" (F5)
2. Or click the Run icon in sidebar (Cmd+Shift+D)
3. Select "🚀 Run App in Chrome"
4. Click the green play button ▶️

### Option 3: Manual Terminal
```bash
cd /Users/shubham/Projects/chat-flow
python3 -m http.server 8080
```
Then open: http://localhost:8080

### Option 4: Using Script
```bash
./start.sh
```

## 🛑 How to Stop

- Click the red stop button in Cursor
- Or press `Shift+F5`
- Or press `Ctrl+C` in terminal

## 🔍 Troubleshooting

### If F5 doesn't work:
1. Make sure you have Python 3 installed:
   ```bash
   python3 --version
   ```

2. Check if port 8080 is already in use:
   ```bash
   lsof -ti:8080
   ```

3. Kill any process on port 8080:
   ```bash
   kill $(lsof -ti:8080)
   ```

### Alternative: Open File Directly
- In Cursor, select "Open File Directly" from Run configurations
- This opens the HTML file directly (may have CORS limitations with ZIP files)

## 📝 What Should Happen

When you press F5:
1. Terminal opens showing: "Serving HTTP on 0.0.0.0 port 8080"
2. Chrome opens automatically
3. You see the WhatsApp Chat to PDF converter interface
4. Drag a ZIP file to convert

## ✨ Ready to Use!

Press F5 now and it should work! 🎉

