//sample object for feeds
var instaFeeds = {
	"ithaca": {
		name: "ithaca",
		data: require('./routes/instagram/ithaca'),
		clientID: "*****",
		clientSecret: "*****",
		tags: [
			"ithaca",
			"ithacacollege",
			"cornell",
			"cornelluniversity"
		]
	},
	"psu": {
		name: "psu",
		data: require('./routes/instagram/psu'),
		clientID: "*****",
		clientSecret: "*****",
		tags: [
		    "psu", 
		    "pennstate", 
		    "pennstateuniversity"
		]
	},
	"harvard": {
		name: "harvard",
		data: require('./routes/instagram/harvard'),
		clientID: "*****",
		clientSecret: "*****",
		tags: [
			"harvard",
			"harvarduniversity"
		]
	}
};

exports.getInstaFeeds = function() {
	return instaFeeds;
};