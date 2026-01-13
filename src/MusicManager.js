/**
 * Music Manager - Core Music Functionality
 * 
 * Handles music playback, queue management, and audio processing
 * using play-dl for reliable YouTube streaming on hosting platforms.
 * 
 * @author Kunal
 * @version 1.0.0
 */

const { createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const play = require('play-dl');
const yts = require('yt-search');

class MusicManager {
    constructor() {
        this.queues = new Map();
        this.players = new Map();
        this.connections = new Map();
        this.currentSongs = new Map();
    }

    getQueue(guildId) {
        return this.queues.get(guildId) || [];
    }

    setConnection(guildId, connection) {
        this.connections.set(guildId, connection);
        
        connection.on(VoiceConnectionStatus.Disconnected, () => {
            this.cleanup(guildId);
        });
    }

    getConnection(guildId) {
        return this.connections.get(guildId);
    }

    async searchAndQueue(guildId, query, spotifyService) {
        let songs = [];

        console.log(`🔍 Searching for: ${query}`);

        if (this.isSpotifyUrl(query)) {
            songs = await this.handleSpotifyUrl(query, spotifyService);
        } else if (this.isYouTubeUrl(query)) {
            songs = await this.handleYouTubeUrl(query);
        } else {
            // Simple search like other bots - just get the first result
            try {
                const searchResults = await yts(query);
                if (searchResults.videos.length > 0) {
                    const video = searchResults.videos[0]; // Just take the first result
                    console.log(`🎵 Found: ${video.title} by ${video.author.name}`);
                    
                    songs.push({
                        title: video.title,
                        author: video.author.name,
                        url: video.url,
                        duration: this.formatDuration(video.duration.seconds * 1000),
                        thumbnail: video.thumbnail
                    });
                }
            } catch (error) {
                console.error('Search error:', error);
            }
        }

        if (songs.length > 0) {
            console.log(`✅ Adding ${songs.length} songs to queue`);
            const queue = this.getQueue(guildId);
            queue.push(...songs);
            this.queues.set(guildId, queue);
        }

        return songs;
    }

    async smartSearch(query) {
        const songs = [];
        
        try {
            // Search with yt-search for better filtering
            const searchResults = await yts(query);
            const videos = searchResults.videos.slice(0, 10); // Get more results to filter from
            
            console.log(`📊 Found ${videos.length} potential videos`);
            
            // Smart filtering to avoid restricted content
            const filteredVideos = videos.filter(video => {
                const title = video.title.toLowerCase();
                const author = video.author.name.toLowerCase();
                const duration = video.duration.seconds;
                
                // Skip very short videos (likely ads/trailers)
                if (duration < 60) return false;
                
                // Skip very long videos (likely not songs)
                if (duration > 600) return false;
                
                // Avoid major music labels that are often restricted
                const restrictedChannels = [
                    'sony music india', 'sonymusicindiavevo', 'sony music',
                    't-series', 'tseries', 'zee music company', 'zee music',
                    'tips music', 'tips official', 'saregama music',
                    'venus worldwide entertainment', 'shemaroo entertainment'
                ];
                
                const isRestricted = restrictedChannels.some(channel => 
                    author.includes(channel) || author.replace(/\s+/g, '').includes(channel.replace(/\s+/g, ''))
                );
                
                if (isRestricted) {
                    console.log(`❌ Skipping restricted channel: ${author}`);
                    return false;
                }
                
                // Prefer covers, remixes, and user uploads
                const preferredKeywords = ['cover', 'remix', 'version', 'unplugged', 'acoustic'];
                const hasPreferredKeyword = preferredKeywords.some(keyword => title.includes(keyword));
                
                // Avoid official music videos from major labels
                const officialKeywords = ['official video', 'official music video', 'full video', '4k'];
                const isOfficial = officialKeywords.some(keyword => title.includes(keyword));
                
                if (isOfficial && !hasPreferredKeyword) {
                    console.log(`❌ Skipping official video: ${title}`);
                    return false;
                }
                
                console.log(`✅ Approved: ${title} by ${author}`);
                return true;
            });
            
            // If no filtered results, try with less strict filtering
            const videosToUse = filteredVideos.length > 0 ? filteredVideos : videos.slice(0, 3);
            
            for (const video of videosToUse.slice(0, 3)) {
                songs.push({
                    title: video.title,
                    author: video.author.name,
                    url: video.url,
                    duration: this.formatDuration(video.duration.seconds * 1000),
                    thumbnail: video.thumbnail
                });
            }
            
        } catch (error) {
            console.error('Smart search error:', error);
            
            // Fallback to youtube-sr
            try {
                const results = await YouTube.search(query, { limit: 3, type: 'video' });
                for (const video of results) {
                    songs.push(this.formatYouTubeSong(video));
                }
            } catch (fallbackError) {
                console.error('Fallback search error:', fallbackError);
            }
        }
        
        return songs;
    }

    async handleSpotifyUrl(url, spotifyService) {
        const songs = [];
        
        if (url.includes('/track/')) {
            const trackId = this.extractSpotifyId(url);
            const track = await spotifyService.getTrack(trackId);
            if (track) {
                const searchQuery = `${track.name} ${track.artists[0].name}`;
                const youtubeResults = await YouTube.search(searchQuery, { limit: 1, type: 'video' });
                if (youtubeResults.length > 0) {
                    songs.push(this.formatYouTubeSong(youtubeResults[0]));
                }
            }
        } else if (url.includes('/playlist/') || url.includes('/album/')) {
            const playlistId = this.extractSpotifyId(url);
            const tracks = url.includes('/playlist/') 
                ? await spotifyService.getPlaylistTracks(playlistId)
                : await spotifyService.getAlbumTracks(playlistId);
            
            for (const track of tracks.slice(0, 50)) { // Limit to 50 tracks
                const searchQuery = `${track.name} ${track.artists[0].name}`;
                try {
                    const youtubeResults = await YouTube.search(searchQuery, { limit: 1, type: 'video' });
                    if (youtubeResults.length > 0) {
                        songs.push(this.formatYouTubeSong(youtubeResults[0]));
                    }
                } catch (error) {
                    console.error(`Error searching for ${searchQuery}:`, error);
                }
            }
        }

        return songs;
    }

    async handleYouTubeUrl(url) {
        const songs = [];

        if (url.includes('playlist?list=')) {
            // For playlists, we'll just add the first video for now
            try {
                const searchResults = await yts({ videoId: this.extractYouTubeId(url) });
                if (searchResults) {
                    songs.push({
                        title: searchResults.title,
                        author: searchResults.author.name,
                        url: searchResults.url,
                        duration: this.formatDuration(searchResults.duration.seconds * 1000),
                        thumbnail: searchResults.thumbnail
                    });
                }
            } catch (error) {
                console.error('Error getting video info:', error);
            }
        } else {
            try {
                const videoId = this.extractYouTubeId(url);
                const searchResults = await yts({ videoId });
                if (searchResults) {
                    songs.push({
                        title: searchResults.title,
                        author: searchResults.author.name,
                        url: searchResults.url,
                        duration: this.formatDuration(searchResults.duration.seconds * 1000),
                        thumbnail: searchResults.thumbnail
                    });
                }
            } catch (error) {
                console.error('Error getting video info:', error);
            }
        }

        return songs;
    }

    extractYouTubeId(url) {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    }

    formatYouTubeSong(video) {
        return {
            title: video.title,
            author: video.channel?.name || video.author?.name || 'Unknown',
            url: video.url || `https://www.youtube.com/watch?v=${video.id}`,
            duration: this.formatDuration(video.duration),
            thumbnail: video.thumbnail?.url || video.thumbnails?.[0]?.url || null
        };
    }

    formatDuration(duration) {
        if (!duration) return 'Unknown';
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    isSpotifyUrl(url) {
        return url.includes('spotify.com/');
    }

    isYouTubeUrl(url) {
        return url.includes('youtube.com/') || url.includes('youtu.be/');
    }

    extractSpotifyId(url) {
        const match = url.match(/\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
        return match ? match[2] : null;
    }

    async play(guildId, textChannel) {
        const queue = this.getQueue(guildId);
        const connection = this.getConnection(guildId);

        if (!queue.length || !connection) return;

        const song = queue.shift();
        this.currentSongs.set(guildId, song);

        try {
            console.log(`🎵 Playing: ${song.title}`);
            console.log(`🔗 URL: ${song.url}`);
            
            // Validate URL
            if (!song.url || song.url === 'undefined') {
                throw new Error('Invalid song URL');
            }

            console.log('🎵 Creating audio stream with play-dl...');
            
            // Use play-dl for reliable streaming (works on hosting platforms)
            const stream = await play.stream(song.url, {
                quality: 2 // High quality
            });

            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true
            });

            let player = this.players.get(guildId);
            if (!player) {
                player = createAudioPlayer();
                this.players.set(guildId, player);
            }

            console.log('🎵 Starting playback...');
            player.play(resource);
            connection.subscribe(player);

            // Send now playing message
            textChannel.send(`🎵 Now playing: **${song.title}** by ${song.author}`);

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('Song finished, checking queue...');
                this.currentSongs.delete(guildId);
                const currentQueue = this.getQueue(guildId);
                if (currentQueue.length > 0) {
                    setTimeout(() => this.play(guildId, textChannel), 1000);
                } else {
                    textChannel.send('🎵 Queue finished!');
                }
            });

            player.on('error', (error) => {
                console.error('Audio player error:', error);
                textChannel.send('❌ An error occurred while playing the song.');
                
                // Try next song in queue
                const currentQueue = this.getQueue(guildId);
                if (currentQueue.length > 0) {
                    setTimeout(() => this.play(guildId, textChannel), 1000);
                }
            });

        } catch (error) {
            console.error('Play error:', error);
            textChannel.send(`❌ Failed to play the song: ${error.message}`);
            
            // Try next song in queue if available
            const currentQueue = this.getQueue(guildId);
            if (currentQueue.length > 0) {
                setTimeout(() => this.play(guildId, textChannel), 2000);
            }
        }
    }

    skip(guildId) {
        const player = this.players.get(guildId);
        if (player) {
            player.stop();
        }
    }

    stop(guildId) {
        const player = this.players.get(guildId);
        const connection = this.getConnection(guildId);

        if (player) {
            player.stop();
        }

        if (connection) {
            connection.destroy();
        }

        this.cleanup(guildId);
    }

    cleanup(guildId) {
        this.queues.delete(guildId);
        this.players.delete(guildId);
        this.connections.delete(guildId);
        this.currentSongs.delete(guildId);
    }

    isPlaying(guildId) {
        const player = this.players.get(guildId);
        return player && player.state.status === AudioPlayerStatus.Playing;
    }

    getCurrentSong(guildId) {
        return this.currentSongs.get(guildId);
    }

    setVolume(guildId, volume) {
        const player = this.players.get(guildId);
        if (player && player.state.resource && player.state.resource.volume) {
            player.state.resource.volume.setVolume(volume);
        }
    }
}

module.exports = MusicManager;