/**
 * Bot Connection Test
 * 
 * Simple test script to verify Discord bot connection
 * and validate environment configuration.
 */

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log('✅ Bot is connected and ready!');
    console.log(`Logged in as: ${client.user.tag}`);
    console.log(`Bot ID: ${client.user.id}`);
    console.log('🎵 Music bot is ready to rock!');
    process.exit(0);
});

client.on('error', (error) => {
    console.error('❌ Bot error:', error);
    process.exit(1);
});

if (!process.env.DISCORD_TOKEN) {
    console.error('❌ DISCORD_TOKEN not found in .env file!');
    console.log('Please add your Discord bot token to the .env file');
    process.exit(1);
}

console.log('🔄 Connecting to Discord...');
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('❌ Failed to login:', error.message);
    console.log('Please check your Discord bot token in the .env file');
    process.exit(1);
});