/**
 * Spotify Service - Spotify API Integration
 * 
 * Handles Spotify API authentication and data retrieval
 * for tracks, playlists, and albums.
 * 
 * @author Kunal
 * @version 1.0.0
 */

const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../config');

class SpotifyService {
    constructor() {
        this.spotify = new SpotifyWebApi({
            clientId: config.spotify.clientId,
            clientSecret: config.spotify.clientSecret
        });
        this.authenticated = false;
    }

    async authenticate() {
        try {
            const data = await this.spotify.clientCredentialsGrant();
            this.spotify.setAccessToken(data.body['access_token']);
            this.authenticated = true;
            console.log('✅ Spotify authentication successful');
            
            // Refresh token before it expires
            setTimeout(() => {
                this.authenticate();
            }, (data.body['expires_in'] - 60) * 1000);
            
        } catch (error) {
            console.error('❌ Spotify authentication failed:', error.message);
            this.authenticated = false;
        }
    }

    async getTrack(trackId) {
        if (!this.authenticated) {
            throw new Error('Spotify not authenticated');
        }

        try {
            const data = await this.spotify.getTrack(trackId);
            return data.body;
        } catch (error) {
            console.error('Error fetching Spotify track:', error);
            return null;
        }
    }

    async getPlaylistTracks(playlistId) {
        if (!this.authenticated) {
            throw new Error('Spotify not authenticated');
        }

        try {
            const tracks = [];
            let offset = 0;
            const limit = 50;

            while (true) {
                const data = await this.spotify.getPlaylistTracks(playlistId, {
                    offset,
                    limit,
                    fields: 'items(track(name,artists(name))),next'
                });

                const playlistTracks = data.body.items
                    .filter(item => item.track && item.track.name)
                    .map(item => item.track);

                tracks.push(...playlistTracks);

                if (!data.body.next || tracks.length >= 100) break;
                offset += limit;
            }

            return tracks;
        } catch (error) {
            console.error('Error fetching Spotify playlist:', error);
            return [];
        }
    }

    async getAlbumTracks(albumId) {
        if (!this.authenticated) {
            throw new Error('Spotify not authenticated');
        }

        try {
            const tracks = [];
            let offset = 0;
            const limit = 50;

            while (true) {
                const data = await this.spotify.getAlbumTracks(albumId, {
                    offset,
                    limit
                });

                tracks.push(...data.body.items);

                if (!data.body.next || tracks.length >= 100) break;
                offset += limit;
            }

            return tracks;
        } catch (error) {
            console.error('Error fetching Spotify album:', error);
            return [];
        }
    }

    async searchTracks(query, limit = 1) {
        if (!this.authenticated) {
            throw new Error('Spotify not authenticated');
        }

        try {
            const data = await this.spotify.searchTracks(query, { limit });
            return data.body.tracks.items;
        } catch (error) {
            console.error('Error searching Spotify tracks:', error);
            return [];
        }
    }
}

module.exports = SpotifyService;