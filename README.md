# LiveEditor

LiveEditor is a real-time collaborative code editing platform built with Go and modern frontend technologies. It allows multiple users to join a shared coding session and edit code together seamlessly.

## ✨ Features

- 🔁 Real-time collaborative editing
- 💬 WebSocket-based communication
- 📦 Redis-backed session and document management
- 📄 Support for multiple sessions and users
- 💡 Sync, insert, delete, and replace operations
- 🖥️ Web frontend for live editing experience

## 🧱 Tech Stack

**Backend:**
- Go (Golang)
- Redis (for real-time data syncing and session storage)
- WebSocket (for live communication)

**Frontend:**
- React (or your preferred frontend framework)
- WebSocket client
- Code editor (e.g., Monaco, CodeMirror, or similar)

## 🚀 Getting Started

### Prerequisites

- Go 1.20+
- Redis
- Node.js (for frontend)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/c1te/LiveEditor.git
cd LiveEditor/backend

# Run the backend
go run main.go