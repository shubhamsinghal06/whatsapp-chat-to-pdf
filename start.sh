#!/bin/bash

# WhatsApp Chat to PDF - Quick Start Script

echo "=================================================="
echo "🚀 Starting WhatsApp Chat to PDF Converter"
echo "=================================================="
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    echo "🌐 Starting server on http://localhost:8080"
    echo ""
    python3 server.py
elif command -v python &> /dev/null; then
    echo "✅ Python found"
    echo "🌐 Starting server on http://localhost:8080"
    echo ""
    python server.py
else
    echo "❌ Python not found!"
    echo ""
    echo "Opening index.html directly in browser..."
    open index.html
fi

