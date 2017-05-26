const SCOPE = 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner';
var status = false;
var GoogleAuth = {};

var o = {
    initCallback: function(status) { },
    isSignedIn: function() {
        return status;
    },
    signIn: function() {
        GoogleAuth.signIn();
    },
    signOut: function() {
        GoogleAuth.signOut();
    },
    getClient: function() {
        return gapi.client;
    }
};

gapi.load('client:auth2', function() {
    gapi.client.init({
        'apiKey': window.global.googleApiKey,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        'clientId': window.global.googleClientID,
        'scope': SCOPE
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.isSignedIn.listen(setSigninStatus);
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();
        o.initCallback(status);
    });
});

function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        status = true;
    } else {
        status = false;
    }
}

export default o;
