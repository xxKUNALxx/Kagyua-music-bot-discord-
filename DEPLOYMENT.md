# 🚀 Deployment Guide for Kaguya Music Bot

## ⚠️ Important: Platform Compatibility

**Kaguya Music Bot is NOT compatible with:**
- ❌ Vercel (Serverless functions)
- ❌ Netlify (Static hosting)
- ❌ GitHub Pages (Static hosting)

**Why?** Discord bots require persistent connections, voice streaming, and long-running processes.

---

## ✅ Recommended Hosting Platforms

### 🔥 Railway (Recommended)

**Why Railway?**
- ✅ Perfect for Discord bots
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Supports FFmpeg and audio processing
- ✅ Persistent connections

**Deployment Steps:**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Deploy from GitHub**
   ```bash
   railway init
   railway link [your-project-id]
   railway up
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set DISCORD_TOKEN=your_token_here
   railway variables set SPOTIFY_CLIENT_ID=your_spotify_id
   railway variables set SPOTIFY_CLIENT_SECRET=your_spotify_secret
   ```

5. **Deploy**
   ```bash
   railway deploy
   ```

### 🌐 Render

**Deployment Steps:**

1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new "Web Service"
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables in dashboard
7. Deploy!

### 🔧 Heroku

**Deployment Steps:**

1. **Install Heroku CLI**
2. **Login and create app**
   ```bash
   heroku login
   heroku create your-bot-name
   ```

3. **Add buildpacks**
   ```bash
   heroku buildpacks:add heroku/nodejs
   heroku buildpacks:add https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
   ```

4. **Set environment variables**
   ```bash
   heroku config:set DISCORD_TOKEN=your_token_here
   heroku config:set SPOTIFY_CLIENT_ID=your_spotify_id
   heroku config:set SPOTIFY_CLIENT_SECRET=your_spotify_secret
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

---

## 🏠 Self-Hosted Options

### VPS Deployment

**Requirements:**
- Ubuntu/Debian server
- Node.js 16+
- FFmpeg
- PM2 for process management

**Setup Commands:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install FFmpeg
sudo apt install ffmpeg -y

# Install PM2
sudo npm install -g pm2

# Clone and setup bot
git clone https://github.com/xxKUNALxx/Kagyua-music-bot-discord-.git
cd Kagyua-music-bot-discord-
npm install

# Create .env file
cp .env.example .env
# Edit .env with your tokens

# Start with PM2
pm2 start index.js --name "kaguya-bot"
pm2 startup
pm2 save
```

### Local Machine (Development)

**Using PM2:**
```bash
# Install PM2 globally
npm install -g pm2

# Start bot with PM2
pm2 start index.js --name "kaguya-bot"

# Monitor
pm2 monit

# Logs
pm2 logs kaguya-bot

# Restart
pm2 restart kaguya-bot
```

---

## 🔧 Environment Variables

Set these on your hosting platform:

```env
DISCORD_TOKEN=your_discord_bot_token
SPOTIFY_CLIENT_ID=your_spotify_client_id (optional)
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret (optional)
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **Bot not starting**
   - Check environment variables
   - Verify Discord token is valid
   - Check logs for errors

2. **No audio playing**
   - Ensure FFmpeg is installed on hosting platform
   - Check voice channel permissions
   - Verify bot can connect to voice

3. **Memory issues**
   - Use platforms with at least 512MB RAM
   - Monitor memory usage
   - Restart bot periodically if needed

### Platform-Specific Notes:

**Railway:**
- Automatically installs FFmpeg
- No additional configuration needed

**Render:**
- May need custom buildpack for FFmpeg
- Check build logs for issues

**Heroku:**
- Requires FFmpeg buildpack
- Limited to 512MB RAM on free tier

---

## 📊 Platform Comparison

| Platform | Free Tier | FFmpeg | Ease | Best For |
|----------|-----------|---------|------|----------|
| Railway | ✅ Yes | ✅ Auto | ⭐⭐⭐⭐⭐ | Discord Bots |
| Render | ✅ Yes | ⚠️ Manual | ⭐⭐⭐⭐ | Web Apps |
| Heroku | ❌ No | ⚠️ Buildpack | ⭐⭐⭐ | General Apps |
| VPS | 💰 Paid | ✅ Manual | ⭐⭐ | Full Control |

**Recommendation: Use Railway for the best Discord bot hosting experience!**