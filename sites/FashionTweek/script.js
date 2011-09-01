
	// Search from twitter pic tweets which match those tags
		// display tags vertically and all the matching tweets and their pictures horizontally
	// order those tags geographically
	// allow us to change our location and change the order of the tags by geolocational relevance

$(function(){

	function log() {
		if (typeof(console) === 'undefined'||typeof(console.log) === 'undefined') return;
		if (typeof console.log === 'function') {
			console.log.apply(console, arguments); // FF, CHROME, Webkit
		}
		else{
			console.log(Array.prototype.slice.call(arguments)); // IE
		}
	}

	var coords = null;

	// Get users location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(r){
			// save the users position
			coords = r.coords;
			log(coords);
		}, log);
	} else {
		log('!navigator.geolocation');
	}
	
	var FashionCapitals = {
		// Main fashion capitals
		NewYork : '40.7143528,-74.0059731', //d88f41d246be3dcb
		London : '51.5002,-0.1262',
		Milan : '45.4637,9.1882', 
		Paris : '48.8566,2.3522',
		// also these are doing something too.
		Tokyo : '35.6895,139.6917',
		BuenosAires : '-34.6084,-58.3732',
		Toronto : '43.6535,-79.3839'
	};

	// loop through each place and gets pic tweets
	for( var CapitalCity in FashionCapitals ){
		// Append
		(function($div){
			// get pictwits
			// Can't get "pic.twitter.com" because users have to be following the other to see their pics.
			$.getJSON("http://search.twitter.com/search.json?q=twitpic%20Fashion&geocode="+FashionCapitals[CapitalCity]+",10mi&callback=?", function(r){
				// build the element record
				for(var i=0;i<r.results.length;i++){
					var m = r.results[i].text.match(/http\:\/\/(twitpic.com|t\.co)\/\w+/);

					if(m&&m[0]&&unique(m[0])){
						var $img = $("<figure><div class='img'></div><figcaption>"+r.results[i].text+"</figcaption></figure>").appendTo($div).find(".img");
						$img.load("http://sandbox.knarly.com/proxy.php?path="+ m[0] + " #photo-display");
					}
				}
				// 
			});
		})($("<section id='"+ CapitalCity +"'><header><h2>"+ CapitalCity.replace(/([a-z])([A-Z])/,'$1 $2') +"</h2></header><div class='slider'></div></section>").appendTo("div.container").find("div.slider"));
	}

	// Image unique?
	var unique = (function(){
		var a = [];
		return function(s){
			return ( a.indexOf(s)>-1 ? true : !a.push(s) );
		};
	})();
	

	/**
	 * <ALTERNATIVE CODE>, you say tomato, i say potato!

	TWITTER PLACES
	--------------
	$.getJSON('http://api.twitter.com/1/geo/similar_places.json?lat=40.7143528&long=-74.0059731&name=FashionWeek&callback=?', function(r){ 

		//TWITPIC
		//--------
		for each restult get twitpic
		http://api.twitpic.com/2/place/show.json?id=<TWITTER PLACE_ID>, e.g. d88f41d246be3dcb = New York
	});
	*/
	
	$("#switchlocation").live("click",function(){
		$("body").toggleClass("thumbs").toggleClass("locationpicker");
	});

	$("body:not(.thumbs) section").live("click touchstart",function(e){
	
		var $section = $(this);

		setTimeout(function(){
			$("#switchlocation").trigger('click');
		},300);
		
		setTimeout( function(){
			// pick a random place that the user has moved to.
			
			// create a new element at the top of the container, 
			// increase the size, at the same time as floating the old element into this position.
			// random section $section = $("section").eq(Math.ceil(Math.random()*($("section").length-1))),
			
			var height = $section.outerHeight(),
				width = $section.outerWidth(),
				$placeholderTop = $("<div></div>").css({height:0}).prependTo(".container").animate({height:height+"px"},"slow"),
				$placeholderSection = $("<div></div>").insertAfter($section).css({height:height+"px"}).animate({height:0},"slow");
			
			log($section);
			
			$section.css({position:'absolute', top: $section.position().top+"px", zIndex : 100000, width: width+"px" }).animate({top:$("section:first-of-type").position().top+"px"},"slow", function(){
	
				$(this).clone().removeAttr("style").prependTo(".container");
				$(this).remove();
				$placeholderTop.remove();
				$placeholderSection.remove();
			});
					
		},1000);

	});

});
	

function distance(latlon1, latlon2){

	var lat1 = latlon1.split('.')[0],
		lon1 = latlon1.split('.')[1],
		lat2 = latlon2.split('.')[0],
		lon2 = latlon2.split('.')[1];
	
	var R = 6371; // km
	var dLat = (lat2-lat1).toRad();
	var dLon = (lon2-lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
}
