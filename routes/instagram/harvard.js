var Instagram_harvard = require('instagram-node-lib');
var express = require('express');
var http = require('http');
var request = require('request');
var app = require('../../server');

var feedName = 'harvard';
var cached = { data:
    []
};

//setting both the client id and the secret id for instagram
var clientID = '',
    clientSecret = '';
    tags = []

exports.setInstagram = function(client, secret, tagsIn) {
    clientID = client;
    clientSecret = secret;
    tags = tagsIn;

    //configuration for instagram-node-lib
    Instagram_harvard.set('client_id', clientID);
    Instagram_harvard.set('client_secret', clientSecret);
    Instagram_harvard.set('callback_url', 'http://smallworld.jordantsmith.net/callback' + feedName);
    Instagram_harvard.set('redirect_uri', 'http://smallworld.jordantsmith.net');
    Instagram_harvard.set('maxSockets', 10);

    setSubscriptions();
}


//Instagram_harvard.subscriptions.unsubscribe({ id: '10993377' });
//https://api.instagram.com/v1/subscriptions?client_secret=128ba7e2f7d14e3d9b0fd90e628ac79a&client_id=f6d061861e4f41e6bc5a56ea370b1828

function setSubscriptions() {
    for (var i = 0; i < tags.length; i++) {
        Instagram_harvard.subscriptions.subscribe({
            object: 'tag',
            object_id: tags[i],
            aspect: 'media',
            callback_url: 'http://smallworld.jordantsmith.net/callback' + feedName,
            type: 'subscription',
            id: '3'
        });
    }
}

exports.firstShow = function() {
    return cached;
}

exports.handshake = function(req, res) {
    var hs = Instagram_harvard.subscriptions.handshake(req, res);
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

console.log("Instagram: harvard started");