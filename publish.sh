#!/bin/bash

echo "=================================================="
echo "📦 Publishing WhatsApp Chat to PDF to GitHub"
echo "=================================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "🔧 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📝 Creating initial commit..."
git add .
git commit -m "Initial commit: WhatsApp Chat to PDF Converter

Features:
- Convert WhatsApp chat exports to PDF
- Beautiful WhatsApp-style UI
- Image support
- Privacy-focused (all processing in browser)
- No installation required
- Cross-browser compatible"

echo ""
echo "🔗 Setting up GitHub remote..."
echo ""
echo "📌 NEXT STEPS:"
echo ""
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named: whatsapp-chat-to-pdf"
echo "3. DO NOT initialize with README, .gitignore, or license"
echo "4. After creating, run these commands:"
echo ""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/shubhamsinghal06/whatsapp-chat-to-pdf.git"
echo "   git push -u origin main"
echo ""
echo "=================================================="
echo ""
echo "Or run this complete setup (after creating the repo):"
echo ""
echo "git branch -M main && \\"
echo "git remote add origin https://github.com/shubhamsinghal06/whatsapp-chat-to-pdf.git && \\"
echo "git push -u origin main"
echo ""
echo "=================================================="

