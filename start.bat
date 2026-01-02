@echo off
REM WhatsApp Chat to PDF - Quick Start Script for Windows

echo ==================================================
echo 🚀 Starting WhatsApp Chat to PDF Converter
echo ==================================================
echo.

REM Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python found
    echo 🌐 Starting server on http://localhost:8080
    echo.
    python server.py
) else (
    echo ❌ Python not found!
    echo.
    echo Opening index.html directly in browser...
    start index.html
)

pause

