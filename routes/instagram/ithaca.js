var Instagram_ithaca = require('instagram-node-lib');
var express = require('express');
var http = require('http');
var request = require('request');
var app = require('../../server');

var feedName = 'ithaca';
var cached = { data:
    []
};

//setting both the client id and the secret id for instagram
var clientID = '77298706852440abb566e7f08cfa29ae',
    clientSecret = '75610934c202477aacab453904000376';

//configuration for instagram-node-lib
Instagram_ithaca.set('client_id', clientID);
Instagram_ithaca.set('client_secret', clientSecret);
Instagram_ithaca.set('callback_url', 'http://smallworld.jordantsmith.net/callback' + feedName);
Instagram_ithaca.set('redirect_uri', 'http://smallworld.jordantsmith.net');
Instagram_ithaca.set('maxSockets', 10);

//SInstagram_ithaca.subscriptions.unsubscribe({ id: '11089298' });
//https://api.instagram.com/v1/subscriptions?client_secret=75610934c202477aacab453904000376&client_id=77298706852440abb566e7f08cfa29ae

tags = [ 
    "ithaca", 
    "ithacacollege", 
    "cornell", 
    "cornelluniversity"
];

for (var i = 0; i < tags.length; i++) {
    Instagram_ithaca.subscriptions.subscribe({
        object: 'tag',
        object_id: tags[i],
        aspect: 'media',
        callback_url: 'http://smallworld.jordantsmith.net/callback' + feedName,
        type: 'subscription',
        id: '3'
    });
}

exports.firstShow = function() {
    return cached;
}

exports.handshake = function(req, res) {
    var hs = Instagram_ithaca.subscriptions.handshake(req, res);
};

exports.newPost = function(req, res) {
    var data = req.body;
    console.log(data);

    // Grab the hashtag "tag.object_id"
    // concatenate to the url and send as a argument to the client side
    data.forEach(function(tag) {
        var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=' + clientID;
        sendMessage(url);
    });
    res.end();
};

//sending photo data to client
var lastLink = "";
function sendMessage(url) {
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200){
            var jsonpData = body;
            var json;
            try {
                json = JSON.parse(jsonpData);
            } catch(e) {
                var startPos = jsonpData.indexOf('({');
                var endPos = jsonpData.indexOf('})');
                var jsonString = jsonpData.substring(startPos+1, endPos+1);
                json = JSON.parse(jsonString);
            }
        }
        if (json.data[0] != null && json != null) {
            if (lastLink != json.data[0].link) {
                app.emitNewPost(feedName, json);
                cached.data.push(json.data[0]);
                if (cached.data.length > 8) {
                    cached.data.shift();
                }
                lastLink = json.data[0].link;
            }
        }
    });
}

console.log("Instagram: Ithaca started");