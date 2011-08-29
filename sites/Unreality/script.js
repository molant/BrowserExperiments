if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
      {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }

    return res;
  };
}

function distance(latlon1, latlon2){
	// convert object
	if(typeof(latlon1)==='object'){
		latlon1 = latlon1.latitude+','+latlon1.longitude;
	}
	if(typeof(latlon2)==='object'){
		latlon2 = latlon2.latitude+','+latlon2.longitude;
	}
	
	function toRad(i){return i * Math.PI / 180;}
	
	var p = {
			lat1 : latlon1.split(',')[0],
			lon1 : latlon1.split(',')[1],
			lat2 : latlon2.split(',')[0],
			lon2 : latlon2.split(',')[1]
		},

		dLat = toRad(p.lat2-p.lat1),
		dLon = toRad(p.lon2-p.lon1),
		
		lat1 = toRad(p.lat1),
		lat2 = toRad(p.lat2),
		
		a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2),
		    
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

	return c * 6371; // km
}



/**
 * Log function!
 */
function log() {
	if (typeof(console) === 'undefined'||typeof(console.log) === 'undefined') return;
	if (typeof console.log === 'function') {
		console.log.apply(console, arguments); // FF, CHROME, Webkit
	}
	else{
		console.log(Array.prototype.slice.call(arguments)); // IE
	}
}


/**
 * GrayScale,
 * Changes the background image into a grayscale image
 */
$.fn.grayScale = function(){

	$(this).each(function(){
		
		var img = new Image(),
			src = this.src,
			self = this;
			
	
		if(!src){
			src = $(this).css('backgroundImage').replace(/^url\((.*?)\)$/, '$1');
		}
		
		$(this).data('original',src);
	
		img.src = src;
		img.onload = function(){
			// disposable canvas element
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d');
			
			// set the canvas width
			canvas.width = img.width
			// set the canvas height
			canvas.height = img.height
			// draw image
			ctx.drawImage(img,0,0);
	
			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
				data = imageData.data;
	
			for (var i = 0; i < data.length; i += 4) {
			    data[i] = data[i + 1] = data[i + 2] = (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]);
			}
			// overwrite original image
			ctx.putImageData(imageData, 0, 0);			
			ctx.save();

			if(!self.src){
				$(self).css('backgroundImage', "url("+canvas.toDataURL()+")");
			}
			else{
				$(self).attr('src',canvas.toDataURL());
			}
		}
	});
};

$.fn.removeGray = function(){
	return $(this).each(function(){
		var s = $(this).data('original');
		log(s);
		if(s){
			if(!this.src){
				$(this).css('backgroundImage', "url("+s+")");
			}
			else{
				$(this).attr('src', s);
			}
		}
	});
};



