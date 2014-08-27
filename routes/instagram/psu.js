var Instagram_psu = require('instagram-node-lib');
var express = require('express');
var http = require('http');
var request = require('request');
var app = require('../../server');

var feedName = 'psu';
var cached = { data:
    []
};

//setting both the client id and the secret id for instagram
var clientID = '',
    clientSecret = '',
    tags = [];

exports.setInstagram = function(client, secret, tagsIn) {
    clientID = client;
    clientSecret = secret;
    tags = tagsIn;

    //configuration for instagram-node-lib
    Instagram_psu.set('client_id', clientID);
    Instagram_psu.set('client_secret', clientSecret);
    Instagram_psu.set('callback_url', 'http://smallworld.jordantsmith.net/callback' + feedName);
    Instagram_psu.set('redirect_uri', 'http://smallworld.jordantsmith.net');
    Instagram_psu.set('maxSockets', 10);

    setSubscriptions();
}

//Instagram_psu.subscriptions.unsubscribe({ id: '11089334' });
//https://api.instagram.com/v1/subscriptions?client_secret=7f5b6eb75c464ddba7432f4ebcc48a14&client_id=d83c63e8a8834fea8c3fc616734be9a1

function setSubscriptions() {
    for (var i = 0; i < tags.length; i++) {
        Instagram_psu.subscriptions.subscribe({
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
    var hs = Instagram_psu.subscriptions.handshake(req, res);
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
        if (json != null && json.data !== undefined && json.data[0] !== undefined) {
            if (lastLink != json.data[0].link) {
                app.emitNewPost(feedName, json);
                cached.data.push(json.data[0]);
                if (cached.data.length > 24) {
                    cached.data.shift();
                }
                lastLink = json.data[0].link;
            }
        }
    });
}

console.log("Instagram: psu started");