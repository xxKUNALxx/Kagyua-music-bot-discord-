# 🎵 Kaguya Music Bot

<div align="center">

![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)

**A powerful Discord music bot that plays high-quality music from YouTube and Spotify**

[Features](#-features) • [Installation](#-installation) • [Commands](#-commands) • [Configuration](#-configuration) • [Support](#-support)

</div>

---

## ✨ Features

### 🎶 **Multi-Platform Support**
- **YouTube** - Direct links, playlists, and search queries
- **Spotify** - Tracks, playlists, and albums (plays via YouTube)
- **High-Quality Audio** - Professional audio processing pipeline

### 🚀 **Advanced Functionality**
- **Queue Management** - Add, skip, view, and manage your music queue
- **Volume Control** - Adjustable audio levels (0-100%)
- **Rich Embeds** - Beautiful Discord messages with song information
- **Auto-Disconnect** - Leaves voice channel when inactive
- **Error Recovery** - Automatically handles playback issues

### 🛠️ **Technical Excellence**
- **youtube-dl Integration** - Professional-grade YouTube extraction
- **FFmpeg Processing** - High-quality audio conversion
- **Discord Optimized** - Built specifically for Discord's voice system
- **Robust Error Handling** - Graceful failure recovery

---

## 🚀 Installation

### Prerequisites

Before installing, ensure you have:

- **Node.js** 16.9.0 or higher
- **FFmpeg** installed on your system
- **Discord Bot Token**
- **Spotify API Credentials** (optional)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/xxKUNALxx/Kagyua-music-bot-discord-.git
   cd Kagyua-music-bot-discord-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your tokens
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

### Detailed Installation Guide

<details>
<summary>📋 Step-by-Step Setup Instructions</summary>

#### 1. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it "Kaguya Music Bot"
3. Navigate to "Bot" section and click "Add Bot"
4. Copy the bot token and save it
5. Enable "Message Content Intent" in bot settings

#### 2. Bot Permissions & Invite

1. Go to "OAuth2" → "URL Generator"
2. Select scopes: `bot`
3. Select permissions:
   - Send Messages
   - Connect
   - Speak
   - Use Voice Activity
4. Copy the generated URL and invite the bot to your server

#### 3. FFmpeg Installation

**Windows (Chocolatey):**
```powershell
# Install Chocolatey (run as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install FFmpeg
choco install ffmpeg
```

**Manual Installation:**
1. Download from [FFmpeg Official Site](https://ffmpeg.org/download.html)
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to system PATH

#### 4. Spotify Setup (Optional)

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy Client ID and Client Secret
4. Add to your `.env` file

</details>

---

## 🎮 Commands

| Command | Description | Example |
|---------|-------------|---------|
| `!play <query/url>` | Play music from search or URL | `!play bohemian rhapsody` |
| `!play <youtube-url>` | Play from YouTube link | `!play https://youtube.com/watch?v=...` |
| `!play <spotify-url>` | Play from Spotify link | `!play https://open.spotify.com/track/...` |
| `!skip` | Skip current song | `!skip` |
| `!stop` | Stop music and clear queue | `!stop` |
| `!queue` | Show current queue | `!queue` |
| `!nowplaying` | Show currently playing song | `!nowplaying` |
| `!volume <0-100>` | Set volume level | `!volume 75` |
| `!help` | Show all commands | `!help` |

### 🔗 Supported URLs

- **YouTube Videos:** `https://www.youtube.com/watch?v=...`
- **YouTube Playlists:** `https://www.youtube.com/playlist?list=...`
- **Spotify Tracks:** `https://open.spotify.com/track/...`
- **Spotify Playlists:** `https://open.spotify.com/playlist/...`
- **Spotify Albums:** `https://open.spotify.com/album/...`

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token_here

# Spotify Configuration (Optional)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### Bot Configuration

Edit `config.js` to customize:

```javascript
module.exports = {
    prefix: '!',           // Command prefix
    maxQueueSize: 100,     // Maximum songs in queue
    defaultVolume: 0.5     // Default volume (0.0 - 1.0)
};
```

---

## 🏗️ Architecture

### Project Structure

```
├── src/
│   ├── MusicManager.js     # Core music functionality
│   └── SpotifyService.js   # Spotify API integration
├── config.js               # Bot configuration
├── index.js               # Main bot file
├── package.json           # Dependencies
└── README.md             # Documentation
```

### Technology Stack

- **Discord.js** - Discord API wrapper
- **youtube-dl-exec** - YouTube content extraction
- **FFmpeg** - Audio processing
- **Spotify Web API** - Spotify integration
- **Node.js** - Runtime environment

---

## 🔧 Development

### Running in Development

```bash
npm run dev
```

### Testing Connection

```bash
node test-bot.js
```

### Scripts

- `npm start` - Start the bot
- `npm run dev` - Start with auto-restart
- `npm test` - Run connection test

---

## 🐛 Troubleshooting

<details>
<summary>Common Issues & Solutions</summary>

### Bot Not Responding
- ✅ Check Discord token in `.env`
- ✅ Verify bot permissions in server
- ✅ Ensure "Message Content Intent" is enabled

### No Audio Playing
- ✅ Install FFmpeg and add to PATH
- ✅ Check voice channel permissions
- ✅ Verify bot can connect to voice

### Spotify Not Working
- ✅ Add Spotify credentials to `.env`
- ✅ Verify API credentials are valid
- ✅ Check Spotify app settings

### "Could not extract functions" Error
- ✅ This is handled automatically by youtube-dl
- ✅ Bot will retry with alternative methods
- ✅ Update dependencies if persistent

</details>

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 💖 Support

If you found this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the code

---

## 📞 Contact

- **GitHub:** [@xxKUNALxx](https://github.com/xxKUNALxx)
- **Discord:** Create an issue for support

---

<div align="center">

**Made with ❤️ for the Discord community**

</div>