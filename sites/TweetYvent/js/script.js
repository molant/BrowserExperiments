if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
var viewportmeta = document.querySelectorAll('meta[name="viewport"]')[0];
if (viewportmeta) {
viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
document.body.addEventListener('gesturestart', function() {
viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
}, false);
}
}

//prevent console.logs from breaking script in wp7
try { console.log("console"); }
catch(e){ console={log: function(){ return; }}}


//create our own namespace
(function(){

$(window).load(function(){
	if (window.MBP) MBP.hideUrlBar();
	
	//delay our screensizes call until the url bar has time to move
	setTimeout(function(){
		tweetYvent.setScreenSizes();
	},1000);
		
});

$(window).resize(function(){
	//hacky fix for firefox's need to reset our mainScroll scrollTop when resizing the window
	if (navigator.userAgent.match(/Firefox/i) && tweetYvent.globals.mainScroll) {
		tweetYvent.globals.mainScroll.y = tweetYvent.globals.mainScroll.save;
		tweetYvent.globals.mainScroll.scrollPane.scrollTop = tweetYvent.globals.mainScroll.save;
	}
});


$(document).ready(function(){

	tweetYvent.initSelectors();
		
	tweetYvent.setScreenSizes();
	
	tweetYvent.loadView();
	
		
});

$.ajaxSetup ({
	cache: false
});

DDE.TweetYvent = function(){

	var that = this;
	that.globals = {
		connected: false,
		RETRY_INTERVAL: 10000,
		socketInterval: null,
		nodeServer: "http://"+nodeDomain+":"+nodePort,
		maxRainPerEvent: 10,
		cssAnimationOn: false,
		lastBodyHeight: 0,
		lastWindowWidth: 0,
		lastWindowHeight: 0,
		chartHeight: 0,
		tweetUpdates: 0,
		tweetsLoaded: 0,
		currView: null
	};
	
	this.reorderScheduleJSON = function() {
		var designers = {};
		var designerCount = 0;
		
		for (dayGroup in DDE.allEventsSchedule) {
			var day = DDE.allEventsSchedule[dayGroup];
			for (timeGroup in day) {
				var time = day[timeGroup];
				var count = time.length;
				for (var i=0; i<count; i++) {
					
					var event = time[i];
					designers[event.keyword] = event;
					designers[event.keyword].newTweets = 0;
					designers[event.keyword].newPhotos = 0;
					designers[event.keyword].alphaIndex = DDE.designerLookup[event.keyword]['alpha_index'];
					designerCount++;
				}
			}
			
		}
		
		that.globals.designerCount = designerCount;		
		return designers;
	};
		
	this.allEventsDesigners = this.reorderScheduleJSON();
	
	this.watchWindowSizes = function() {
		var tg = that.globals;
		tg.lastWindowWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
		tg.lastWindowHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
		
		//console.log("document.documentElement.clientHeight: "+document.documentElement.clientHeight);
		//console.log("document.documentElement.clientWidth: "+document.documentElement.clientWidth);
		//console.log("screen.width: "+screen.width);
		//console.log("screen.height: "+screen.height);
		//console.log("window.innerHeight: "+window.innerHeight);
	},
	
	this.browserCheck = function(){
		var tg = this.globals;
				
		if (navigator.userAgent.match(/Blackberry/i)) {
			if(navigator.userAgent.match(/\/6\./i)) {
				tg.$body.addClass('bb6');
			} else {
				tg.$body.addClass('bb5');
			}
		}
		
		if (navigator.userAgent.match(/Windows/i)) {
			tg.Windows = true
			
			if (navigator.userAgent.match(/MSIE/i)) {
				tg.MSIE = true;
			}
			
		}
		
		if (navigator.userAgent.match(/webkit/i)) {
			tg.Webkit = true;
		}
		
		if (navigator.userAgent.match(/chrome/i)) {
			tg.Chrome = true;
		} 
		
	},
	
	this.compareBiggest = function(a,b) {
		return b-a;
	}
	
	$(window).hashchange( function(){
		var tg = that.globals;
		console.log(tg);
		//override hashchange event with click event
		if (tg.noHashEvent) { return false; }
		
		var hash = location.hash;
		console.log("hashchange");
		var match = hash.match(/\/[A-Za-z1-9-]*\//);
		var hashBase = match ? match[0] : '';
		
		console.log(hashBase);
		
		//pointer is our sub-subdirectory e.g. marcjacobs of /designers/marcjacobs/
		var pointerPattern = new RegExp('#!'+hashBase);
		
		var pointer = location.hash.replace(pointerPattern, '').replace(/\//, '');
		
		console.log("pointer: "+pointer);
		
		switch(hashBase){
			
			case "/schedule/":
				//scheduleView();
				console.log(hash);
				console.log(pointer);
				
				//default
				
				tg.$body.removeClass("designers");
				tg.$body.addClass("schedule");
				tg.$scheduleTab.addClass("selected");
				tg.$designersTab.removeClass("selected");
				
				if (tg.singleViewMode && !tg.scheduleNavSingleView) tg.navView.showScheduleView();
				if (pointer && pointer != '' && pointer.match(/day/i)) {
					tg.navView.selectedDayItem = pointer;
					tg.navView.scrollScheduleView();
					
				} else if (pointer || pointer != '') {
					//undo selected status with animation
					if (tg.lastWindowWidth >= 992) {
						if (tg.navView.selectedNavItem) {
							tg.navView.navHoverOff(tg.navView.selectedNavItem);
							tg.navView.navHoverOff(tg.navView.selectedNavItem+'-');
						}
					}
					
					tg.navView.selectedNavItem = pointer;
					tg.navView.setSelectedNavItem(tg);
					tg.mainView.selectedDesigner = pointer;
					tg.navView.loadMainViewDesigner(tg);
				} else {
					//just toggling schedule tab
					//setTimeout(function(){ tg.navView.resetScheduleScroll(tg); }, 200);
					$('#schedulenav')[0].scrollTop = 0; 
					tg.navView.resetScheduleScroll(tg); 				}
				
				break;
				
			case "/designers/":
				
				//default toggle tabs
				tg.$body.removeClass("schedule");
				tg.$body.addClass("designers");
				tg.$scheduleTab.removeClass("selected");
				tg.$designersTab.addClass("selected");
				
				
				if (pointer && pointer != '' && pointer.match(/alpha/i)) {
					tg.navView.selectedDayItem = pointer;
					tg.navView.scrollScheduleView();
					
				} else if (pointer && pointer != '') {
				
					//undo selected status with animation
					if (tg.lastWindowWidth >= 992) {
						if (tg.navView.selectedNavItem) {
							tg.navView.navHoverOff(tg.navView.selectedNavItem);
							tg.navView.navHoverOff(tg.navView.selectedNavItem+'-');
						}
					}
					
					tg.navView.selectedNavItem = pointer;
					tg.navView.setSelectedNavItem(tg);
					tg.mainView.selectedDesigner = pointer;
					tg.navView.loadMainViewDesigner(tg);
				} else {
					$('#schedulenav')[0].scrollTop = 0; 
					tg.navView.resetScheduleScroll(tg); 
					
				}
				
				break;
				
			default:
				tg.navView.selectedNavItem = 'all';
				tg.navView.setSelectedNavItem(tg);
				tg.mainView.selectedDesigner = 'all';
				tg.navView.loadMainViewDesigner(tg);
				break;
		}
		
		//if (tg.mainView.selectedDesigner) tg.navView.loadMainViewDesigner(tg);
	});
        
};

DDE.TweetYvent.prototype = {
    
	initSelectors: function() {
		var tg = this.globals;
		tg.$body = $('body');
		tg.$nav = $('#nav');
		tg.$scheduleNav = $('#schedulenav');
		tg.$main = $('#main');
		tg.$modules = $('#modules');
		tg.$mainSection = $('#mainsection');
		tg.$content = $('div.content');
		tg.$header = $('header');
		tg.$footer = $('#footer');
		tg.$contentNav = $('#contentnav');
		tg.$detailNavContainer = $('.tabnav.detailnav');
		tg.$h3DesignerName = $('h3.designer .designer-name');
		tg.$dayslist = $('#dayslist');
		tg.$alphalist = $('#alphalist');
		tg.$loading = $('#loading');
		
		if($('.ie7 body')[0]) tg.ie7 = true;
		
		this.browserCheck();
		
		//Modernizr Feature Detection
		//Todo: fix DDE.cssAnimation to work with all vendor prefixes
		if (Modernizr.cssanimations && tg.Webkit) tg.cssAnimationOn = true;
		if (Modernizr.csstransitions && Modernizr.csstransforms3d && tg.Webkit) tg.cssTransitionOn = true;
	
		if (Modernizr.touch) tg.touch = true;
		
		//cache global selectors
		tg.$headerB = $('header b');
				
	},
	
	activeUserCheck: function() {
		var tg = this.globals;
		tg.$body.bind(DDE.touchMove, function(){
			tg.stillActive = true;
		});
		
		var check = false;
		
		var activeUserInterval = setInterval(function(){
			if (!check) {
				tg.stillActive = false;
				check = !check;
			} else {
				if (!tg.stillActive) {
					console.log("user is not active. disconnecting socket");
					tg.socket.disconnect();
					tg.forceDisconnect = true;
					clearInterval(activeUserInterval);
					activeUserInterval = null;
					
					//todo: create button and use this to reconnect user
					/*
					setTimeout(function(){
						tg.socket.connect();
					}, 10000);
					*/
				} else {
					check = !check;
				}
			}
			
		}, 60000); //wait for one minute of activity before forcing clients to disconnect
	},
	
	setScreenSizes: function() {
		var tg = this.globals;
		
		//Save's the window dimensions to a global variable
		this.watchWindowSizes();
		
		if (tg.mainScroll && !tg.touch) {
			tg.mainScroll.refresh();
		}
		
		if (tg.scheduleScroll && !tg.touch) {
			tg.scheduleScroll.refresh();
		}
		
		//help the mobile screen from reshowing the url bar after we hide it
		tg.$content[0].style['min-height'] = tg.lastWindowHeight + 'px';
		
		
		//768
		if (tg.lastWindowWidth >= 768) { 
		
			tg.$dayslist[0].style.display = '';
			tg.$alphalist[0].style.display = '';
			tg.$alphalist[0].style.zoom = 1;
		}
		
		
		if (tg.lastWindowWidth < 992) {
		
			tg.singleViewMode = true;
			
			tg.$modules[0].style.paddingBottom = '';
		
			if (tg.touch && tg.initViewLoaded) {
				tg.navView.resetTouchScheduleLinks(tg);
				if (tg.mainScroll) tg.mainScroll.destroy();
				tg.mainScroll = null;
				
				if (tg.scheduleScroll) tg.scheduleScroll.destroy();
				tg.scheduleScroll = null;
				
				tg.navView.disableFancyNav(tg);
				
			} else if (tg.initViewLoaded) {
			
				if (tg.mainScroll) {
					tg.mainScroll.disableScrollbars();
					tg.mainScroll.destroy();
					tg.mainScroll = null;
				}
				if (tg.scheduleScroll) {
					tg.scheduleScroll.disableScrollbars();
					tg.scheduleScroll.destroy();
					tg.scheduleScroll = null;
				}
				tg.navView.disableFancyNav(tg);				
			}
			
			if (tg.ie7) {
				//DDE.setMaxHeight(tg.$body[0], height);
				tg.$content[0].style.height = "auto";
				tg.$scheduleNav[0].style.height = "auto";
				tg.$modules[0].style.height = "auto";
			}
		}
		
		//992
		if (tg.lastWindowWidth >= 992) {
		
			this.resetBodyScroll();
			
			 if (tg.touch && tg.initViewLoaded) {
				tg.navView.resetTouchScheduleLinks(tg);
				
				if (!tg.mainScroll) tg.mainScroll = new iScroll('mainsection');
				tg.mainScroll.refresh()
				
				tg.$scheduleNav[0].style['margin-right'] = '0px';
				if (!tg.scheduleScroll) tg.scheduleScroll = new iScroll('schedulenav');
				setTimeout(function(){
					tg.scheduleScroll.refresh();
				}, 200);
				
				setTimeout(function(){
					tg.navView.enableFancyNav(tg);
				}, 600);	

			} else if (tg.initViewLoaded) {
			
				if (!tg.mainScroll) tg.mainScroll = new this.CustomScroll(tg.$mainSection, tg);
				tg.mainScroll.refresh()
				if (!tg.scheduleScroll) tg.scheduleScroll = new this.CustomScroll(tg.$scheduleNav, tg);
				tg.scheduleScroll.refresh();
				
				setTimeout(function(){
					if (!tg.fancyNavEnabled) tg.navView.enableFancyNav(tg);
				}, 600);
				
			}
		
			if (tg.$schedulePopup) {
				tg.$schedulePopup.unbind();
			}
			
			if (tg.singleViewMode) {
				tg.navView.resetSingleViewMode(tg);
			}
			
			if (tg.ie7) {
				//DDE.setMaxHeight(tg.$body[0], height);
				DDE.setMaxHeight(tg.$content[0], tg.lastWindowHeight - 145);
				DDE.setMaxHeight(tg.$scheduleNav[0], tg.lastWindowHeight - 215);
				DDE.setMaxHeight(tg.$modules[0], tg.lastWindowHeight - 210);
			}
			
		} 
		
		//1382	
		if (tg.lastWindowWidth >= 1382) { 
		
			tg.chartHeight = (DDE.maxHeight+20)*2.5;
		
		} 
		
		//1802
		if (tg.lastWindowWidth >= 1802) { 
		
			tg.chartHeight = (DDE.maxHeight+20)*3.5; 
		
		
		} 
		
		
		
	},
	
	resetBodyScroll: function () {
		var tg = this.globals;
		
		if (document.documentElement && document.documentElement.scrollTop) {
			//IE
			document.documentElement.scrollTop = 0;
		} else {
			$('html')[0].scrollTop = 0;
			tg.$body[0].scrollTop = 0;
		}
	},
	
	loadView: function() {
		
		var tg = this.globals;
		//Todo: remove this for production
		
		var pathname = location.pathname;
		//fix consistency between pathname structure across browsers
		pathname = pathname.replace(/^\//, '');
		
		//todo: remove for production
		var extra = '';
		if (pathname.match(/node-projects\/tweet-event-map\/fashion-twitter-www/)) {
			extra = 'node-projects/tweet-event-map/fashion-twitter-www/';
			pathname = pathname.replace(/node-projects\/tweet-event-map\/fashion-twitter-www\//, '');
		}
		
		//this happens if someone came here from a non-javascript url
		if (pathname.match(/designers/g)) {
			
			//since they have javacript, we should rewrite that location to a hash
			window.location.href = 'http://'+location.hostname+'/'+extra+'#!/'+ pathname;
			pathname = '/designers/';
		} else if (pathname.match(/schedule/g)) {
			window.location.href = 'http://'+location.hostname+'/'+extra+'#!/'+ pathname;
			pathname = '/schedule/';
		}
		
		//check if the url contains a hash bookmark
		//hashbase would be our sub-directory. e.g. /designers/
		var hashBase = '';
		if (location.hash ) {
			var match = location.hash.match(/\/[A-Za-z1-9-]*\//);
			hashBase = match ? match[0] : '';
		} 
		
		//pointer is our sub-subdirectory e.g. marcjacobs of /designers/marcjacobs/
		var pointerPattern = new RegExp('#!'+hashBase);
		var pointer = location.hash.replace(pointerPattern, '').replace(/\//, '');
		console.log("pointer: "+pointer);
		if (!pointer || pointer == '') {
			pointer = 'all';
			tg.$main.addClass('all');
		}
		
		switch(hashBase){
			
			case "/schedule/":
				//scheduleView();
				
				if (pointer.match(/day/i)) {
				
					tg.initialLoading = true;
					
					tg.navView = new this.NavView(this);
					tg.mainView = new this.MainView(this);
					
					tg.navView.selectedDayItem = pointer;
					tg.navView.selectedNavItem = 'all';
					tg.navView.scrollScheduleView();
					
				} else {
				
					if (pointer == 'all' && tg.lastWindowWidth < 992) {
						tg.initialLoading = true;
					}
					
					tg.navView = new this.NavView(this, pointer);
					tg.mainView = new this.MainView(this, pointer);
				}
				
				if (( pointer == 'all' || pointer.match(/day/i))  && tg.lastWindowWidth < 992) {
					tg.initialScheduleLoad = true;
					tg.navView.selectedNavItem = 'all';
					tg.navView.showScheduleView();
				} else if (tg.lastWindowWidth < 992 ) {
					tg.initialDesignerLoading = true;
					tg.$body.removeClass("default");
					tg.$body.removeClass("start");
				}
				
				break;
				
			case "/designers/":
				//console.log("test");
				

				if (pointer.match(/alpha/i)) {
				
					tg.initialLoading = true;
					
					tg.navView = new this.NavView(this);
					tg.mainView = new this.MainView(this);
					
					tg.navView.selectedNavItem = 'all';
					
					tg.$designersTab.addClass('selected');
					tg.$scheduleTab.removeClass('selected');
					tg.$body.removeClass("schedule");
					tg.$body.addClass("designers");	
					
					tg.navView.selectedDayItem = pointer;
					tg.navView.scrollScheduleView();
					
				} else {
				
					if (pointer == 'all' && tg.lastWindowWidth < 992) {
						tg.initialLoading = true;
					}
				
					if (pointer != 'all' && tg.lastWindowWidth < 992) {
						tg.initialDesignerLoading = true;
					} 
					tg.navView = new this.NavView(this, pointer);
					tg.mainView = new this.MainView(this, pointer);
					
					if (tg.lastWindowWidth < 992 && pointer == 'all') {
						tg.navView.showScheduleView();
						tg.navView.selectedNavItem = 'all';
					}
					
					tg.$designersTab.addClass('selected');
					tg.$scheduleTab.removeClass('selected');
					tg.$body.removeClass("schedule");
					tg.$body.addClass("designers");
					tg.$body.removeClass("default");
					tg.$body.removeClass("start");
				}
				
								
				
				break;
				
			default:
				
				//var start = (new Date()).getTime();
				
				tg.initialLoading = true;
	
				tg.navView = new this.NavView(this);
				tg.navView.selectedNavItem = 'all';
				
				//var finished = (new Date()).getTime() - start;	
				//console.log("processing time NavView loaded: " + finished + " msec" );
				
				//var start = (new Date()).getTime();
				
				tg.mainView = new this.MainView(this);
				
				
				//var finished = (new Date()).getTime() - start;	
				//console.log("processing time MainView loaded: " + finished + " msec" );
				break;
			
		}
		
		tg.initViewLoaded = true;
	},
	
	makeRainClouds: function() {
		return false;
		var tg = this.globals;
		var length = tg.$tableRows.length;
		for (var i=0; i<length; i++) {
			var row = tg.$tableRows[i],
				str = '';
				
			for (var j=0; j<tg.maxRainPerEvent; j++) {
				str += '<b id="cloud'+i+'rain'+j+'" style="margin-left: '+(j*(100/(tg.maxRainPerEvent)))+'%;"></b>';
			}
			
			$(row).append(str);
		}
	},
	
	initSocketListening: function() {
		//return false;
		var that = this;
		var tg = that.globals;
		
		//TODO: set a timeout for clients that are connected too long
		
		$.getScript (tg.nodeServer+"/socket.io/socket.io.js", function(){
			
			tg.socket = new io.Socket(nodeDomain, {"port": nodePort});
			
			
			
			tg.socket.on('connect', function() {
				that.activeUserCheck();
				tg.connected = true;
				clearInterval(tg.socketInterval);
				tg.socketInterval = null;
				
				tg.$headerB.html("Connected:  ");
			});
			 
			tg.socket.on('message', function (json) {
				
				var data = JSON.parse(json);
				tg.navView.updateScreen(data, that);
				
				if (tg.mainScroll) tg.mainScroll.refresh();
				
			});
			
			tg.socket.on('disconnect', function() {
				tg.connected = false;
				console.log('disconnected');
				tg.$headerB.html("reconnecting..." + tg.RETRY_INTERVAL/1000 + " seconds.");
				retryConnectOnFailure(tg.RETRY_INTERVAL);
				tg.disconnectCycles = 0;
			});
			
			var retryConnectOnFailure = function(retryInMilliseconds) {
				tg.socketInterval = setInterval(function() {
					if (!tg.connected && !tg.forceDisconnect) {
						tg.disconnectCycles++;
						console.log("pinging server. waiting for response");
						$.get(tg.nodeServer+'/ping', function(data) {
							tg.connected = true;
							window.location.href = unescape(window.location.pathname);
							console.log("server responded. reconnecting...");
						});
					}
					if (tg.disconnectCycles >= 10) {
						clearInterval(tg.socketInterval);
						tg.socketInterval = null;
						console.log("gave up trying to connect. Come back later.")
					}
				}, retryInMilliseconds);
				
				
			}
			
			tg.socket.connect();
		}); 
	},
	
	rainAnimation: function( selector ) {
		var that = this;
		var tg = that.globals;
		var windowWidth = document.documentElement.clientWidth;
		if (tg.cssAnimationOn) {
			var rain = document.querySelector(selector);
			var animationName = 'raindrop';
			
			if (windowWidth >= 1802) animationName ='raindrop-1802';
			else if (windowWidth >= 1382) animationName ='raindrop-1382';
			else if (windowWidth >= 768) animationName ='raindrop-768';
			
			DDE.cssAnimation(rain, animationName, {speed: 800, easing: 'ease-in', complete: function(){
					//periodically redraw charts
					if (DDE.maxCount < tg.chartHeight) {
						tg.navView.redrawChart(tg);
					} else {
						if (tg.tweetUpdates > 20) tg.navView.redrawChart(tg);
					}
				}
			});
		} else {
			var $rain = $(selector);
			var distance = tg.chartHeight - 6;
			
			$rain.animate({top: distance},{duration: 800, easing: 'easeInQuad', complete: function(){ 
					$(this).css({top: -40});
					//periodically redraw charts
					if (DDE.maxCount < tg.chartHeight) {
						tg.navView.redrawChart(tg);
					} else {
						if (tg.tweetUpdates > 20) tg.navView.redrawChart(tg);
					}
				}
			});
		}
	}

	
};

DDE.TweetYvent.prototype.NavView = function( parent, selector ) {
		console.log("New Nav View Object");
		console.log(this);
		var that = parent;
		var tg = that.globals;
		
		this.$scheduleNavItems = $('div.schedule .listitem');
		this.selectedNavItem = selector ? selector : null;
		
		//cache references to tweetcount nodes in the nav list
		//this is for updating tweetcounts in realtime
		this.listCountNodes = [];
		this.listArrows = [];
		this.saveOnScreenRefs();
		
		this.enhanceUI(that);
	
		DDE.fpsCounter();
		
		//rainPerfTest();
		
		that.initSocketListening();
		
		//Smart Resize function to minimize resize function calls
		$(window).bind('smartresize', function() {
			
			//IE6, IE7, IE8 fire resize events when the body.clientHeight changes after AJAX additions.
			//A little check to prevent the smartresize code from executing in those circumstances
			if (document.documentElement.clientWidth != tg.lastWindowWidth || document.documentElement.clientHeight != tg.lastWindowHeight) {
				console.log("smartresize");
								
				that.setScreenSizes();
				
			}
			
		});
};


/*//////////////////////////////////
//
//			Main View
//
///////////////////////////////////*/


DDE.TweetYvent.prototype.NavView.prototype = {
		
	saveOnScreenRefs: function() {
		//store onScreenEvents in order
		//subtract one for the All Designers list item
		
		this.listCountNodes = [];
		this.listArrows = [];
		
		var count = this.$scheduleNavItems.length-1;
		for (var i=0; i<count; i++) {
			var listItem = this.$scheduleNavItems[i+1],
				$listCountNode = $('.tweetcount', listItem),
				$listArrow = $('.arrow', listItem);
				
			this.listCountNodes[i] = $listCountNode;
			this.listArrows[i] = $listArrow;
		}
		
	},
	
	redrawChart: function( globals ) {
		//Temporarily disabled: We may delete this in the future
		return false;
		var tg = globals;
		var count = this.$chartCountNodes.length;
	
		var arr = [], index = 0;
		for (var item in DDE.onScreenEvents) {
			arr[index] = DDE.onScreenEvents[item].tweetCount;
			index++;
		}
		arr.sort(tweetYvent.compareBiggest);
		
		var biggest = arr[0];
		DDE.maxCount = biggest/.95;
		
		if (DDE.maxCount < tg.chartHeight) {
		
			for (var i=0; i<count; i++) {
				this.$chartCountNodes[i].style.height = DDE.onScreenEvents[i].tweetCount + "px";
			}
			
		} else {
		
			for (var i=0; i<count; i++) {
				this.$chartCountNodes[i].style.height = ((DDE.onScreenEvents[i].tweetCount/DDE.maxCount)*100) + '%';
			}
		}
	
		tg.tweetUpdates = 0;
	},
	
	resetScheduleScroll: function( globals ) {
		var tg = globals;
		
		if (!tg.scheduleScroll) { return false; }
		
		tg.scheduleScroll.y = 0;
		if (tg.scheduleScroll.save) tg.scheduleScroll.save = 0;
		if (tg.scheduleScroll._pos) tg.scheduleScroll._pos(0,0);
		
		tg.scheduleScroll.refresh();
	},
	
	updateScreen: function( data, parent ) {
		var that = parent;
		var tg = that.globals;
		if (data.keywords.length > 1) { //we send a 'default' keyword that is ignored
			tg.tweetUpdates++;
			
			var keywordCount = data.keywords.length;
			var classStr = '', firstColor = '';
			
			//update tweetCounts for each keyword represented
			for (var i=1; i<keywordCount; i++) {
				var keyword = data.keywords[i],
					eventIndex;
				
				//match keyword to event array and get index
				eventIndex = that.allEventsDesigners[keyword].index;
				
				/* Todo: update this for new schedule list
				//raindrops
				var rainSelector = '#cloud'+eventIndex+'rain'+DDE.onScreenEvents[eventIndex].rainIndex;
				that.rainAnimation(rainSelector);
				
				if (DDE.onScreenEvents[eventIndex].rainIndex == (tg.maxRainPerEvent-1) ) DDE.onScreenEvents[eventIndex].rainIndex = 0;
				else DDE.onScreenEvents[eventIndex].rainIndex++; 
				
				*/
				
				//update tweetCount labels
				that.allEventsDesigners[keyword].tweet_count++;
				that.allEventsDesigners[keyword].newTweets++;
								
				DDE.replaceHtml(this.listCountNodes[eventIndex].context.children[1].children[1], that.allEventsDesigners[keyword].tweet_count);
				
				var otherCloneIndex = tg.designerCount + that.allEventsDesigners[keyword].alphaIndex + 1;
				
				DDE.replaceHtml(this.listCountNodes[otherCloneIndex].context.children[0].children[1], that.allEventsDesigners[keyword].tweet_count);
				
				classStr += data.keywords[i] + ' ';
				if (i == 1) firstColor = that.allEventsDesigners[keyword].color;
			}
			
			//Todo: updateMap
			
			//insert data based on which designer is toggled
			//filter data based on toggle
			var pathname = location.pathname.replace(/\/node-projects\/tweet-event-map\/fashion-twitter-www\//, '/');
			
			
			var hashData = DDE.hashBasePointer(location.hash);
			var hashBase = hashData.hashBase;
			var pointer = hashData.pointer;
			
			if (tg.navView.selectedNavItem != 'all') {
			
				var match = false;
				for (var i=1; i<keywordCount; i++) {
					var keyword = new RegExp(data.keywords[i]);
					if (tg.navView.selectedNavItem.match(keyword)) match = true;
				}
				if (!match) { return false; }
				
			} 			
			var text = data["tweet"]["text"];
			var username = data["tweet"]["user"]["screen_name"];
			var thumb = data["tweet"]["user"]["profile_image_url"];
			var author_url = 'http://twitter.com/'+username;
			var tweetDate = new Date(DDE.parseDate(data["tweet"]["created_at"]));
			var tweetTime = DDE.getTheMonth(tweetDate) + ' '+tweetDate.getDate()+' '+DDE.getClockTime(tweetDate);
			
			//match urls in the tweetext and hyperlink
			text = this.hyperlinkUrls(data["tweet"]);
			
			//Todo: create timestamp locally on client based on time of html insert
			
			var html = '<div class="listitem clearfix"><div class="listthumb"><img src="'+thumb+'" height="48" width="48" /></div><div class="listcontent"><h3><a href="'+author_url+'" target="_blank">'+username+'</a></h3> <span class="tweettext">'+text+'</span> <span class="tweettime">'+tweetTime+'</span></div></div>';
			
			var tmpNode = tg.$tweetsContent[0].children[0];
									
			tg.$tweetsContent.prepend(html);
			
			tmpNode.style.zoom = 1;
			tmpNode = null;			
			
			
			//$("<li class='"+classStr+"' style='color: "+firstColor+";'> </li>").text("@" + data.tweet.user.screen_name + ": " + data.tweet.text).prependTo("#main ul");
			
			//Todo: insert photos
			var pattern = new RegExp('^http:\/\/(yfrog.|instagr.|lockerz.|twitpic.|pic.twitter.)', 'i');
			var value = data["tweet"];
			var urls_length = value["entities"]["urls"].length;
			var img_urls = [];
			for (i=0;i<urls_length;i++) { 
				if (value["entities"]["urls"][i]["url"]) {
					if (value["entities"]["urls"][i]["expanded_url"]) {
						var str = value["entities"]["urls"][i]["expanded_url"];
						if (str.match(pattern)) {
							img_urls.push(str);
						} else {
							str = value["entities"]["urls"][i]["url"];
							if (str.match(pattern)) {
								img_urls.push(str);
								
							}
						}
					}
				}
			}
			
			var img_count = img_urls.length;
			
			if (img_count > 0) {
				var arrayWrapper = [{"img_urls" : img_urls}];
				
				for (var i=1; i<keywordCount; i++) {
					var keyword = data.keywords[i];
					that.allEventsDesigners[keyword].newPhotos++;
				}
				
				this.fetchImgUrls(arrayWrapper);
			}
			
			
			//Todo: adjust trends
			
			
		}
	},
	
	enhanceUI: function( parent ) {
		var that = parent;
		var tg = that.globals;
		
		//this.loadScheduleView(tg); //Change this to active Days menu for small screens
		
		
		if (tg.touch && tg.lastWindowWidth >= 992) { 
		
			//webkit mobile touch scroll panels
			tg.$scheduleNav[0].style['margin-right'] = '0px';
			tg.scheduleScroll = new iScroll('schedulenav');
			tg.mainScroll = new iScroll('mainsection');
			
		} else if (!tg.touch && tg.lastWindowWidth >= 992) {
		
			//custom desktop scroll panels
			tg.scheduleScroll = new that.CustomScroll(tg.$scheduleNav, tg);
			tg.mainScroll = new that.CustomScroll(tg.$mainSection, tg)
			
		} else if (tg.lastWindowWidth < 992 && !tg.touch) {
		
			this.enableSmallFixedHeaders(tg);
			
		}
		
		this.enableScheduleLinks(tg);
		
		this.setSelectedNavItem(tg);
		
		this.enableHashLinks(tg);
		
		var other = this;
		var delay = tg.touch ? 1200 : 600;
		setTimeout(function(){
			other.enableFancyNav(tg);
		}, delay);
		
		this.bindNavHovers(tg);
			
	},
	
	enableSmallFixedHeaders: function ( globals ) {
		return false;
		var tg = globals;
		var that = this;
		
		$(window).bind("scroll", function(e){
			
			var scrollPosition;
			
			if (document.documentElement && document.documentElement.scrollTop) {
				//IE
				scrollPosition = document.documentElement.scrollTop;
			} else {
				scrollPosition = tg.$body[0].scrollTop;
			}
			
			
			
			$('h3.designers').html(scrollPosition);			
		});
		
		var touchBegin = function(e) {
			//console.log("touchBegin");
			//tg.$main.append("touchBegin pageY: "+e.pageY + "<br />");
			
			$(this).bind("mousemove", touchMoving);
			$(this).bind("mouseup", touchEnds);
			
		},
		
		touchMoving = function(e) {
			//console.log("touchMoving");
			//tg.$main.append("touchMoving pageY: "+e.pageY + "<br />");
		},
		
		touchEnds = function(e) {
			//console.log("touchEnds");
			//tg.$main.append("touchEnds pageY: "+e.pageY + "<br />");
			
			$(this).unbind("mousemove", touchMoving, true);
			$(this).unbind("mouseup", touchEnds, true);
			
		};
		
		tg.$main.bind("mousedown", touchBegin, true);
		
	},
	
	hyperlinkUrls: function ( tweetData ) {
		var value = tweetData;
		var text = value["text"];
		
		var urls_length = value["entities"]["urls"].length;
		
		for (var i=0;i<urls_length;i++) { 
			if (value["entities"]["urls"][i]["url"]) {
				var url = value["entities"]["urls"][i]["url"];
				var urlExp = new RegExp(url);
				var anchor = '<a href="'+url+'" target="_blank">'+url+'</a>';
				text = text.replace(urlExp, anchor);
			}
		}
		
		var mentions_length = value["entities"]["user_mentions"].length;
		for (var i=0;i<mentions_length;i++) { 
			if (value["entities"]["user_mentions"][i]["screen_name"]) {
				var username = value["entities"]["user_mentions"][i]["screen_name"];
				
				var urlExp = new RegExp('@'+username+'\\b', 'i');
				var anchor = '<a href="http://twitter.com/'+username+'" target="_blank">@'+username+'</a>';
				text = text.replace(urlExp, anchor);
			}
		}
		
		return text;
	},
	
	loadMainViewDesigner: function (e) {
		console.log("loadMainViewDesigner");
		
		var tg, that, title, designer;
		
		var extra = '';
		
		if (e.type) {
		
			//listitem clicked
			e.preventDefault();
			
			var touch, clickedElem;
			if (e.touches) touch = e.touches[0];
			else touch = e;
			
			if (this.element) clickedElem = this.element;
			else clickedElem = this;
				
			tg = tweetYvent.globals;
			that = tg.navView;
			if (tg.$body.hasClass("designers")) extra = '-';
			
			//temporarily disable hashchange event
			//let our click control the event
			tg.noHashEvent = true;
			setTimeout(function(){
				tg.noHashEvent = false;
			}, 200);
			
			//undo selected status with animation
			if (tg.lastWindowWidth >= 992) {
				if (that.selectedNavItem) {
					that.navHoverOff(that.selectedNavItem+'-');
					that.navHoverOff(that.selectedNavItem);
				}
			}
			
			if (clickedElem.id.replace(/-$/, '') == "all-designers-item") {
			
				title = 'All Designers';
				designer = 'all';
				that.selectedNavItem = designer;
				var panel = tg.$body.hasClass('designers') ? 'designers' : 'schedule';
				window.location.href = window.location.pathname + '#!/' + panel + '/';
				if (tg.mainScroll) tg.mainScroll.refresh();
			
			} else {
				var anchor = $('.listname', clickedElem)[0];
				
				title = anchor.innerHTML;
				designer = clickedElem.id.replace(/-$/, '');
				that.selectedNavItem = designer;
				var href = anchor.href;
				
				window.location.href = href;
				
			}
			
			that.$scheduleNavItems.removeClass('selected');
			$(clickedElem).addClass('selected');
			if (designer == 'all') {
				$('#all-designers-item-').addClass('selected');
				$('#all-designers-item').addClass('selected');
			}
			tg.mainView.selectedDesigner = designer;
			
			//setNavItem selected status with animation
			if (tg.lastWindowWidth >= 992) {
				that.navHoverOn(clickedElem);
				if (tg.$body.hasClass('designers')) {
					var $theOther = $('#'+clickedElem.id.replace(/-$/, ''));
					that.navHoverOn($theOther[0]);
					$theOther.addClass("selected");
				} else {
					var $theOther = $('#'+clickedElem.id+'-');
					that.navHoverOn($theOther[0]);
					$theOther.addClass("selected");
				}
			}
			
			
		} else {
		
			//loading a fresh view from a designer url bookmark
			tg = e;
			that = this;
			
			if (tg.initialLoading || tg.initialScheduleLoad) { 
				console.log("check");
				tg.initialScheduleLoad = false;
				tg.initialLoading = false;
				return false; 
			}
			
			if (tg.$body.hasClass("designers")) extra = '-';
			
			var $clickedElem;
			
			if (!that.selectedNavItem || that.selectedNavItem == 'all') {
				title = 'All Designers';
				designer = 'all';
				if (tg.$body.hasClass('designers')) $clickedElem = $('#all-designers-item-');
				else $clickedElem = $('#all-designers-item');
				
				$clickedElem.addClass('selected');
				
			} else {
				
				designer = that.selectedNavItem;
				var selector = "#" + designer+extra;
				$clickedElem = $(selector);
				title = $clickedElem.find('.listname')[0].innerHTML;
			}
			
			//setNavItem selected status with animation
			if (tg.lastWindowWidth >= 992) {
				that.navHoverOn($clickedElem[0]);
				if (tg.$body.hasClass('designers')) {
					var $theOther = $('#'+$clickedElem[0].id.replace(/-$/, ''));
					that.navHoverOn($theOther[0]);
					$theOther.addClass("selected");
				} else {
					var $theOther = $('#'+$clickedElem[0].id+'-');
					that.navHoverOn($theOther[0]);
					$theOther.addClass("selected");
				}
			}
			
		}
		
		//reset Main View visible value until transition and load are complete
		tg.mainViewVisible = false;
		tg.mainViewLoaded = false;
		
		//clear out old content
		tg.$tweetsContent[0].innerHTML = '';
		tg.$wordContent[0].innerHTML = '';
		tg.$colorContent[0].innerHTML = '';
		tg.$photosContent[0].innerHTML = '';
		
		tg.tweetsLoaded = 0;
		tg.photosLoaded = 0;
		tg.$loadMore.removeClass("disabled");
		tg.$loadMore.html("Loading...");
		tg.allTweetsLoaded = false;
		tg.allPhotosLoaded = false;
		if (designer != 'all') {
			tweetYvent.allEventsDesigners[designer].newTweets = 0;
			tweetYvent.allEventsDesigners[designer].newPhotos = 0;
		}
		
		//set main view class to designername for extra styling
		tg.$main[0].className = that.selectedNavItem;
		//tg.$modules[0].className += ' loading';
		//tg.loadingTimer = setTimeout(function(){ tg.$loading[0].style.display = "block"; }, 300);
		
		if (tg.mainScroll) {
			tg.mainScroll.y = 0;
			if (tg.mainScroll.save) tg.mainScroll.save = 0;
			if (tg.mainScroll._pos) tg.mainScroll._pos(0,0);
					
			tg.mainScroll.refresh();
		}
		
		//set main view title
		tg.$h3DesignerName.html(title);
		
		//reset detailView tabs
		tg.$trendsContent[0].style.display = "none";
		tg.$tweetsContent[0].style.display = "block";
		tg.$photosContent[0].style.display = "none";
		tg.$trendTab.removeClass("selected");
		tg.$photoTab.removeClass("selected");
		tg.$tweetTab.addClass("selected");
		tg.detailTabVisible = "tweets";
		
		//check if we are in tg.scheduleNavSingleView aka Mobile mode
		//this is an early transition for faster devices that do support CSS Transitions
		if (tg.scheduleNavSingleView && tg.cssTransitionOn) that.showMainView(tg);
		else if (!tg.scheduleNavSingleView) tg.mainViewVisible = true;
				
		//load db content
		tg.startDB = (new Date()).getTime();
		
		console.log("designer: "+designer);
			
		//fetch designer db proxy
		var xhr = $.ajax({
			url: 'designer_db_request_proxy.php',
			data: {"designers": designer},
			dataType: "json",
			success: function ( data ) {
			
				console.log(data);
				
				clearTimeout(tg.loadingTimer);
				tg.loadingTimer = null
				
				var finished = (new Date()).getTime() - tg.startDB;	
				console.log("processing time fetching mongoDG: " + finished + " msec" );
					
				that.buildTweetDOM(tg, data);
				
				tg.mainViewLoaded = true;
				//tg.$modules[0].className = tg.$modules[0].className.replace(/ ?loading/gi, '');
				//tg.$loading[0].style.display = "none";
				tg.$loadMore.html("Load More");
				
				//check if we are in tg.singleViewMode aka Mobile mode
				//this is also a delayed transition for slower devices that don't support CSS Transitions
				if (tg.singleViewMode && !tg.cssTransitionOn) that.showMainView(tg);
				else if (!tg.singleViewMode || tg.initialDesignerLoading) that.fancyDataTransition(tg);
				
				tg.initialDesignerLoading = false;
				
				//insert archived photos
				//data.urlList = []
				
				var start = (new Date()).getTime();
				
				that.fetchImgUrls(data.urlList);
				
				var finished = (new Date()).getTime() - start;	
				console.log("processing time fetching images: " + finished + " msec" );
				
				
			},
			error: function ( data ) {
				
				console.log("error");
				console.log(data);
				console.log(data.responseText);
			}
		});
	},
	
	buildTweetDOM: function (globals, data) {
	
		var that = this;
		var tg = globals;
		
		tg.tweetsLoaded += data.tweetList.length;
		
		if (data.tweetList.length == 0) {
		
			tg.$loadMore.html("The End");
			tg.$loadMore.addClass("disabled");
			tg.allTweetsLoaded = true;
			return false;
		} else {
			tg.$loadMore.html("Load More");
		}
		
		var html = ''
				
		//store all tweet html in one string and append at once
		for (var i=0; i<data.tweetList.length; i++) {
		
			var text = data.tweetList[i]["tweet"]["text"];
			var username = data.tweetList[i]["tweet"]["user"]["screen_name"];
			var thumb = data.tweetList[i]["tweet"]["user"]["profile_image_url"];
			var author_url = 'http://twitter.com/'+username;
			var tweetDate = new Date(DDE.parseDate(data.tweetList[i]["tweet"]["created_at"]));
			var tweetTime = DDE.getTheMonth(tweetDate) + ' '+tweetDate.getDate()+' '+DDE.getClockTime(tweetDate);
			//var created_at = data["tweet"]["created_at"];
			//Todo: create timestamp locally on client based on time of html insert
			
			//match urls in the tweetext and hyperlink
			text = that.hyperlinkUrls(data.tweetList[i]["tweet"]);
			
			html += '<div class="listitem clearfix"><div class="listthumb"><img src="'+thumb+'" height="48" width="48" /></div><div class="listcontent"><h3><a href="'+author_url+'" target="_blank">'+username+'</a></h3> <span class="tweettext">'+text+'</span> <span class="tweettime">'+tweetTime+'</span></div></div>';
			
		}
		
		tg.tweetsHTML = html;
		//tg.$tweetsContent.append(html);	
		
		//insert archived trending words
		//data.trendsList = []
		var html = ''
		for (var i=0; i<data.trendsList.length; i++) {
			var word = data.trendsList[i]["word"];
			var count = data.trendsList[i]["count"];
			html += '<div class="listitem"><h3>'+word+'</h3> <span class="trendcount">'+count+'</span> </div>';
			
		}
		
		tg.trendingWordsHTML = html;
		//tg.$wordContent.append(html);
		
		//insert archived trending colors
		//data.colorsList = []
		var html = ''
		for (var i=0; i<data.colorsList.length; i++) {
			var color = data.colorsList[i]["color"];
			var count = data.colorsList[i]["count"];
			html += '<div class="listitem"><h3>'+color+'</h3> <span class="trendcount">'+count+'</span> </div>';
		}
		
		tg.trendingColorsHTML = html;
		
		
	},
	
	loadMoreData: function (globals, section) {
		var that = this;
		var tg = globals;
		
		tg.$loadMore.html("Loading...");
		var designer = that.selectedNavItem;
		var tabSection = section;
		var rangeStart;
		if (tabSection == 'tweets') {
			rangeStart = tweetYvent.allEventsDesigners[designer].newTweets + tg.tweetsLoaded;
		} else {
			rangeStart = tweetYvent.allEventsDesigners[designer].newPhotos + tg.photosLoaded;
		}
		
		console.log("rangeStart: "+rangeStart);
		
		//fetch designer db proxy
		var xhr = $.ajax({
			url: 'designer_db_request_proxy.php',
			data: {"designers": designer, "section" : tabSection, "start": rangeStart},
			dataType: "json",
			success: function ( data ) {
			
				console.log(data);
				
				if (tabSection == 'tweets') {
					that.buildTweetDOM(tg, data);
					
					if (data.tweetList.length == 0) { return false; }
				
					that.fancyDataTransition(tg);
				}
								
				if (tabSection == 'photos') {
				
					if (data.urlList.length == 0) {
						tg.$loadMore.html("The End");
						tg.$loadMore.addClass("disabled");
						tg.allPhotosLoaded = true;
					} else {
						tg.$loadMore.html("Load More");
					}

					that.fetchImgUrls(data.urlList, true);
				}	
								
				//var finished = (new Date()).getTime() - start;	
				//console.log("processing time fetching images: " + finished + " msec" );
				
				
			},
			error: function ( data ) {
				
				console.log("error");
				console.log(data);
				console.log(data.responseText);
			}
		});
	},
	
	fancyDataTransition: function ( globals ) {
		var tg = globals;
		var that = this;
		
		var checkInterval = setInterval(function(){
		
			if (tg.mainViewLoaded) {
				clearInterval(checkInterval);
				checkInterval = null;
				
				var tweets = tg.tweetsHTML;
				var words = tg.trendingWordsHTML;
				var colors = tg.trendingColorsHTML;
				
				
				tg.$tweetsContent.append(tweets);
				
				if (tg.singleViewMode && !tg.cssAnimationOn) { return false; }
				
				var count = tg.$tweetsContent[0].children.length;
				var stagger = 100;
				if (tg.cssAnimationOn) {
					for (var i=0; i<count; i++) {
						var tweet = tg.$tweetsContent[0].children[i];
						var delayed = stagger*i;
						tweet.style.opacity = 0;
						
						if (tg.lastWindowWidth >= 768) {
							tweet.style.top = "50px";
							DDE.cssAnimation(tweet, 'tweetLoad', {
								speed: 200, 
								delay: delayed,
								props: {top: "0px", opacity: 1} 
							});
						} else {
							DDE.fadeIn(tweet, {
								speed: 200, 
								delay: delayed,
								props: {opacity: 1} 
							});
						}
						
					}
				} else {
					for (var i=0; i<count; i++) {
						var tweet = tg.$tweetsContent[0].children[i];
						var delayed = stagger*i;
						tweet.style.top = "50px";
						$(tweet).css({opacity: 0}).delay(delayed).animate({opacity: 1, top: 0},{duration: 200, easing: 'easeOutQuad'});
					}
				}
				
				//wait until animations have finished before appending more
				setTimeout(function(){
					tg.$wordContent.append(words);
					tg.$colorContent.append(colors);
					
					if (tg.mainScroll) tg.mainScroll.refresh();
					
					tg.tweetsHTML = '';
					tg.tweetsHTML = null;
					tg.trendingWordsHTML = '';
					tg.trendingWordsHTML = null;
					tg.trendingColorsHTML = '';
					tg.trendingColorsHTML = null;
					
				}, stagger*count);
				
				
				
			}
		}, 500);
		
	},
	
	enableScheduleLinks: function ( globals ) {
		
		var tg = globals;
		var that = this;
		
		//change all link href to use hash links
		var links = $('a', tg.$scheduleNav);
		var anchorCount = links.length;
		var navItemCount = that.$scheduleNavItems.length;
		
		for (var i=0; i<anchorCount; i++) {
			that.makeLinkHash(links[i]);
		}
		
		tg.fastButtons = [];
		
		if (tg.touch && tg.lastWindowWidth < 992) {
			//we use iScroll for the larger than 992 screen and that handles fast clicks on it's own
			for (var i=0; i<navItemCount; i++ ) {
				tg.fastButtons[i] = new MBP.fastButton(that.$scheduleNavItems[i], that.loadMainViewDesigner);
			}
		} else {
			that.$scheduleNavItems.bind("click", that.loadMainViewDesigner);
		}
		
	},
	
	enableFancyNav: function ( globals ) {
		
		var tg = globals;
		var that = this;
		
		//resave references to ensure we animate the right nodes
		that.saveOnScreenRefs();
		
		console.log(tg.navView.selectedNavItem);
		
		//fade out all-designers nav
		if(tg.navView.selectedNavItem != 'all') {
			var $allD = $('#all-designers-item');
			var $allD2 = $('#all-designers-item-');
			
			if (tg.touch) {
				DDE.fadeOut($allD[0].children[0]);
				DDE.fadeOut($allD2[0].children[0]);
			} else {
				$($allD[0].children[0]).animate({opacity: 0, right: 28}, {duration: 300, easing: 'easeOutQuad'});
				$($allD2[0].children[0]).animate({opacity: 0, right: 28}, {duration: 300, easing: 'easeOutQuad'});
			}
		}
		
		var count = that.listCountNodes.length;
		
		if (tg.lastWindowWidth >= 992) {
			//initialize fancy hover
			tg.fancyNavEnabled = true;
			
			var stagger = 75;
			for (var i=0; i<count; i++) {
			
				if (that.listCountNodes[i].length == 0) { continue; }
				
				var index = i;
				var $countElem = that.listCountNodes[i];
				
				if ($(that.$scheduleNavItems[i+1]).hasClass("selected")) { continue; }
				var $arrow = that.listArrows[i];
				var delayed = stagger * i;
				if (delayed > 600) delayed = 0;
				if (tg.touch) {
					var name = 'itemCountRight';
					DDE.cssAnimation($countElem[0], name, {
						speed: 300, 
						delay: delayed,
						props: {right: "0px", backgroundColor: "rgb(200,200,200)"}
						
					});
					DDE.fadeOut($countElem[0].nextSibling, {delay: delayed});
				} else {
					if ($countElem.css("background-color") == '') $countElem[0].style.backgroundColor = "rgb(200,200,200)";
					if ($countElem.css("right") == '') $countElem[0].style.right = "0px";
					$countElem.delay(delayed).animate({right: 0, backgroundColor: "rgb(200,200,200)"}, {duration: 300, easing: 'easeOutQuad'});
					$arrow.delay(delayed).animate({opacity: 0, right: 28}, {duration: 300, easing: 'easeOutQuad'});
				}
			}
			
			setTimeout(function(){
				tg.scheduleScroll.refresh();
			}, 600);
		}
	},
	
	disableFancyNav: function ( globals ) {
		var tg = globals;
		var that = this;
		
		//resave references to ensure we animate the right nodes
		that.saveOnScreenRefs();
		
		tg.fancyNavEnabled = false;
		
		var count = that.listCountNodes.length;
		
		for (var i=0; i<count; i++) {
			
			if (that.listCountNodes[i].length == 0) { continue; }
			
			var $countElem = that.listCountNodes[i];
			var $arrow = that.listArrows[i];
			
			$countElem.stop();
			$arrow.stop();
			
			$countElem[0].style.right = '30px';
			$countElem[0].style.backgroundColor = '';
			
			$arrow.css({opacity: 1}); //IE7
			$arrow[0].style.right = '';
			$arrow[0].style.display = '';
			
			$countElem[0].style.webkitAnimationName = '';
			$countElem[0].style.webkitAnimationDelay = '';
			$countElem[0].style.webkitAnimationDuration = '';
			$arrow[0].style.webkitAnimationName = '';
			$arrow[0].style.webkitAnimationDelay = '';
			$arrow[0].style.webkitAnimationDuration = '';
			
		}
		
	},
	
	bindNavHovers: function ( globals ) {
		var tg = globals;
		var that = this;
		//bind activation events
		if (tg.touch) {
			//that.$scheduleNavItems.bind(DDE.touchStart, that.navHoverOn).bind(DDE.touchEnd, that.navHoverOff);
		} else {
			that.$scheduleNavItems.bind("mouseenter", that.navHoverOn).bind("mouseleave", that.navHoverOff);
		}
	},
	
	navHoverOn: function (e) {
	
		var tg = tweetYvent.globals;
		var color, tweetCount, arrow, name;
		
		if (!tg.singleViewMode) {
		
			if (e.type) {
				if (this.id.replace(/-$/, '') == 'all-designers-item') {
					arrow = this.children[0];
				} else {
					color = tweetYvent.allEventsDesigners[this.id.replace(/-$/, '')].color;
					tweetCount = this.children[1] ? this.children[1].children[1] : this.children[0].children[1];
					arrow = this.children[1] ? this.children[1].children[2] : this.children[0].children[2];
					name = 'itemCountLeft'+this.id.replace(/-$/, '');

				}
								
			} else {
				if (e.id.replace(/-$/, '') == 'all-designers-item') {
					arrow = e.children[0];
				} else {
					color = tweetYvent.allEventsDesigners[e.id.replace(/-$/, '')].color;
					tweetCount = e.children[1] ? e.children[1].children[1] : e.children[0].children[1] ;
					arrow = e.children[1] ? e.children[1].children[2] : e.children[0].children[2];
					name = 'itemCountLeft'+e.id.replace(/-$/, '');
				}
			}
			
			if (tg.touch) {
				if (e.type) tg.watchPos = tg.scheduleScroll.y;
				else e.style.backgroundColor = navBackgroundColors[e.id.replace(/-$/, '')];
				
				if (tweetCount) DDE.cssAnimation(tweetCount, name, {speed: 300, props: {right: "30px", backgroundColor: color} });
				DDE.fadeIn(arrow);
				setTimeout( function() { 
					arrow.style.display = "block";
				}, 400);
				
			} else {
				
				$(tweetCount).stop().animate({right: 30, backgroundColor: color}, {duration: 300, easing: 'easeOutQuad'});
				$(arrow).stop().delay(100).animate({opacity: 1, right: 8}, {duration: 300, easing: 'easeOutQuad'});
			}
		}
		
	},
	
	navHoverOff: function (e) {
		var tg = tweetYvent.globals;
		var that = tg.navView;
		var tweetCount, arrow, name;
		
		if (e.type) {
			if (this.id.replace(/-$/, '') == 'all-designers-item') {
				arrow = this.children[0];
			} else {
				tweetCount = this.children[1] ? this.children[1].children[1] : this.children[0].children[1];
				arrow = this.children[1] ? this.children[1].children[2] : this.children[0].children[2];
				name = 'itemCountRight'+this.id.replace(/-$/, '');
			}
						
			if (that.selectedNavItem == this.id.replace(/-$/, '') || (that.selectedNavItem == 'all' &&  this.id.replace(/-$/, '') == 'all-designers-item')) { return false; }
			if (tg.touch && !tg.singleViewMode && tg.watchPos == tg.scheduleScroll.y) { 
				tg.watchPos = null;
				return; 
			}
			if (tg.touch) this.style.backgroundColor = 'transparent';
			
		} else {
			
			if (e == 'all') e = 'all-designers-item';
			else if (e == 'all-') e = 'all-designers-item-';
			
			var selector = '#'+e;
			console.log("selector: "+selector);
			var $elem = $(selector);
			if ($elem[0].id.replace(/-$/, '') == 'all-designers-item') {
				arrow = $elem[0].children[0];
			} else {
				tweetCount = $elem[0].children[1] ? $elem[0].children[1].children[1] : $elem[0].children[0].children[1];
				arrow = $elem[0].children[1] ? $elem[0].children[1].children[2] : $elem[0].children[0].children[2];
				name = 'itemCountRight'+$elem[0].id.replace(/-$/, '');
			}
			
			if (tg.touch) $elem[0].style.backgroundColor = 'transparent';
		}
		
		if (!tg.singleViewMode) {
			if (tg.touch) {
			
				if (tweetCount) DDE.cssAnimation(tweetCount, name, {speed: 300, props: {right: "0px", backgroundColor: "rgb(200,200,200)"} });
				DDE.fadeOut(arrow);
				
			} else {
				
				$(tweetCount).stop().animate({right: 0, backgroundColor: "rgb(200,200,200)"}, {duration: 300, easing: 'easeOutQuad'});
				$(arrow).stop().animate({opacity: 0, right: 28}, {duration: 300, easing: 'easeOutQuad'});
			}
		}
	},
	
	resetTouchScheduleLinks: function ( globals ) {
		
		var tg = globals;
		var that = this;
		var navItemCount = that.$scheduleNavItems.length;
		
		//undo default clicks
		that.$scheduleNavItems.unbind("click");
		
		//undo fastButtons. Would like a better way to do this
		var count = tg.fastButtons.length;
		for (var i=0; i<count; i++) {
			var fastButton = tg.fastButtons[i];
			for (item in fastButton) {
				fastButton[item] = null;
			}
			tg.fastButtons[i] = null;
		}
		
		tg.fastButtons = [];
		
		if (tg.lastWindowWidth < 992) {
			//we use iScroll for the larger than 992 screen and that handles fast clicks on it's own
			for (var i=0; i<navItemCount; i++ ) {
				tg.fastButtons[i] = new MBP.fastButton(that.$scheduleNavItems[i], that.loadMainViewDesigner);
			}
		} else {
			that.$scheduleNavItems.bind("click", that.loadMainViewDesigner);
		}
	},
	
	enableHashLinks: function ( globals ) {
		var tg = globals;
		var that = this;
		
		//navigation breadcrumbs
		tg.$breadcrumb = $('h3.designer a');
		that.makeLinkHash(tg.$breadcrumb[0]);
		
		//designer schedulenav
		tg.$scheduleTab = $('#scheduletab');
		tg.$designersTab = $('#designerstab');
		that.makeLinkHash(tg.$scheduleTab[0].children[0]);
		that.makeLinkHash(tg.$designersTab[0].children[0]);
		
		//Day navigation links
		tg.$dayLinks = $('#dayslist ul li a');
		var count = tg.$dayLinks.length;
		for (var i=0; i<count; i++) {
			that.makeLinkHash(tg.$dayLinks[i]);
		}
		
		//Alpha navigation links
		tg.$alphaLinks = $('#alphalist ul li a');
		var count = tg.$alphaLinks.length;
		for (var i=0; i<count; i++) {
			that.makeLinkHash(tg.$alphaLinks[i]);
		}
		
		if (tg.touch) new MBP.fastButton(tg.$breadcrumb[0], that.showScheduleView);
		else tg.$breadcrumb.bind("click", that.showScheduleView);
		
		//Day navigation panel
		tg.$dayPanelLink = $('#dayslink');
		if (tg.touch) new MBP.fastButton(tg.$dayPanelLink[0], that.showDayPanel);
		else tg.$dayPanelLink.bind("click", that.showDayPanel);
		
	},
	
	showDayPanel: function (e) {
		//mobile only function
		var touch, clickedElem;
		var tg = tweetYvent.globals;
		var that = tg.navView;
		
		if (tg.lastWindowWidth >= 768) { return false; }
		
		
		if (e) {
			e.preventDefault();
			if (e.touches) {
				touch = e.touches[0];
				clickedElem = this.element;
			} else {
				 touch = e;
				 if (this.element) clickedElem = this.element;
				 else clickedElem = this;
			}
		}
		
		if(tg.$body.hasClass("schedule")) {
			if (tg.cssAnimationOn) DDE.fadeIn(tg.$dayslist[0]);
			else tg.$dayslist.fadeIn();
			tg.dayPanelMode = true;
			
		} else {
			if (tg.cssAnimationOn) DDE.fadeIn(tg.$alphalist[0]);
			else tg.$alphalist.fadeIn();
			tg.alphaPanelMode = true;
		}
		
		
		
		
		
	},
	
	scrollScheduleView: function () {
		var tg = tweetYvent.globals;
		var that = tg.navView;
		
		var selector = '#' + that.selectedDayItem;
		var $dayHeader = $(selector);
		var targetPosition = $dayHeader[0].offsetTop;
		
		//hide dayPane if in dayPanelMode
		if (tg.dayPanelMode) tg.$dayslist[0].style.display = "none";
		if (tg.alphaPanelMode) tg.$alphalist[0].style.display = "none";
		
		//animateScroll
		if (tg.scheduleScroll && tg.scheduleScroll.track) {
			//custom scrolling div
			
			var maxY = tg.scheduleScroll.scrollDistance;
			var targetY = targetPosition > maxY ? maxY : targetPosition;
			$(tg.scheduleScroll.scrollPane).animate({scrollTop: targetY}, {
				duration: 300, 
				easing: 'easeOutQuad', 
				complete: function(){
					tg.scheduleScroll.y = targetY;
					tg.scheduleScroll.save = targetY;
					tg.scheduleScroll.refresh();
				}
			});
			
				
		} else if (tg.scheduleScroll && tg.scheduleScroll.scroller) {
			//iScroll container
			var scroller = tg.scheduleScroll.scroller,
				wrapper = tg.scheduleScroll.wrapper,
				matrix = getComputedStyle(scroller, null)['webkitTransform'].replace(/[^0-9-.,]/g, '').split(','),
				currentY = matrix[5],
				maxY = -(scroller.scrollHeight - wrapper.offsetHeight);
			
			var targetY = targetPosition > -maxY ? maxY : -targetPosition;
			
			var animationCallback = function() {
				this.style['-webkit-transition-property'] = 'none';
				this.style['-webkit-transition-duration'] = '';
				this.removeEventListener('webkitTransitionEnd', animationCallback, false);
			};
			
			scroller.addEventListener('webkitTransitionEnd', animationCallback, false);
			scroller.style.webkitTransitionProperty = '-webkit-transform';
			scroller.style.webkitTransitionDuration = '200ms';
			scroller.style.webkitTransitionTimingFunction = 'ease-out';
					
			scroller.style.webkitTransform = 'translate3d(0px, '+targetY+'px, 0)';
			
			
		} else {
			//native body scrolling
			
			var maxY, $scroller;
			if (document.documentElement && document.documentElement.scrollTop) {
				//IE
				maxY = document.documentElement.scrollHeight - tg.lastWindowHeight;
				$scroller = $(document.documentElement);
			} else {
				maxY = tg.$body[0].scrollHeight - tg.lastWindowHeight;
				$scroller = tg.$body;
				var testScroll = tg.$body[0].scrollTop;
				tg.$body[0].scrollTop += 1;
				
				if (tg.$body[0].scrollTop == testScroll) {
					//some browsers still don't scroll the body
					$scroller = $('html');
				} else {
					//the body scrolls, so reset it back
					tg.$body[0].scrollTop -= 1;
				}
			}
			
			targetPosition += tg.$contentNav[0].offsetTop + tg.$header[0].offsetTop;
			var targetY = targetPosition > maxY ? maxY : targetPosition;
			
			$scroller.animate({scrollTop: targetY}, {duration: 300, easing: 'easeOutQuad'});
			
		}
		
		
		
	},
	
	showScheduleView: function (e) {
		//mobile only function
		var touch, clickedElem;
		if (e) {
			e.preventDefault();
			if (e.touches) {
				touch = e.touches[0];
				clickedElem = this.element;
			} else {
				 touch = e;
				 if (this.element) clickedElem = this.element;
				 else clickedElem = this;
			}
			window.location.href = clickedElem.href;
		} 
		
		var tg = tweetYvent.globals;
		var that = tg.navView;
		
		//transition view
		that.transitionView(tg.$nav, tg);
		
		tg.$body.removeClass("start");
		tg.$body.removeClass("default");
		
		tg.scheduleNavSingleView = true;
		tg.singleViewMode = true;
		
		setTimeout(function(){
			if (that.selectedNavItem && that.selectedNavItem != 'all') {
				that.navHoverOff(that.selectedNavItem);
				that.navHoverOff(that.selectedNavItem+'-');
			}
		}, 1000);
		
	},
	
	showMainView: function ( globals ) {
		//mobile only function
		var tg = globals;
		var that = this;
		
		//transition view
		that.transitionView(tg.$main, tg);
		
		//make body scrollTop is reset to 0
		//tg.$body[0].scrollTop = 1;
		
		tg.scheduleNavSingleView = false;
		tg.singleViewMode = true;
		
	},
	
	transitionView: function ($elem, globals) {
		var tg = globals;
		var that = this;
		var transitionSpeed = 300;
		tg.$nav[0].style.position = "absolute";
		tg.$nav[0].style.width = "100%";
		tg.$main[0].style.position = "relative";
		tg.$footer[0].style.display = "none";
		
		console.log($elem.selector);
				
		switch ($elem.selector) {
			case "#nav":
			
				console.log(tg.lastWindowWidth);
				//show schedule navigation
				tg.$nav[0].style.left = -tg.lastWindowWidth + "px";
				tg.$nav[0].style.display = "block";
				
				var transitionComplete = function() {
					tg.$main[0].style.display = "none";
					tg.$nav[0].style.display = "block";
					tg.$nav[0].style.position = "relative";
					
					tg.$footer[0].style.display = "block";
					
				};
				
				if (tg.cssTransitionOn) {
					DDE.cssTransition(tg.$main[0], {left: tg.lastWindowWidth}, {
						speed: transitionSpeed, 
						easing: 'ease-out', 
						complete: transitionComplete
					});
					
					DDE.cssTransition(tg.$nav[0], {left: 0}, {speed: transitionSpeed, easing: 'ease-out'});
				} else {
					tg.$main.animate({left: tg.lastWindowWidth},{
						duration: transitionSpeed, 
						easing: 'easeOutQuad', 
						complete: transitionComplete
					});
					
					tg.$nav.animate({left: 0},{duration: transitionSpeed, easing: 'easeOutQuad'});
				}
				
				break;
				
			case "#main":
				//show main designer detail
				tg.$main[0].style.left = tg.lastWindowWidth + "px";
				tg.$main[0].style.display = "block";
				
				tg.$body[0].scrollTop = 1;
				//IEM7 WP7
			 	document.documentElement.scrollTop = 1;
			 	
				var transitionComplete = function(){
					tg.$nav[0].style.display = "none";
					tg.$footer[0].style.display = "block";
					
					tg.mainViewVisible = true;
					
					that.fancyDataTransition(tg);
				};
				
				if (tg.cssTransitionOn) {
					DDE.cssTransition(tg.$nav[0], {left: -tg.lastWindowWidth}, {
						speed: transitionSpeed, 
						easing: 'ease-out', 
						complete: transitionComplete
					});
					
					DDE.cssTransition(tg.$main[0], {left: 0}, {speed: transitionSpeed, easing: 'ease-out'});
				} else {
					tg.$nav.animate({left: -tg.lastWindowWidth},{
						duration: transitionSpeed, 
						easing: 'easeOutQuad', 
						complete: transitionComplete
					});
					
					tg.$main.animate({left: 0},{duration: transitionSpeed, easing: 'easeOutQuad'});
				}
				break;
		}
		
	},
	
	resetSingleViewMode: function ( globals ) {
		var tg = globals;
		var that = this;
		tg.$nav[0].style.display = "block";
		tg.$main[0].style.display = "block";
		
		tg.$main[0].style.position = "";
		tg.$main[0].style.left = "";
		tg.$nav[0].style.position = "";
		tg.$nav[0].style.width = "";
		tg.$nav[0].style.left = "";
		
		tg.$nav[0].style.display = "";
		tg.$main[0].style.display = "";
		tg.scheduleNavSingleView = false;
		tg.singleViewMode = false;
	},
	
	makeLinkHash: function ( link ) {
		var baseURI = 'http://'+link.hostname+'/';
		var pathname = link.pathname;
		
		//fix consistency between pathname structure across browsers
		pathname = pathname.replace(/^\//, '');
		
		//for anchor links that already contain basic hash urls
		//aka daylist links
		var hash = '';
		if (link.hash != '') {
			hash = link.hash.replace(/#/, '') + '/';
		}
		
		//todo: remove for production
		var extra = '';
		if (pathname.match(/node-projects\/tweet-event-map\/fashion-twitter-www/)) {
			extra = 'node-projects/tweet-event-map/fashion-twitter-www/';
			pathname = pathname.replace(/node-projects\/tweet-event-map\/fashion-twitter-www\//, '');
		}
		
		link.href = baseURI + extra + '#!/' + pathname + hash;
		link.hideFocus = 'hidefocus';
	},
	
	setSelectedNavItem: function ( globals ) {
		var tg = globals;
		var that = this;
		
		if (that.selectedNavItem && that.selectedNavItem != 'all') {
			var selector = '#'+that.selectedNavItem;
			var selector2 = '#'+that.selectedNavItem+'-';
			that.$scheduleNavItems.removeClass('selected');
			$(selector).addClass('selected');
			$(selector2).addClass('selected');
		} else {
			that.$scheduleNavItems.removeClass('selected');
			$('#all-designers-item').addClass('selected');
			$('#all-designers-item-').addClass('selected');
		}
	},
	
	fetchImgUrls: function( urlList, append ) {
	
		var tg = tweetYvent.globals;
	
		tg.photosLoaded += urlList.length;
		
		if (urlList.length == 0) { return false; }
		
		var fetchImgProxy = function( request ) {
			//var params = {"url":  url_test};
			console.log(request)
			var xhr = $.ajax({
				url: request,
				//url: "external_img_proxy.php",
				//data: params,
				dataType: "json",
				success: function ( data ) {
					//console.log("success getting foursquare data");
					console.log(data);
					console.log(typeof data);
				},
				error: function ( data ) {
					//console.log("error: could not get foursquare data");
					console.log("error");
					console.log(data);
					console.log(data.responseText);
				}
			});
		};
		
		var fetchImgDirect = function (request, data) {
			var img = new Image();
			img.src = request;
			
			var tweetStr = data["text"];
			
			tweetStr = tweetStr.replace(/http:\/\/[a-zA-Z0-9-.\/]+/gi, ' ');
			
			var author = data["user"]["name"];
			var author_url = 'http://twitter.com/'+data["user"]["screen_name"];
			var photo_date = new Date(DDE.parseDate(data["created_at"]));
			var photoTime = DDE.getTheMonth(photo_date) + ' '+photo_date.getDate()+', '+DDE.getClockTime(photo_date);
			
			$(img).load(function(){
			
				var html = '<div class="listitem"><div class="photocontainer clearfix">';
						html += '<img src="'+this.src+'" />';
						
						html += '<div class="caption">'+tweetStr+' &mdash;<a href="'+author_url+'" target="_blank">'+author+'</a>, <span class="photodate">'+photoTime+'</span></div>';
						html += '</div>';
					html+= '</div>';
				
				if (append ) $('.photos').append(html);
				else $('.photos').prepend(html);
			});
		};
		
		//var url_test = "http://yfrog.com/klu2qjtj:iphone";
		//var url_test = "http://twitpic.com/show/large/5t4c7y";
		
		var chooseImgAPI = function(url, data) {
		
			var imgURL = url;
			var allowedurls = ['http:\/\/yfrog.com\/','http:\/\/lockerz.com\/','http:\/\/instagr.am\/','http:\/\/twitpic.com\/', 'http:\/\/pic.twitter.com\/'];
		
			var url_pattern = new RegExp('^('+ allowedurls.join('|')+')', 'i');
			var url_group = imgURL.match(url_pattern);
			console.log(url_group);
			
			if (imgURL == "http://yfrog.com/gzcbeeuj" ) {return false; };
	
			
			switch(url_group[0]) {
				case "http://yfrog.com/":
					var request = imgURL+":iphone";
					fetchImgDirect(request, data);
					break;
					
				case "http://twitpic.com/":
					var imgID = imgURL.replace(/^http:\/\/twitpic.com\//i,'');
					var request = "http://twitpic.com/show/large/"+imgID;
					fetchImgDirect(request, data);
					break;
					
				case "http://lockerz.com/":
					var request = "http://api.plixi.com/api/TPAPI.svc/imagefromurl?size=big&url="+imgURL;
					fetchImgDirect(request, data);
					break;
					
				case "http://instagr.am/":
					var imgID = imgURL.replace(/^http:\/\/instagr.am\/p\//i,'');
					var request = "http://instagr.am/p/"+imgID+"media";
					fetchImgDirect(request, data);
					break;
				
				case "http://pic.twitter.com/":
					console.log("Twitters pic.twitter.com used!!");
					break;
			}
		}; 
				
		for(var i=0; i<urlList.length; i++) {
			//console.log(DDE.externalLinks[i]);
			//["img_urls"]
			//["tweet"]
			//["id"]
			
			var tweetData = urlList[i]["tweet"];
		
			for(var j=0; j<urlList[i]["img_urls"].length; j++) {
				var url = urlList[i]["img_urls"][j];
				chooseImgAPI(url, tweetData);
				
			}
		}
		
	}

}

/*//////////////////////////////////
//
//			Custom Scrollbars
//
///////////////////////////////////*/

DDE.TweetYvent.prototype.CustomScroll = function ( $elem, globals ) {
	console.log("New CustomScroll Object");
	var tg = globals;
	
	this.id = $elem[0].id;
	this.scrollPane = $elem[0];
	
	this.buildScrollbars();
	
	//init scrollbar
	this.scrollbar = $elem[0].nextSibling;
	this.y = 0;
	
	this.track = this.scrollbar.childNodes[0];
	this.thumb = this.scrollbar.childNodes[1];
	
	this.refresh();
	
	this.enableScrollbars(tg);
	
		
};

DDE.TweetYvent.prototype.CustomScroll.prototype = {
	buildScrollbars: function () {
		
		var that = this;
		var scrollID = that.scrollPane.id ? that.scrollPane.id : '';
		
		var HTML = '<div id="'+scrollID+'scroller" class="scroller scroll-vertical">';
				HTML += '<div class="track"></div>';
				HTML += '<div class="thumb"></div>';
			HTML += '</div>';
			
		$(that.scrollPane).after(HTML);
		
	},
	
	disableScrollbars: function () {
		var that = this;
		var eventType = 'onmousewheel' in that.scrollPane ? 'mousewheel' : 'DOMMouseScroll';
		$(that.scrollPane).unbind(eventType);
	},
	
	destroy: function() {
		var selector = '#'+this.id+'scroller';
		$(selector).remove();
		this.id = null;
		this.scrollPane = null;
		this.scrollbar = null;
		this.track = null;
		this.thumb = null;
	},
	
	enableScrollbars: function ( globals ) {
		var that = this;
		var tg = globals;
		
		var eventType = 'onmousewheel' in that.scrollPane ? 'mousewheel' : 'DOMMouseScroll';
		
		var scrollPanel = function(e) {
			e = e ? e : window.event;
  			var wheelData = e.detail ? -e.detail : e.wheelDelta;
  			
  			if (tg.Webkit) {
  				if (tg.Chrome) {
  					wheelData = wheelData/2;
  				} else {
  					wheelData = wheelData/120;
  				}
  			} else if (tg.MSIE) {
  				wheelData = wheelData/3;
  			} else {
  				wheelData = wheelData * 5;
  			}
  			
  			this.scrollTop += -wheelData;
  			
  			that.y = this.scrollTop;
  			that.save = this.scrollTop;
  			
  			//move thumb
  			if (that.scrollDistance > 0) {
	  			var percentageMoved = this.scrollTop/that.scrollDistance;
	  			that.thumb.style.top = Math.round((that.distanceForThumb * percentageMoved)) + "px";
	  		}
	  		
			//Firefox wants this to stop it from reseting the scrollTop after the style change
			this.scrollTop = that.save;
			
			
		};
		
		$(that.scrollPane).bind(eventType, scrollPanel);
	},
	
	refresh: function () {
		var that = this;
		var tg = tweetYvent.globals;
		
		//Firefox is having trouble retaining this info on the element
		if (that.save) {
			that.y = that.save;
			that.scrollPane.scrollTop = that.save;
		}
		
		if(that.scrollPane.parentElement.offsetTop > 100 ) {
			if (!tg.ie7) that.scrollPane.parentElement.style.paddingBottom = '145px';
			else DDE.setMaxHeight(tg.$modules[0], tg.lastWindowHeight - 250);
		} else {
			if (!tg.ie7) that.scrollPane.parentElement.style.paddingBottom = '100px';
			else DDE.setMaxHeight(tg.$modules[0], tg.lastWindowHeight - 210);
		}
		
		that.panelHeight = that.scrollPane.offsetHeight;
		that.scrollDistance = that.scrollPane.scrollHeight - that.panelHeight;
		
		if (that.scrollPane.scrollHeight == 0) {
			that.thumbHeight = 0;
		} else {
			//size thumb
			that.thumbHeight =  (that.panelHeight/that.scrollPane.scrollHeight) * that.panelHeight;
		}
		
		
		
		
		if (that.thumbHeight < 30) that.thumbHeight = 30;
		if (that.scrollDistance == 0) that.thumb.style.display = "none";
		else that.thumb.style.display = "block";
		
		that.thumb.style.height = that.thumbHeight + "px";
		that.distanceForThumb = that.panelHeight - that.thumbHeight;
		
		//move thumb
		if (that.scrollDistance > 0) {
			var percentageMoved = that.y/that.scrollDistance;
			that.thumb.style.top = Math.round((that.distanceForThumb * percentageMoved)) + "px";
		}
		
	}
};


/*//////////////////////////////////
//
//			Detail View
//
///////////////////////////////////*/

DDE.TweetYvent.prototype.MainView = function( parent, selector ) {
		console.log("New Main View Object");
		console.log(this);
		var that = parent;
		var tg = that.globals;
		
		this.selectedDesigner = selector ? selector : 'all';
		
		this.makeTabs(tg);
		
		this.enableLoadMore(tg);
		
		if (this.selectedDesigner) tg.navView.loadMainViewDesigner(tg);
		
		};

DDE.TweetYvent.prototype.MainView.prototype = {
	
	makeTabs: function( globals ) {
	
		var tg = globals;
		var that = this;
		
		//Todo: make more efficient code
		var $extraHeaders = $('.no-tab');
		var $detailNavMenu = $('#detailnav ul');
		tg.$tweetsContent = $('div.tweets');
		tg.$trendsContent = $('div.trends');
		tg.$photosContent = $('div.photos');
		tg.$tweetTab = $('#tweettab');
		tg.$trendTab = $('#trendtab');
		tg.$photoTab = $('#phototab');
		
		tg.$photoTab[0].children[0].hideFocus = 'hidefocus';
		tg.$trendTab[0].children[0].hideFocus = 'hidefocus';
		tg.$tweetTab[0].children[0].hideFocus = 'hidefocus';
		
		var $colorSwitch = $('#colorswitch');
		var $wordSwitch = $('#wordswitch');
		tg.$colorContent = $('#trendingcolors');
		tg.$wordContent = $('#trendingwords');
		
		
			
		$extraHeaders.addClass("visuallyhidden");
		
		tg.$trendsContent[0].style.display = "none";
		tg.$photosContent[0].style.display = "none";
		
		tg.detailTabVisible = "tweets";
		
		tg.$trendTab.click(function(e){
			e.preventDefault();
			tg.$trendsContent[0].style.display = "block";
			tg.$tweetsContent[0].style.display = "none";
			tg.$photosContent[0].style.display = "none";
			tg.$trendTab.addClass("selected");
			tg.$tweetTab.removeClass("selected");
			tg.$photoTab.removeClass("selected");
			
			if (tg.mainScroll) that.resetMainScroll(tg);
			
			tg.detailTabVisible = "trends";
			tg.$loadMore[0].style.display = 'none';
			
		});
		
		tg.$tweetTab.click(function(e){
			e.preventDefault();
			tg.$trendsContent[0].style.display = "none";
			tg.$tweetsContent[0].style.display = "block";
			
			tg.$photosContent[0].style.display = "none";
			tg.$trendTab.removeClass("selected");
			tg.$photoTab.removeClass("selected");
			tg.$tweetTab.addClass("selected");
			
			tg.$loadMore[0].style.display = 'block';
			
			if (tg.mainScroll) that.resetMainScroll(tg);			
			tg.detailTabVisible = "tweets";
			
			if (tg.allTweetsLoaded) {
				tg.$loadMore.addClass("disabled");
				tg.$loadMore.html("The End");
			} else {
				tg.$loadMore.removeClass("disabled");
				tg.$loadMore.html("Load More");
			}
						
			
		});
		
		tg.$photoTab.click(function(e){
			e.preventDefault();
			tg.$trendsContent[0].style.display = "none";
			tg.$tweetsContent[0].style.display = "none";
			tg.$photosContent[0].style.display = "block";
			tg.$trendTab.removeClass("selected");
			tg.$tweetTab.removeClass("selected");
			tg.$photoTab.addClass("selected");
			
			if (tg.mainScroll) that.resetMainScroll(tg);
			
			tg.$loadMore[0].style.display = 'block';
			
			tg.detailTabVisible = "photos";
			
			if (tg.allPhotosLoaded) {
				tg.$loadMore.addClass("disabled");
				tg.$loadMore.html("The End");
			} else {
				tg.$loadMore.removeClass("disabled");
				tg.$loadMore.html("Load More");
			}
			
			
		});
		
		$wordSwitch.click(function(e){
			tg.$colorContent[0].style.display = "none";
			tg.$wordContent[0].style.display = "block";
			$colorSwitch.removeClass("selected");
			$wordSwitch.addClass("selected");
			
			if (tg.mainScroll) that.resetMainScroll(tg);
			
			tg.detailSubTabVisible = "words";
			
		});
		
		$colorSwitch.click(function(e){
			tg.$colorContent[0].style.display = "block";
			tg.$wordContent[0].style.display = "none";
			$colorSwitch.addClass("selected");
			$wordSwitch.removeClass("selected");
			
			if (tg.mainScroll) that.resetMainScroll(tg);
			
			tg.detailSubTabVisible = "colors";
			
		});
		
	},
	
	resetMainScroll: function( globals ) {
		var tg = globals;
		
		tg.mainScroll.y = 0;
		if (tg.mainScroll.save) tg.mainScroll.save = 0;
		if (tg.mainScroll._pos) tg.mainScroll._pos(0,0);
		
		tg.mainScroll.refresh();
	},
	
	enableLoadMore: function ( globals ) {
		var that = this;
		var tg = globals;
		
		tg.$loadMore = $('#loadmore');
		
		if (tg.touch) {
			new MBP.fastButton(tg.$loadMore[0], function(){
				tg.navView.loadMoreData(tg, tg.detailTabVisible);
			});

		} else {
			tg.$loadMore.click(function(e){
				tg.navView.loadMoreData(tg, tg.detailTabVisible);
			});
		}
	}
	
};


var tweetYvent = new DDE.TweetYvent();

console.log("New TweetYvent Object");
console.log(tweetYvent);


})(); //End of TweetYvent Namespace

/*

function rainPerfTest() {
	var length = $tableRows.length;
	
	var rainIndex = 0;
	setInterval(function(){
		for (var i=0; i<length; i++) {
			var rainSelector = '#cloud'+i+'rain'+rainIndex;
			rainAnimation(rainSelector);
		}
		if (rainIndex == (maxRainPerEvent-1) ) rainIndex = 0;
		else rainIndex++;
	}, 300);
}

*/