// 
function channel(p){
	if(typeof p !== 'object'){
		if(!p || p.length === 0){
			p = location.hash;
		}
		if(!p || p.length === 0){
			p = location.search;
			// Safari bug the location is wrong when using pushState
			if(document.URL&&p!==document.URL.replace(/^[^?]*/,''))
				p = document.URL.replace(/^[^?]*/,'');
		}
		var a={},m = p.replace(/.*[#\?]/,'').match(/([^=\/\&]+)=([^\/\&]+)/g);
		if(m){
			for(var i=0;i<m.length;i++){
				var b = m[i].split('=');
				a[b[0]] = decodeURIComponent( b[1] );
			}
		}
		return a;
	} else {
		// create a string of parameters
		var a =[];
		for(var x in p){if(p.hasOwnProperty(x)){
			a.push(x + '=' + encodeURIComponent(p[x]).replace(/%20/g,' '));
		}}
		return "#"+ a.join('&');
	}
};

/**
 * Change the channel
 */
function change(hash){
	if(typeof hash=== 'object'){
		hash = channel(hash);
	}
	
	log(hash);
	
	/*
	if(!!history.pushState){
		// Goodbye hashchange, you weren't interoperable with my server but you did create a nice UX.
		// Is this a change in location?
		var s = window.location.search;
		var href = hash.replace('#','?').replace('/title','&title');
		history.pushState( {}, channel(hash).title, href );
		// Safari doesn't update our search string
		$(window).trigger('popstate');
		return false;
	}
	*/

	window.location.hash = hash;
}



$(function(){

	/**
	 * Foursqare api
	 */
	var foursquare_api = {
		client_id : "I4YQFCWIUWIFV1WHDXW1KSJMUCOLVBD1AJMGH3LCLK2JS5L0",
		client_secret : "1BVLAMZIQCPNPGFC5HLB2OJCFBO0JB0U42GS0MF1C0KOG4ER",
		query : "coffee",
		limit : 20
	};

	/**
	 * Variables
	 * coords : object, holds longitude and latitude,
	 * map: the map object
	 * view : string, preference of the list vs map
	 * position: position is the current scene which is playing
	 * path : object, the Microsoft.maps.directions object
	 * scenes: is the array of scenes we are toggling
	 */
	var coords = null,
		map = null,
		view = 'list',
		position = false,
		path = null,
		places = [],
		scenes = [
		{
			title:"Subway", 
			description : "Go to a Subway",
			query : "subway train station",
			icon : "images/subway_map_icon_sml.png",
			video:"scenes/Subway",
			poster:"scenes/Subway.png",
			className: "subway"
		},
		{
			title:"Groceries", 
			description : "Go to a Grocery shop",
			query : "groceries shop",
			icon : "images/grocery_map_icon_sml.png",
			video:"scenes/Groceries",
			poster:"scenes/Groceries.png",
			className: "grocery"
		},
		{
			title:"Casino",
			description:"Go to a Casino",
			query : "casino",
			icon : "images/casino_map_icon_sml.png",
			video:"scenes/Casino",
			poster:"scenes/Casino.png",
			className: "casino"
		}
	];

	$(scenes).each(function(i){

		/**
		 * Add the images to the 
		 */
		if(this.poster){

			// add button to the main page
			$("<button><div><span>Step "+(i+1)+"</span><h2>"+this.description+"</h2><p>Run to a "+ this.title  +" to unlock the "+ (["first","second","third"][i])  +" hidden trailer</p></div></button>")
//				.css({backgroundImage:"url("+this.image+")"})
				.addClass(this.className)
				.data(this)
				.data("index", i)
//				.append('<video poster="'+this.image+'" controls/>')
				.appendTo("section#page_menu");
			
			// Add thumbnail the main page
			$("<div><img src='"+this.poster+"'/></div>")
				.data(this)
				.data("index", i)
				.addClass(this.className)
				.appendTo("section#page_menu header.unlocked")
				.find('img')
				.grayScale();
		}
	});


	/**
	 * Listen Out for page navigation
	 */
	$(window).bind('hashchange popstate', function(){
		var p = channel();

		if(p.scene){
			
			var scene = scenes[p.scene];

			seek(p.scene);

			$("section#page_locations, section#page_map")
				.find('h1').text(scene.title).end();
			
			$(".scene_number").html(["first", "second", "third"][p.scene]);

			// Load the video
			var $v = $("section#page_video div."+scene.className+"_vid").show().siblings("div").hide().end();
			
			try{
				$v.get(0).load();
			}catch(e){}

			if(p.page === "video"){
				$(window).trigger("unlock", p.scene);
			}

		}

		// Stop any videos playing in the background
		$("video").each(function(){
			if(!(this.paused||this.ended)){
				this.pause();
			}
		});

		// default page
		if(!p.page){
			p.page = "start";
		}

		// add page name to body class
		$("body")
			.attr("class","")
			.addClass(p.page);

		var $t = $("section#page_"+p.page).fadeIn();
		$t.siblings("section").removeClass("show").hide();
		setTimeout(function(){$t.addClass("show")},100);
	});	



	/**
	 *  START PAGE
	 */
	$("body.start").live('click',function(){
		change({page:"menu"});
	});


	/**
	 * MENU PAGE
	 */
	$("section#page_menu button, section#page_menu header div").click(function(){

		var id = $(this).data("index");

		if($(this).hasClass('unlocked')){
			change({page:'video', scene: id } );
		}
		else{
			change({page:'locations', title:$(this).data('title'), scene:id});
		}
	});


	/**
	 * LOCATION PAGE
	 */
	$("section#page_locations header a:not(.selected)").click(function(){
		change({page:'map', title:channel().title, scene:channel().scene});
	});
	$("section#page_locations ol li button").live('click', function(){
		// fake the coordinates
		var place = $(this).parent("div").data();
		coords = {
			latitude : place.location.lat,
			longitude : place.location.lng
		};		
	});

	/**
	 * MAP PAGE
	 */
	$("section#page_map header a:not(.selected)").click(function(){
		change({page:'locations', title:channel().title, scene:channel().scene});
	});


	/**
	 * VIDEO
	 */
	$("section#page_video div").click(function(){
		var v = $("video", this).get(0);
		if(v.paused){
			v.play();
			log("play");
		}
		else {
			log("pause");
			v.pause();
		}
	});
	
	
	
	/**
	 * Listen Out for video unlocking
	 */
	$(window).bind('unlock', function(i,scene){

		$("section#page_menu button")
			.filter(function(j){
				return j==scene;
			})
			.add("."+scenes[scene].className)
			.add("html")
			.removeClass("locked")
			.addClass("unlocked")
			.find('> img')
			.removeGray();
	});



	(function self(){
		// if the last coords was manual then exit
		if(coords&&coords.manual){
			// exit this polling
			return;
		}
		
		// Get users location
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(r){
				coords = r.coords;
			}, function(){
				alert('Halt!... enable Geolocation tracking!... and refresh teh site');
			});
		} else {
			alert('Halt!... enable Geolocation tracking!');
		}

		setTimeout(self,60000);

	})();
	
	(function self(){
	
		if(coords){
			// We are ready
			$(window).trigger("hashchange");
		}
		else{
			setTimeout(self,1000);
		}
	})();


	/**
	 * Has the coords changed?
	 */
	(function(){
		var lastcoords;

		(function self(){
			
			// has the position changed?
			if (coords&&coords!==lastcoords){
			
				// update the list of results
				updateList();
				
				// Log
				log(coords);

				/**
				 * Initiate the map if its not available.
				 */
				if(!map&&document.getElementById("map")){
					// Initialize the map
					initiateMap();
					
				}
		

				// Has the distance changed by over 1km since we last checked?
				// dd = difference in distance
				var dd = (lastcoords?distance(coords,lastcoords):1);

				// loop through all the current places and see if there is one closeby
				for( var i=0;i<places.length;i++){
					var d = distance(coords, places[i].location.lat + ',' + places[i].location.lng ); 
					if( d < 0.05){
						change({page:'video', scene: position } );
					}
				}

				lastcoords = coords;

			}
			
			setTimeout(self, 500);
		
		})();
	})();

	
	/**
	 * Seek
	 * Seek finds all the locations that match the scene position passed in as the first argument
	 */
	function seek(pos){
	
		$("section#page_locations ol").html("");

		// get info about the current scene
		var self = scenes[pos];
		
		if(pos !== position){
			// zero places
			places = [];
			
			position = pos;
		}

		//Log
		log("Seek: " + self.query);
		
		// Update foursquare coords
		foursquare_api.ll = [coords.latitude, coords.longitude].join(',');

		foursquare_api.query = self.query;

		// Get results which match your position
		// Path
		var path = 'https://api.foursquare.com/v2/venues/search?' + $.param(foursquare_api);

		// This netowrks IP Security policy doesn't permit us to use foursquare... how rubbish is that?
		// $.getJSON(path+'&callback=?',function(r){
		// Using my proxy instead.
		$.getJSON('http://sandbox.knarly.com/proxy.php?path='+window.encodeURIComponent(path)+'&callback=?', function(r){

			// Loop through the results
			for(var i=0,a=r.response.groups[0].items;i<a.length;i++){

				var place = a[i],
					bool = false;

				for(var j=0;j<places.length;j++){
					if(places[j].id === place.id){
						bool = true;
						break;
					}
				}

				// already exists?
				if(bool){
					break;
				}
				
				// Store results so that we can check the users position to find out whether they are on top of some of the places.
				places.push(place);

				// Push to map
				addToMap(place,self);
			}

			updateList();
		});
	}
	
    

    function drawMap(){
    	var p = channel(),
    		loc = p.map.split(",");

		$('#map').toggle().siblings().hide();
    	
    	var route = function(){
    		// Build nav'igator

			if (!path) {
				path = new Microsoft.Maps.Directions.DirectionsManager(map);
			}
			path.resetDirections();

			// Set Route Mode to walking 
			path.setRequestOptions({
				routeMode: Microsoft.Maps.Directions.RouteMode.walking
			});
			
			// START
			var start = new Microsoft.Maps.Location(coords.latitude, coords.longitude),
				end = new Microsoft.Maps.Location(parseFloat(loc[0]), parseFloat(loc[1]));

			path.addWaypoint(new Microsoft.Maps.Directions.Waypoint({
				address: "My location",
				location : start
			}));

			// FINISH
			path.addWaypoint(new Microsoft.Maps.Directions.Waypoint({
				address: p.address,
				location : end 
			}));


			// Set the element in which the itinerary will be rendered
			path.setRenderOptions({ itineraryContainer: document.getElementById('path') });

			path.calculateDirections();

			// change zoom because sometime this doesn't work
			setTimeout(function(){
				if(map.getZoom()<14){
					map.setView({bounds: (new Microsoft.Maps.LocationRect.fromLocations(start, end))});
					map.setView({zoom:map.getTargetZoom()-1});
				}
			},1000);
    	};
    	
    	// Load in the directions module
    	if( !path ){
	    	Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: route });
	    }
	    else {
	    	route();
	    }
    }
    
    /**
     * Update list with new places and order the results
     */
    function updateList(){
    
    	var $ol = $("section#page_locations ol");
    
    	// Order list
    	for(var i=0;i<places.length;i++){
			// get the distance
			places[i].distance = distance(places[i].location.lat+','+places[i].location.lng, coords);
    	}
    	
		// order places
		// Add result to #list
		places.sort(function(a,b){
			if(a.distance > b.distance){
				return 1;
			}
			else if (a.distance < b.distance){
				return -1;
			}
			else {
				return 0;
			}
		});
		
		$ol.html("");
		
		log(places);

		for(var i=0;i<places.length;i++){
			$ol.append($("<div><h3>"+ places[i].name +"</h3><p>"+ [places[i].location.address, places[i].location.city, places[i].location.state].filter(function(a){ return !!a;}).join(', ') + "</p><span>" + ((places[i].distance*0.66).toFixed(2))  + " mi</span><button></button></div>").data(places[i]).wrap("<li />").parent());
		}	
    }
    


    /**
     * Initiate Map
     */
	function initiateMap(){
	    map = new Microsoft.Maps.Map(document.getElementById("map"),{
	    	credentials:"AoSrcom8Z5tMErQPB6928a9S_qwp9T9Wy8Tt9bF50yITgerNDZqj35Y7LOabpuxw", 
	    	mapTypeId: Microsoft.Maps.MapTypeId.road,
	    	zoom : 16,
	    	center : new Microsoft.Maps.Location(coords.latitude, coords.longitude)
	    });

		// Add the users position to the map
		// allow them to drag it to a new position to fake the action of changing location
        var pin = new Microsoft.Maps.Pushpin(map.getCenter(), {
        	draggable: true,
        	icon: "images/red_dot.png",
        	zIndex : 1000
        });
		Microsoft.Maps.Events.addHandler(pin, 'dragend', function(e){
			
			// update global coords
			coords = pin.getLocation();
			
			// manual
			coords.manual = true;
		});		           
        
        map.entities.push(pin);
	}
	
	
	/**
	 * Add to Map
	 */
	function addToMap(place, scene){
		// Add result to #map
		var point = new Microsoft.Maps.Location(place.location.lat, place.location.lng),
			pin = new Microsoft.Maps.Pushpin(point, {
				icon: scene.icon,
				width: 50,
				height: 50,
				draggable : false
			});

		(function(){
            // Create the infobox for the pushpin
            var pinInfobox = new Microsoft.Maps.Infobox(pin.getLocation(), 
                {title: place.name, 
                 visible: false,
                 offset: new Microsoft.Maps.Point(0,15)});

            // Add handler for the pushpin click event.
            Microsoft.Maps.Events.addHandler(pin, 'click', function(){ pinInfobox.setOptions({ visible:true }); });

            // Hide the infobox when the map is moved.
            Microsoft.Maps.Events.addHandler(map, 'viewchange', function(){ pinInfobox.setOptions({ visible: false }); });

		})();

		map.entities.push(pin);

	}
});



