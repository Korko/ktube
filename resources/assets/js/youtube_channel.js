import GoogleAuth from './google.js';
import {Channel, Video} from './channel.js'

export default class YoutubeChannel extends Channel {
    constructor(channel, callback) {
        super();

        this.channel = channel;

        var client = GoogleAuth.getClient();
        client.youtube.channels.list({part:'contentDetails',id:channel.snippet.resourceId.channelId}).then(function(resp) {
            this.uploadsPlaylistId = resp.result.items[0].contentDetails.relatedPlaylists.uploads;

            callback.apply(this);
        }.bind(this));
    }

    get title() {
        return this.channel.snippet.title;
    }

    get thumbnail() {
        return this.channel.snippet.thumbnails.default.url;
    }

    hasNextPage() {
        return (this.nextPageToken);
    }

    nextPage(callback) {
        var client = GoogleAuth.getClient();
        client.youtube.playlistItems.list({part:'snippet',playlistId:this.uploadsPlaylistId,pageToken:this.nextPageToken,maxResults:5}).then(function(resp) {
            this.nextPageToken = resp.result.nextPageToken;

            var videos = [];
            resp.result.items.forEach(function(video) {
                videos.push(new YoutubeVideo(video));
            });

            this._lastVideo = videos.slice(-1).pop();

            callback.apply(this, [videos]);
        }.bind(this));
    }

    get lastVideo() {
        return this._lastVideo;
    }
}

class YoutubeVideo extends Video {
    constructor(video) {
        super();

        this.video = video;
    }

    get title() {
        return this.video.snippet.title;
    }

    get thumbnail() {
        return this.video.snippet.thumbnails.default.url;
    }

    get date() {
        return new Date(this.video.snippet.publishedAt).getTime();
    }
}
