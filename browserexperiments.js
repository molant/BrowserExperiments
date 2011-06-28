/**
 * Supports HTML5 tags? No then go and create them
 */
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

/** 
 * Add Styles
 */
(function(){
	var s = document.createElement('link');
	s.rel="stylesheet";
	s.href = "../browserexperiments.css";
	document.getElementsByTagName('head')[0].appendChild(s);
})();



/***********************************************
 * 				DISQUS
 ***********************************************/

/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
var disqus_shortname = 'browserexperiments'; // required: replace example with your forum shortname

// The following are highly recommended additional parameters. Remove the slashes in front to use.
var disqus_identifier = "be_"+window.location.pathname;
// var disqus_url = 'http://example.com/permalink-to-page.html';



/**
 * Run this when the page has loaded
 */
window.onload = function(){

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
	 * COMMENTING by DISQUS
	 */

    // Controls to show hide disqus
	var h = document.createElement('a');
	h.onclick = function(){
		document.getElementById("disqus_thread").style.display = "block";
	};
	h.innerHTML = h.title = "Comments";
	f.appendChild(h);
	

	// control to show hide the source of the page
	var h = document.createElement('a');
	h.innerHTML = h.title = "View Source";
	h.href='#view-source';
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
}



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
 * VIEW SOURCE EVENT
 *********************************/

(function () {
	
	// add pretify
    var prit = document.createElement('script'); prit.type = 'text/javascript'; prit.async = true;
    prit.src = '../Common/jsprettify.packed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(prit);

	var pre = document.createElement('pre');
	pre.id = "view-source"
	
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
  
})();



/************************************************
 * Add Google Analytics
 ************************************************/
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2472425-10']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
