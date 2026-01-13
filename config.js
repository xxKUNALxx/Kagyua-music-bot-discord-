/**
 * Bot Configuration
 * 
 * Centralized configuration for the Kaguya Music Bot
 */

require('dotenv').config();

module.exports = {
    // Discord Bot Token (Required)
    token: process.env.DISCORD_TOKEN,
    
    // Spotify API Credentials (Optional - for Spotify support)
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    },
    
    // Bot Settings
    prefix: '!',              // Command prefix
    maxQueueSize: 100,        // Maximum songs in queue
    defaultVolume: 0.5        // Default volume (0.0 - 1.0)
};