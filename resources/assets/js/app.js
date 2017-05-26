

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example', require('./components/Example.vue'));

import GoogleAuth from './google.js';
import YoutubeChannel from './youtube_channel.js';

const VIDEOS_PER_PAGE = 10;
window.app = new Vue({
    el: '#app',
    data: {
        userStatus: GoogleAuth.isSignedIn(),
        subscriptions: {},
        allVideos: [],
        page: 1
    },
    computed: {
        channels: function() {
            return Object.values(this.subscriptions);
        },
        videos: {
            get: function() {
                return this.allVideos;
            },
            set: function(videos) {
                this.allVideos = videos.sort(function(video1, video2) {
                    return video1.date > video2.date ? -1 : (video1.date < video2.date ? 1 : 0);
                });
            }
        },
        pageVideos: function() {
            return this.videos.slice((this.page - 1) * VIDEOS_PER_PAGE, this.page * VIDEOS_PER_PAGE);
        }
    },
    created: function() {
        GoogleAuth.initCallback = function(status) {
            this.userStatus = status;
        }.bind(this);
    },
    methods: {
        handleAuthClick: function() {
            if (this.userStatus) {
                GoogleAuth.signOut();
            } else {
                GoogleAuth.signIn();
            }
            this.userStatus = GoogleAuth.isSignedIn();
        },
        loadData: function() {
            this.loadYoutubeChannels();
        },
        loadYoutubeChannels: function(pageToken) {
            var client = GoogleAuth.getClient();

            client.youtube.subscriptions.list({part:'snippet',mine:true,pageToken:pageToken,maxResults:50}).then(function(resp){
                resp.result.items.forEach(function(channel) {
                    var channelId = channel.snippet.resourceId.channelId;

                    app.$set(app.subscriptions, channelId, new YoutubeChannel(channel, function() {
                        this.nextPage(function(videos) {
                            app.videos = app.videos.concat(videos);
                        });
                    }));
                });

                if(resp.result.nextPageToken) {
                    this.loadYoutubeChannels(resp.result.nextPageToken);
                }
            }.bind(this));
        }        
    },
    watch: {
        userStatus: function() {
            if(this.userStatus) {
                this.loadData();
            }
        }
    }
});
