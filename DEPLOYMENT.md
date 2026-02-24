# Deployment Guide

## ✅ Fixes Applied

The following issues have been fixed for production deployment:

1. **Socket.io Configuration**
   - Added fallback transports (websocket → polling)
   - Increased timeout values for poor connections
   - Added reconnection logic

2. **HTTPS Detection**
   - Camera/mic now checks for HTTPS requirement
   - Clear error message shown if HTTP is used in production

3. **WebRTC TURN Servers**
   - Added free TURN servers for cross-network connectivity
   - Increased ICE candidate pool size

4. **Server Configuration**
   - Proper CORS settings
   - Health check endpoint for monitoring
   - Environment PORT support

## 🚀 Deployment Platforms

### Render (Recommended - Free tier available)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create New → Web Service
4. Connect your GitHub repo
5. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Deploy!

Your app will be on HTTPS automatically (required for camera/mic).

### Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy:
   ```bash
   git push heroku main
   ```

### Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo
4. Railway auto-detects Node.js
5. Deploy!

### Vercel (requires serverless config)

Not recommended for Socket.io apps without additional setup.

## ⚠️ Important Requirements

### HTTPS is MANDATORY
- Camera/microphone APIs require HTTPS in production
- All recommended platforms provide free HTTPS
- If self-hosting, use Let's Encrypt or Certbot

### Environment Variables (Optional)

If you want to use custom TURN servers:
```
TURN_URL=turn:your-turn-server.com:3478
TURN_USERNAME=your-username
TURN_PASSWORD=your-password
```

## 🧪 Testing Deployment

1. Open your deployed URL
2. Check browser console (F12) for errors
3. Allow camera/microphone permissions
4. Create a call and test with another device/browser
5. Check if chat and video work

## 🐛 Common Issues

### "Camera requires HTTPS"
- **Cause**: Site is served over HTTP
- **Fix**: Deploy to a platform with HTTPS (Render, Heroku, Railway)

### Socket.io connection fails
- **Cause**: WebSocket blocked by firewall/proxy
- **Fix**: Our config now falls back to polling automatically

### Video doesn't connect between users
- **Cause**: NAT/firewall blocking WebRTC
- **Fix**: TURN servers are now configured (free tier)

### Connection timeout
- **Cause**: Slow network or server sleeping (free tiers)
- **Fix**: Increased timeout values in config

## 🔍 Debugging

Check browser console (F12) for:
- Socket connection status: "✓ Connected to server"
- WebRTC connection states
- ICE candidate gathering
- Media device errors

Check server logs for:
- User connections/disconnections
- Room creation/joining
- WebRTC signaling events

## 📱 Mobile Considerations

- Works on mobile browsers (Chrome, Safari)
- May require user gesture to start (tap to join)
- Camera orientation handled automatically
- Touch-friendly UI included

## 🔒 Security Notes

- Current CORS is set to `*` (all origins)
- For production, restrict CORS to your domain:
  ```javascript
  cors: { origin: "https://yourdomain.com" }
  ```
- Consider adding rate limiting for join requests
- TURN server credentials are public (free tier)

## 📊 Free Tier Limits

**Render**: 750 hours/month, sleeps after 15min inactivity
**Heroku**: 550-1000 hours/month, sleeps after 30min
**Railway**: $5 free credit/month

Apps "wake up" when accessed (may take 30s first load).

## ✨ Next Steps

After successful deployment:
1. Test with multiple users across different networks
2. Monitor performance and connection quality
3. Consider upgrading TURN servers for production use
4. Add user authentication if needed
5. Implement recording feature (optional)

---

Need help? Check server logs and browser console first!
