(function(){
	var socket = io.connect('http://smallworld.jordantsmith.net');
	var Insta = Insta || {};
	var instaFeeds;

	Insta.App = {
		numberInRow: 1,
		linkArray: [],
		screenSize: 0,
		lastLink: "",
		init: function() {
			var self = this;
			this.mostRecent();
			this.getData();
			this.screenSize = window.innerWidth;
			
			$(".addButton").click(function() {
				data = {
				    "data": [{
				        "type": "image",
				        "users_in_photo": [],
				        "filter": "Earlybird",
				        "tags": ["snow"],
				        "comments": {
				            "data": [{
				                "created_time": "1296703540",
				                "text": "Snow",
				                "from": {
				                    "username": "emohatch",
				                    "username": "Dave",
				                    "id": "1242695"
				                },
				                "id": "26589964"
				            },
				            {
				                "created_time": "1296707889",
				                "text": "#snow",
				                "from": {
				                    "username": "emohatch",
				                    "username": "Emo Hatch",
				                    "id": "1242695"
				                },
				                "id": "26609649"
				            }],
				            "count": 3
				        },
				        "caption": {
				            "created_time": "1296703540",
				            "text": "#Snow",
				            "from": {
				                "username": "emohatch",
				                "id": "1242695"
				            },
				            "id": "26589964"
				        },
				        "likes": {
				            "count": 1,
				            "data": [{
				                "username": "mikeyk",
				                "full_name": "Mike Krieger",
				                "id": "4",
				                "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1242695_75sq_1293915800.jpg"
				            }]
				        },        
				        "link": "http://instagr.am/p/BWl6P/",
				        "user": {
				            "username": "emohatch",
				            "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1242695_75sq_1293915800.jpg",
				            "id": "1242695",
				            "full_name": "Dave"
				        },
				        "created_time": "1296703536",
				        "images": {
				            "low_resolution": {
				                "url": "http://distillery.s3.amazonaws.com/media/2011/02/02/f9443f3443484c40b4792fa7c76214d5_6.jpg",
				                "width": 306,
				                "height": 306
				            },
				            "thumbnail": {
				                "url": "http://distillery.s3.amazonaws.com/media/2011/02/02/f9443f3443484c40b4792fa7c76214d5_5.jpg",
				                "width": 150,
				                "height": 150
				            },
				            "standard_resolution": {
				                "url": "http://distillery.s3.amazonaws.com/media/2011/02/02/f9443f3443484c40b4792fa7c76214d5_7.jpg",
				                "width": 612,
				                "height": 612
				            }
				        },
				        "id": "22699663",
				        "location": null
				    }]
				};
				self.renderTemplate(data, 0, false);
			});
		},

		getData: function() {
			var self = this;
			socket.on('show', function(data) {
				var pictureData = data.show;
				setTimeout(function() {
					self.renderTemplate(pictureData, 0, false);
				}, 300);
			});
		},

		renderTemplate: function(data, index, checklinks) {
			var currentlink = data.data[index].link;
			var thisPicture = data.data[index];
			var currentcreatedtime = parseInt(data.data[index].created_time);
			var imgRow = null;
			
			//get rid of copies when picture are not real time
			if (checklinks) {
				for(var i = 0; i < this.linkArray.length; i++) {
					if (currentlink == this.linkArray[i]) {
						return;
					}
				}
			}

			if (this.lastLink == currentlink) {
				return;
			}

			this.lastLink = currentlink;

			if (this.numberInRow == 1) {
				imgRow = $('#pictures');
				imgRow.prepend("<div class='row'></div>")
			}
			imgRow = $('.row:first');

			this.linkArray.push(currentlink);

			var result = this.formatPicture(thisPicture);
			imgRow.prepend(result);

			if (checklinks) {
				setTimeout(function() {
					$(".picture").removeClass("animate");
				}, 1000)
			} else {
				setTimeout(function() {
			        $(".picture").removeClass("animate");
			    }, 500);
			}
						
			this.flag++;

			this.numberInRow++;
			if (this.numberInRow > 4) {
				this.numberInRow = 1;
			}
		},

		formatPicture: function(thisPicture) {
			var currentImage = thisPicture.images.low_resolution.url;
			var currentLink = thisPicture.link;
			var currentCaption = thisPicture.caption;
			var currentCreatedTime = parseInt(thisPicture.created_time);
			var currentUserName = thisPicture.user.username;
			var currentFullName = thisPicture.user.full_name;
			var currentFilter = thisPicture.filter;
			var currentProfileLink = "http://instagram.com/" + currentUserName;

			//photo is capable of not having a caption.
			//if it does then steralize that for apostrohes 
			if (currentCaption == null) {
				currentCaption = "";
			} else {
				currentCaption = currentCaption.text;
			}
			
			currentCaption = currentCaption.replace(/'/g, "&rsquo;");

			var frontFlipButton = "<button class='btn btn-default flipButton'>flip</button>";
			var backCard = "<div class='back'><a href='" + currentProfileLink + "'><h4>" + currentFullName + "</h4></a><p>" + currentCaption + "</p>" + frontFlipButton + "</div>";
			var info = "<div class='pictureInfo'><a href='" + currentProfileLink + "'><h4>" + currentUserName + "</h4></a>"
				info = info + "<p>Filter: " + currentFilter + "</p></div>";

			var result = "<div class='col-md-3 col-sm-6 flip-container'><div class='flipper'><div class='picture front animate'><a href='" + currentLink + "' ";
				result = result + "title='" + currentCaption + "' target='_blank'>";
				result = result + "<img class='img-responsive' src='" + currentImage + "' ";
				result = result + "alt='" + currentCaption + "'></a>" + info + frontFlipButton + "</div>"
				result = result + backCard + "</div></div>";

			return result;
		},

		mostRecent: function() {
			var self = this;
            socket.on('firstShow', function (data) {
            	self.numberInRow = 1;
            	self.linkArray = [];
            	self.lastLink = "";
            	$('#pictures').empty();
            	setTimeout(function() {
            		for (var i = 0; i < data.data.length; i++) {
	                	self.renderTemplate(data, i, true);
	                }
            	}, 500);
            }); 
        }
	}

	socket.on('setFeeds', function(data) {
		instaFeeds = data;
		var selectbox = $('.selectBox');
		selectbox.empty();
		for (var i = 0; i < data.length; i++) {
			selectbox.append("<option value='" + data[i].name + "'>" + data[i].displayName + "</option>");
		}
	});

	$('select').change(function() {
		$("select option:selected").each(function() {
			socket.emit('changeRoom', $(this).val());
		});
	});
	
	function startTime() {
	    var today = new Date();
	    var ampm = "am";
	    var h = today.getHours();
	    var m = today.getMinutes();
	    var s = today.getSeconds();
	    if (h > 11) {
	    	ampm = "pm";
	    }
	    if (h > 12) {
	    	h = h % 12;
	    } else if (h == 0) {
	    	h = 12;
	    }
	    m = checkTime(m);
	    s = checkTime(s);
	    $("#currentTime").text(h + ":" + m + ":" + s + " " + ampm);
	    var t = setTimeout(function(){startTime()},500);
	}

	function checkTime(i) {
	    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
	    return i;
	}

	startTime();
	Insta.App.init();
})(this);

$(document).ready(function() {
	$('#pictures').on('click', '.front .flipButton', function() {
		$('.flip-container').removeClass('flip');
		$(this).parents('.flip-container').toggleClass('flip');
	});

	$('#pictures').on('click', '.back .flipButton', function() {
		$(this).parents('.flip-container').toggleClass('flip');
	});

	$('#hideFooter').click(function() {
		$('.footer').hide();
	});
});
