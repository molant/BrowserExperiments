﻿/***********************************************
 * HTML5 semantics fix
 ***********************************************/

(function(){
	var t = document.createElement("div"),
		a = 'abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video'.split("|");

	for(var i=0;i<a.length;i++){
		t.innerHTML = "<"+a[i]+"></"+a[i]+">";
		if( t.childNodes.length === 0 ){
		    // we need to create all our HTML5 elements
		    document.createElement(a[i]);
		}
	}
})();


/***********************************************
 * 				Mobile META
 ***********************************************/
(function(){
	var meta = document.createElement('meta');
	meta.name = 'viewport';
	meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
	document.getElementsByTagName('head')[0].appendChild(meta);
})();




/***********************************************
 * 				DISQUS
 ***********************************************/

/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
var disqus_shortname = 'browserexperiments'; // required: replace example with your forum shortname

// The following are highly recommended additional parameters. Remove the slashes in front to use.
var disqus_identifier = "be_"+window.location.pathname;
// var disqus_url = 'http://example.com/permalink-to-page.html';




/********************************
 * UTILITY: Add Events to elements
 ********************************/
var addEvent = (function () {
  if (document.addEventListener) {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();







/*********************************
 * Load
 *********************************/

(function () {


	/** 
	 * Add Styles
	 */

	var a = document.getElementsByTagName('script'),
		m = a[a.length-1].getAttribute('src').match(/^([\.\/]*)/),
		path = (m?m[0]:'');

	// How nested is this script, we get the style sheet from the same root
	var s = document.createElement('link');
	s.rel="stylesheet";
	s.href = path+"browserexperiments.css";
	document.getElementsByTagName('head')[0].appendChild(s);

	
	/**
	 * View Source
	 */
	// add pretify
	append('script', {
	    	type : 'text/javascript', 
	    	src : path + 'Common/jsprettify.packed.js'
	    },
	    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0])
	);

	var pre = append('pre',{id:"view-source"});
	
	// private scope to avoid conflicts with demos
	addEvent(window, 'click', function (event) {
	  if (event.target.hash == '#view-source') {
	    // event.preventDefault();
	    if (!document.getElementById('view-source')) {
	      // pre.innerHTML = ('<!DOCTYPE html>\n<html>\n' + document.documentElement.innerHTML + '\n</html>').replace(/[<>]/g, function (m) { return {'<':'&lt;','>':'&gt;'}[m]});
	      var xhr = new XMLHttpRequest();
	
	      // original source - rather than rendered source
	      xhr.onreadystatechange = function () {
	        if (this.readyState == 4 && this.status == 200) {
	          pre.innerHTML = this.responseText.replace(/[<>]/g, function (m) { return {'<':'&lt;','>':'&gt;'}[m]});
	          prettyPrint();
	        }
	      };
	
	      document.body.appendChild(pre);
	      // really need to be sync? - I like to think so
	      xhr.open("GET", window.location, true);
	      xhr.send();
	    }
	    //document.body.className = 'view-source';
	    try{document.getElementsByTagName('html')[0].className='view-source';}catch(e){}
	    
	    var sourceTimer = setInterval(function () {
	      if (window.location.hash != '#view-source') {
	        clearInterval(sourceTimer);
		    try{document.getElementsByTagName('html')[0].className='';}catch(e){}
	      }
	    }, 200);
	  }
	});
  
	// create an element
	function append(node,attr,target){
		var n = document.createElement(node);
		if(!attr.tagName){
			if(typeof(attr)==='object'){
				for(var x in attr){
					n[x] = attr[x];
				}
			}
		}
		else{
			target = attr;
		}
		if(typeof(target)==='object'){
			target.appendChild(n);
		}
		return n;
	}
	

	/**
	 * Run this when the page has loaded
	 */
	addEvent(window, 'load', function(){
		
		/**
		 * Pretify any PRE tags 
		 *		try{
			prettyPrint();
		}catch(e){}
		
		/**
		 * Add toggle
		 */
		addEvent(document.getElementById('more'), 'click', function(){
			var n = document.getElementById('article');
			n.className = (n.className!=='show'?'show':''); 
			this.innerHTML = (n.className==='show'?'less':'more');
		});
	
		// Build footer to the bottom of the page
	    var f = document.createElement('footer');
	    document.getElementsByTagName('body')[0].appendChild(f);
	
	    // add elements to the footer with classnames
		var a = ["h5-logo","h5-logos"];
		for(var i=0;i<a.length;i++){
			d = document.createElement('div');
			d.className = a[i];
			f.appendChild(d);
		}


		/**
		 * Add links to the body headers
		 */
		var header = document.getElementsByTagName('header')[0],
			nav = header.getElementsByTagName('nav')[0]; 
			
		if( !nav ){
			nav = append("nav", header);
		}
		var a = {
				'shims/' : "Shims &amp; Polyfills",
				'widgets/' : "Widgets &amp; UI",
				'sites/' : "Demo sites",
				'learn/' : "Learn"
			};

		for( var x in a ){
			var h = document.createElement('a'),
				c = (header.children.length?header.children[0]:false);
			h.href = path + x;
			h.className = (window.location.pathname.match(x)?"selected":"");
			h.innerHTML = a[x];
			nav.appendChild(h);
		}
		
		
		/**
		 * Add github logo to the page
		 */
		var a = document.createElement('a');
		a.href=  "http://github.com/molant/BrowserExperiments";
		a.className = "git";
		a.target = "_blank";
		a.title = 'Fork me on GitHub';
		document.getElementsByTagName('header')[0].appendChild(a);
		

		/**
		 * Add site navigation
		 * .breadcrumbs
		var a = window.location.pathname.replace(/^\//,'').replace(/\/$/,'').split("/"),
			b = [],
			url = '';
		
		b.push("<a href='/'>home</a>"); 
		for(var i=0;i<a.length;i++){
			url += "/" + a[i]; 
			b.push("<a href='" + url + "'>"+a[i]+"</a>"); 
		}
		
		var div = document.createElement("div");
		div.id = "breadcrumbs";
		div.style.opacity = 0;
		div.innerHTML = b.join(" ");
		document.getElementsByTagName("body")[0].appendChild(div);
		(function self(){
			if(div.style.opacity < 1){
				console.log(div.style.opacity);
				div.style.opacity = parseFloat(div.style.opacity) + 0.1;
				setTimeout(self, 100);
			}
		})();
		
		 */
	
		/**
		 * Adding comments to some of the icons
		 */	
		try{
			var a = document.querySelectorAll("figure figcaption span");
			for(var i=0;i<a.length;i++){
				a[i].title = { 
					performance : "Performance",
					css3 : "CSS3",
					semantics : "Semantic Elements",
					offline : "Offline & Storage features, LocalStorage and ApplicationCache",
					multimedia : "HTML5 Video and Audio",
					device : "Device Access kicks off with Geolocation",
					connectivity : "More efficient connectivity means real time chats, faster games and better communication",
					"3d" : "3D Graphics"
				}[a[i].className];
			}
		}catch(e){}
			
		/**
		 * COMMENTING by DISQUS
		 */
	
	    // Controls to show hide disqus
		var h = document.createElement('a');
		h.onclick = function(){
			document.getElementById("disqus_thread").style.display = "block";
		};
		h.innerHTML = h.title = "Comments";
		h.className = "control";
		h.href = "#disqus_thread";
		f.appendChild(h);
		
	
		// control to show hide the source of the page
		var h = document.createElement('a');
		h.innerHTML = h.title = "View Source";
		h.href='#view-source';
		h.className = "control";
		f.appendChild(h);
	
	
		/**
		 * DISQUS
		 */
	    var d = document.createElement('div'); d.id = "disqus_thread"; d.style.display = 'none';
	    f.appendChild(d);
		
		// Add script for commenting and attach to our div
		(function() {
		    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
		    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		})();
		
	    /* * * DON'T EDIT BELOW THIS LINE * * */
	    (function () {
	        var s = document.createElement('script'); s.async = true;
	        s.type = 'text/javascript';
	        s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
	        (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
	    }());
			
		/************************************************
		 * Add Google Analytics
		 ************************************************/
		 
		if(window.location.host!=="browserexperiments.com"){
			return;
		}
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-18575680-3']);
		_gaq.push(['_trackPageview']);
		
		(function () {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	
	});
})();




/***********************************************
 * DUMP
 * Javascript Console
 ***********************************************/

function dump(s){
	(function self(name, json, target){
		var div = document.createElement('li');
		var a = document.createElement('a');
		a.innerHTML = name+": ";

		div.appendChild(a);
	
		if(typeof(json)!=='object'){
			a.innerHTML += "<span class='"+ typeof(json) +"'>"+(typeof(json)==='string'?json.replace('<',"&lt;").replace('>',"&gt;"):json)+"</span>";
		}
		else{
			var ul = document.createElement("ul");
			a.addEventListener('click', function(e){

				if(ul.innerHTML.length){
					ul.style.display = (ul.style.display==='block'?'none':'block');
					return;
				}
				
				for(var x in json){
					self(x, json[x], ul);
				}
				e.stopPropagation();
				e.preventDefault();

			}, false);
			div.appendChild(ul);
		}
		target.appendChild(div);
	})(typeof(s), s, document.getElementById("dump"));
}


/***********************************************
 * Console log
 ***********************************************/

if( !( "console" in window ) || typeof(console) !== 'object' || !("log" in console) ){
	window.console = {log:function(){}};
}