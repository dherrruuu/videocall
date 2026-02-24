# 📹 Multi-User Video Call App

A real-time video calling application with chat functionality. Built with WebRTC, Socket.io, Express, and vanilla JavaScript.

> ✅ **Now production-ready!** All deployment issues fixed. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## ✨ Features

- 🎥 **Multi-participant video calls** - Support for multiple users simultaneously
- 💬 **Real-time chat** - Send messages with usernames and timestamps
- 👤 **Simple username entry** - No login or registration required
- 🔗 **Shareable room links** - Easy invitation system
- 📊 **Live participant count** - See who's in the call
- 🎨 **Modern UI** - Clean, responsive design

## 🚀 Deploy to Render (Free)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Initialize git and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `video-call-app` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **"Create Web Service"**

### Step 3: Access Your App

- Render will give you a URL like: `https://video-call-app.onrender.com`
- Share this link with anyone to join the video call!

⚠️ **Note**: Free tier may spin down after inactivity (takes ~30 seconds to wake up)

---

## 🏠 Local Development

### Prerequisites

- Node.js 14+ installed

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Open `http://localhost:3000` in your browser

### Local Network Access

To let friends on your WiFi join:
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Share: `http://YOUR_LOCAL_IP:3000`

---

## 🔧 Alternative Deployment Options

### Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Node.js and deploys

### Fly.io

```bash
# Install flyctl
# Deploy
fly launch
fly deploy
```

---

## 📁 Project Structure

```
hackathon-call/
├── server.js           # Express server + Socket.io logic
├── package.json        # Dependencies and scripts
├── public/
│   └── index.html      # Frontend (HTML/CSS/JS)
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Real-time**: Socket.io (with WebSocket + polling fallback)
- **Video/Audio**: WebRTC (RTCPeerConnection)
- **ICE Servers**: 
  - STUN: Google STUN servers
  - TURN: OpenRelay (for production cross-network connectivity)

---

## 🎯 How It Works

1. User enters username → Camera/mic access requested
2. User joins a room (auto-generated or from URL)
3. Socket.io handles signaling between peers
4. WebRTC establishes peer-to-peer connections
5. Video streams directly between users
6. Chat messages go through the server

---

## 📝 License

ISC

---

## 🤝 Contributing

Feel free to submit issues and pull requests!

---

## 🐛 Troubleshooting

**Camera/Mic not working in production?**
- ⚠️ **HTTPS is REQUIRED** for camera/microphone in production
- Deploy to Render, Railway, or Heroku (all provide free HTTPS)
- Local development works on `localhost` without HTTPS

**Socket.io connection failing?**
- ✅ Now configured with fallback transports (polling)
- Check browser console for connection errors
- Server logs show connection attempts

**Video connects locally but not when deployed?**
- ✅ TURN servers now configured for cross-network connectivity
- May take a few seconds to establish connection
- Check if both users are on HTTPS

**Can't connect to other users?**
- Check firewall settings
- Ensure server is running
- Try different browsers
- See [DEPLOYMENT.md](DEPLOYMENT.md) for more debugging tips

**Free deployment sleeping?**
- Render free tier spins down after 15 min inactivity
- First request takes ~30 seconds to wake up

---

Made with ❤️ using WebRTC and Socket.io
