var instaFeeds = {
	"ithaca": {
		name: "ithaca",
		data: require('./routes/instagram/ithaca'),
		clientID: "77298706852440abb566e7f08cfa29ae",
		clientSecret: "75610934c202477aacab453904000376",
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
		clientID: "d83c63e8a8834fea8c3fc616734be9a1",
		clientSecret: "7f5b6eb75c464ddba7432f4ebcc48a14",
		tags: [
		    "psu", 
		    "pennstate", 
		    "pennstateuniversity"
		]
	},
	"harvard": {
		name: "harvard",
		data: require('./routes/instagram/harvard'),
		clientID: "f6d061861e4f41e6bc5a56ea370b1828",
		clientSecret: "128ba7e2f7d14e3d9b0fd90e628ac79a",
		tags: [
			"harvard",
			"harvarduniversity"
		]
	}
};

exports.getInstaFeeds = function() {
	return instaFeeds;
};