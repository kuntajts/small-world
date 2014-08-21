var express = require('express');
var app = express();
var port = process.env.PORT || 80;
var io = require('socket.io').listen(app.listen(port));
var http = require('http');
var request = ('request');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var methodOverride = require('method-override');
var intervalID;

var feedsAndPasswords = require('./feedsAndPasswords');
var instaFeeds = feedsAndPasswords.getInstaFeeds();

var instaFeedNames = [
	{
		displayName: "Ithaca College/Cornell",
		name: "ithaca"
	},
	{
		displayName: "Penn State University",
		name: "psu"
	},
	{
		displayName: "Havard University",
		name: "harvard"
	}
]
 

//setting the paths for the view
var pub = __dirname + '/public',
    view = __dirname + '/views';

//configuration for the application and express.
app.use(express.static(pub));
app.use(express.static(view));
app.use(bodyParser.json());
app.use(errorhandler());
app.use(methodOverride());

//very first connection
io.on('connection', function (socket) {
	var room = "ithaca";
	socket.emit('setFeeds', instaFeedNames);
	socket.join(room);
	socket.emit('firstShow', emitRecents(room));

	socket.on('changeRoom', function(newRoom) {
		socket.leave(room);
		room = newRoom;
		socket.join(room);
		socket.emit('firstShow', emitRecents(room));
	});
});

for(var i in instaFeeds) {
	var data = i.data;
	var name = i.name;
	var callback = '/callback' + name;

	app.get(callback, data.handshake);
	app.post(callback, data.newPost);
}

function emitRecents(room, socket) {
	var foundRoom = findRoom(room);
	var cached = foundRoom.firstShow();
	return cached;
}

function findRoom(room) {
	for(var i = 0; i < instaFeeds.length; i++) {
		if (instaFeeds[i].name == room) {
			return instaFeeds[i].data;
		}
	}
}

exports.emitNewPost = function(room, object) {
	io.sockets.in(room).emit('show', { show: object });
	console.log("This post came from the feed: " + room);
};

console.log("Listening on port " + port);