#!/usr/bin/env python3
"""
Simple HTTP server for WhatsApp Chat to PDF Converter
Run this to serve the application locally
"""

import http.server
import socketserver
import subprocess
import sys
import webbrowser
from pathlib import Path

PORT = 8080
DIRECTORY = Path(__file__).parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()


class ReusableTCPServer(socketserver.TCPServer):
    # Allow rebinding the port without waiting for TIME_WAIT (~60s) after a
    # previous instance exits. Crucial for fast iteration / debugger restarts.
    allow_reuse_address = True


def _who_is_holding(port: int) -> str:
    """Best-effort lookup of the PID(s) holding `port`, for a friendlier
    error message. Returns an empty string if nothing useful is found."""
    try:
        result = subprocess.run(
            ["lsof", "-nP", f"-iTCP:{port}", "-sTCP:LISTEN", "-Fpcn"],
            capture_output=True, text=True, timeout=2,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return ""
    if result.returncode != 0 or not result.stdout.strip():
        return ""
    return result.stdout.strip()


def main():
    try:
        httpd = ReusableTCPServer(("", PORT), Handler)
    except OSError as e:
        if e.errno == 48:  # EADDRINUSE
            print(f"\n❌ Port {PORT} is already in use.\n")
            info = _who_is_holding(PORT)
            if info:
                print("Currently held by:")
                print(info)
                print(f"\nKill it with:  kill -9 <pid>")
            else:
                print(f"Find the holder with:  lsof -nP -iTCP:{PORT} -sTCP:LISTEN")
            print(f"Or change PORT at the top of {Path(__file__).name}.\n")
            sys.exit(1)
        raise

    with httpd:
        print("=" * 60)
        print("🚀 WhatsApp Chat to PDF Converter Server")
        print("=" * 60)
        print(f"\n✅ Server running at: http://localhost:{PORT}")
        print(f"📁 Serving from: {DIRECTORY}")
        print("\n🌐 Opening browser...")
        print("\n💡 Press Ctrl+C to stop the server\n")
        print("=" * 60)

        webbrowser.open(f'http://localhost:{PORT}')

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Shutting down server...")
            print("=" * 60)


if __name__ == "__main__":
    main()