/*	.bind("launch", function(){
		var p = channel();

		// Hide the other siblings
		$(this).addClass("selected").siblings().slideUp().removeClass("selected");

		// Have we found a location like this?
		if(!$(this).data('venue')){
		
			// Open up the list view of all the locations for this.
			// has this been done before?
			var i = $("section article").index(this);
			
			
			if( i !== position ){
				seek(i);
			}

			if(p.map){
				drawMap();
			}
			else{
	
				// toggle the default view
				$('#list').show().siblings().hide();
			}
			$(".holder").slideDown();
		}
		else {
			$(this).addClass("success").removeClass('pending');
			$(".holder").slideUp();
			//.css('backgroundImage',"url("+$(this).data("original")+")");

			// Change title
			$("h2",this)
				.addClass("success")
				.html("Well done!, You found "+ $(this).data('venue') + " and unlocked the new video");
				
			// Load the video
			var $v = $('video', this).html('').show(), 
				ext = {
					webm: 'video/webm; codecs="vp8, vorbis"',
					mp4	: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					ogv	: 'video/ogg; codecs="theora, vorbis"'
				};
			for( var x in ext ){
				$('<source src="'+$(this).data('video')+'.'+x+'">').attr('type',ext[x]).appendTo($v);
			}
		}
	});
*/