/**
 * Kaguya Music Bot - Main Entry Point
 * 
 * A powerful Discord music bot that plays high-quality music from YouTube and Spotify
 * with professional audio processing using youtube-dl and FFmpeg.
 * 
 * @author Kunal
 * @version 1.0.0
 */

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const config = require('./config');
const MusicManager = require('./src/MusicManager');
const SpotifyService = require('./src/SpotifyService');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const musicManager = new MusicManager();
const spotifyService = new SpotifyService();

client.once('clientReady', async () => {
    console.log(`🎵 ${client.user.tag} is online and ready to play music!`);
    await spotifyService.authenticate();
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        switch (command) {
            case 'play':
            case 'p':
                await handlePlay(message, args);
                break;
            case 'skip':
            case 's':
                await handleSkip(message);
                break;
            case 'stop':
                await handleStop(message);
                break;
            case 'queue':
            case 'q':
                await handleQueue(message);
                break;
            case 'nowplaying':
            case 'np':
                await handleNowPlaying(message);
                break;
            case 'volume':
            case 'v':
                await handleVolume(message, args);
                break;
            case 'help':
                await handleHelp(message);
                break;
            default:
                message.reply('Unknown command! Use `!help` to see available commands.');
        }
    } catch (error) {
        console.error('Command error:', error);
        message.reply('An error occurred while processing your command.');
    }
});

async function handlePlay(message, args) {
    if (!message.member.voice.channel) {
        return message.reply('You need to be in a voice channel to play music!');
    }

    if (!args.length) {
        return message.reply('Please provide a song name, YouTube URL, or Spotify URL!');
    }

    const query = args.join(' ');
    const guildId = message.guild.id;
    
    // Join voice channel if not already connected
    let connection = musicManager.getConnection(guildId);
    if (!connection) {
        try {
            connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            
            musicManager.setConnection(guildId, connection);
            
            // Wait for connection to be ready
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
                
                connection.on(VoiceConnectionStatus.Ready, () => {
                    clearTimeout(timeout);
                    resolve();
                });
                
                connection.on(VoiceConnectionStatus.Disconnected, () => {
                    clearTimeout(timeout);
                    reject(new Error('Connection failed'));
                });
            });
            
        } catch (error) {
            console.error('Voice connection error:', error);
            return message.reply('❌ Failed to join voice channel. Please try again.');
        }
    }

    const loadingMessage = await message.reply('🔍 Searching for music...');

    try {
        const songs = await musicManager.searchAndQueue(guildId, query, spotifyService);
        
        if (songs.length === 0) {
            return loadingMessage.edit('❌ No songs found!');
        }

        if (songs.length === 1) {
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🎵 Added to Queue')
                .setDescription(`**${songs[0].title}**\nBy: ${songs[0].author}`)
                .setThumbnail(songs[0].thumbnail)
                .addFields({ name: 'Duration', value: songs[0].duration, inline: true });
            
            loadingMessage.edit({ content: '', embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('📋 Playlist Added')
                .setDescription(`Added **${songs.length}** songs to the queue!`);
            
            loadingMessage.edit({ content: '', embeds: [embed] });
        }

        // Start playing if not already playing
        if (!musicManager.isPlaying(guildId)) {
            await musicManager.play(guildId, message.channel);
        }
    } catch (error) {
        console.error('Play error:', error);
        loadingMessage.edit('❌ An error occurred while searching for music.');
    }
}

async function handleSkip(message) {
    const guildId = message.guild.id;
    
    if (!musicManager.isPlaying(guildId)) {
        return message.reply('Nothing is currently playing!');
    }

    musicManager.skip(guildId);
    message.reply('⏭️ Skipped the current song!');
}

async function handleStop(message) {
    const guildId = message.guild.id;
    
    musicManager.stop(guildId);
    message.reply('⏹️ Stopped playing and cleared the queue!');
}

async function handleQueue(message) {
    const guildId = message.guild.id;
    const queue = musicManager.getQueue(guildId);
    
    if (!queue || queue.length === 0) {
        return message.reply('The queue is empty!');
    }

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎵 Music Queue')
        .setDescription(
            queue.slice(0, 10).map((song, index) => 
                `${index + 1}. **${song.title}** - ${song.author} (${song.duration})`
            ).join('\n')
        );

    if (queue.length > 10) {
        embed.setFooter({ text: `And ${queue.length - 10} more songs...` });
    }

    message.reply({ embeds: [embed] });
}

async function handleNowPlaying(message) {
    const guildId = message.guild.id;
    const currentSong = musicManager.getCurrentSong(guildId);
    
    if (!currentSong) {
        return message.reply('Nothing is currently playing!');
    }

    const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🎵 Now Playing')
        .setDescription(`**${currentSong.title}**\nBy: ${currentSong.author}`)
        .setThumbnail(currentSong.thumbnail)
        .addFields({ name: 'Duration', value: currentSong.duration, inline: true });

    message.reply({ embeds: [embed] });
}

async function handleVolume(message, args) {
    if (!args[0]) {
        return message.reply('Please specify a volume level (0-100)!');
    }

    const volume = parseInt(args[0]);
    if (isNaN(volume) || volume < 0 || volume > 100) {
        return message.reply('Volume must be a number between 0 and 100!');
    }

    const guildId = message.guild.id;
    musicManager.setVolume(guildId, volume / 100);
    message.reply(`🔊 Volume set to ${volume}%`);
}

async function handleHelp(message) {
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎵 Music Bot Commands')
        .addFields(
            { name: '!play <song/url>', value: 'Play a song from YouTube or Spotify', inline: false },
            { name: '!skip', value: 'Skip the current song', inline: true },
            { name: '!stop', value: 'Stop playing and clear queue', inline: true },
            { name: '!queue', value: 'Show the current queue', inline: true },
            { name: '!nowplaying', value: 'Show currently playing song', inline: true },
            { name: '!volume <0-100>', value: 'Set the volume', inline: true },
            { name: '!help', value: 'Show this help message', inline: true }
        )
        .setFooter({ text: 'Supports YouTube links, Spotify links, and search queries!' });

    message.reply({ embeds: [embed] });
}

client.login(config.token);