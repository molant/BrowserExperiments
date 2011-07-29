/*
	Copyright 2008 Google Inc. 
	Licensed under the Apache License, Version 2.0 (the "License"); 
	you may not use this file except in compliance with the License. 
	You may obtain a copy of the License at 
	http://www.apache.org/licenses/LICENSE-2.0 Unless required 
	by applicable law or agreed to in writing, software distributed 
	under the License is distributed on an "AS IS" BASIS, WITHOUT 
	WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
	See the License for the specific language governing permissions 
	and limitations under the License.
*/

/* 
	A JavaScript shim implementing the HTML 5 offline manifest format on top of 
	Google Gears. See http://www.whatwg.org/specs/web-apps/current-work/#manifests 
	for details.
	
	@author Brad Neuberg
*/
if (!window.applicationCache) {
	
	// force all functions defined here to be private
	(function(){

		/*
			Quick way to define prototypes; much less verbose than standard 
			foobar.prototype.someFunc = function() lists. See ApplicationCache
			defined below for example use.

			@param f Function object/constructor to add to.
			@param addMe Object literal that contains the properties/methods to
				add to f's prototype.
		*/
		function extend(f, addMe) {
			for (var i in addMe) {
				f.prototype[i] = addMe[i];
			}
		}

		/* 
			Internet Explorer's list of standard XHR PROGIDS. 
		*/
		var XHR_PROGIDS = [
			'MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0', 
			'MSXML2.XMLHTTP',			'Microsoft.XMLHTTP'
		];

		/*
			Standard way to grab XMLHttpRequest object.
		*/
		function xhrObj() {
			if (XMLHttpRequest) {
				return new XMLHttpRequest();
			} else if (ActiveXObject) {
				var xhr = null;
				var i; // save the good PROGID for quicker access next time
				for (i = 0; i < XHR_PROGIDS.length && !xhr; ++i) {
					try {
						xhr = new ActiveXObject(XHR_PROGIDS[i]);
					} catch(e) {}
				}

				if (!xhr) {
					throw 'XMLHttpRequest object not available on this platform.';
				}

				return xhr;
			}
		}
		
		/*
			Useful for closures and event handlers. Instead of having to do
			this:
			
			var self = this;
			window.onload = function(){
					self.init();
			}
			
			you can do this:
			
			window.onload = hitch(this, "init");
			
			@param context The instance to bind this method to.
			@param method A string method name or function object to run on context.
		*/
		function hitch(context, method){
			if (typeof method == "string") {
				method = context[method];
			}
			
			return function(){
				method.apply(context);
			}
		}
		
		/*
			Print debug/log messages on browsers without Firebug. 
		*/
		if (typeof console == "undefined" || !console.debug) {
			console = {};
			console.debug = console.log = function(msg) {
				var e = document.createElement("div");
				e.style.backgroundColor = "white";
				e.style.color = "black";
				e.appendChild(document.createTextNode(msg));
				var body = document.getElementsByTagName("body");
				if (!body || !body.length || body.length == 0) {
					return;
				}
				body[0].appendChild(e);
			}
		}
		
		/*
			The ApplicationCache object is the central entry-point for working
			with HTML 5's offline functionality and cache manifest system.
		*/
		function ApplicationCache() {
			// capture pre-existing window.onload's
			var onload = window.onload || function() {};
			window.onload = hitch(this, function(){
				this.ready_();
				onload();
			});
		}

		extend(ApplicationCache, {
			// update status
			UNCACHED: 0,
			IDLE: 1,
			CHECKING: 2,
			DOWNLOADING: 3,
			UPDATEREADY: 4,
	
			status: 0,
			
			manifest_: "",

			// updates
			update: function() {
	
			},

			swapCache: function() {
	
			},
	
			// dynamic entries
			length: 0,

			item: function(index) {
	
			},

			add: function(uri) {
	
			},

			remove: function(uri) {
	
			},

			// events
	  	onchecking: function() {},
			onnoupdate: function() {},
			ondownloading: function() {},
			onprogress: function() {},
			onupdateready: function() {},
			oncached: function() {},
	
			// Standard DOM EventTarget methods
			addEventListener: function(type, listener, useCapture) {
		
			},
	
			removeEventListener: function(type, listener, useCapture) {
		
			},
	
			dispatchEvent: function(evt) {
		
			},
			
			ready_: function(){
				var html = document.getElementsByTagName("html");
				if (!html || !html.length || html.length == 0) {
					return;
				}
				html = html[0];
				
				// expand potentially relative manifest URIs and
				// assert that they are valid and safe
				this.manifest_ = this.expandURI_(html.getAttribute("manifest"));
				
				console.debug("Expanded manifest="+this.manifest_);
			},
			
			/* 
				Expands the given URI if it is relative or absolute, and 
				ensures that the expanded URI follows the same-domain policy.
			*/
			expandURI_: function(uri) {	
				if(!uri) {
					throw new Error("Invalid URI: " + uri);
				}
				
				// parse the URI, which possibly has no scheme/host/port
				var m = uri.match(/^\s*(?:(\w+):\/\/([^\/:]+)?(?::(\d+))?)?(.*)$/);
				var scheme = m[1];
				var host = m[2];
				var port = m[3] || "80";
				var path = m[4];
				
				// safe scheme?
				if (scheme && (scheme != "http" || scheme != "http")) {
					throw new Error("Unsafe scheme: " + uri);
				}
				
				// determine what our page's scheme, host, and port are
				var pageScheme = window.location.protocol;
				// some browsers have a trailing :
				if (pageScheme && pageScheme.charAt(pageScheme.length - 1) == ":") {
					pageScheme = pageScheme.substring(0, pageScheme.length - 1);
				}
				var pageHost = window.location.hostname;
				var pagePort = window.location.port || "80";
				
				// fully expanded already?
				if (scheme) {
					// nothing to do
				} else {			
					// is this an absolute URI? Then just paste scheme/host/port to front
					if (uri.charAt(0) == "/") {
						uri = pageScheme + "://" + pageHost + ":" + pagePort + uri;
					} else { // relative URI
						var pathname = window.location.pathname;
						if (!pathname) {
							pathname = "/";
						}
						
						// scan from right to left until we hit a slash
						var i;
						for (i = pathname.length - 1; i >= 0; --i) {
							if (pathname.charAt(i) == "/") {
								break;
							}
						}
						
						pathname = pathname.substring(0, i + 1);
						
						uri = pageScheme + "://" + pageHost + ":" + pagePort 
									+ pathname + uri; 
					}
				}
					
				// reparse the expanded URI now
				m = uri.match(/^\s*(?:(\w+):\/\/([^\/:]+)?(?::(\d+))?)?(.*)$/);
				scheme = m[1];
				host = m[2];
				port = m[3] || "80";
				
				// finally, does our scheme/host/port follow the same-domain
				// security policy?
				if(scheme == pageScheme && host == pageHost && port == pagePort) {
					return uri; // we're golden
				} else {
					throw new Error("Insecure URI: " + uri);
				}
			}
		}); // end define(ApplicationCache)

		// now expose the actual, public entry point for the HTML 5
		// offline functionality
		window.applicationCache = new ApplicationCache();
		
	})(); // end (function(){
} // end if (!window.applicationCache)


// gears_init.js code revision 625. We include it here for two reasons:
// 1) It makes this library much easier to use and self-contained in
// a single file rather than requiring end-users to bring in several
// JS files.
// 2) It encapsulates us from writing our own logic, making sure we
// work on strange platforms like WinCE.

(function() {
  // We are already defined. Hooray!
  if (window.google && google.gears) {
    return;
  }

  var factory = null;

  // Firefox
  if (typeof GearsFactory != 'undefined') {
    factory = new GearsFactory();
  } else {
    // IE
    try {
      factory = new ActiveXObject('Gears.Factory');
      // privateSetGlobalObject is only required and supported on WinCE.
      if (factory.getBuildInfo().indexOf('ie_mobile') != -1) {
        factory.privateSetGlobalObject(this);
      }
    } catch (e) {
      // Safari
      if (navigator.mimeTypes["application/x-googlegears"]) {
        factory = document.createElement("object");
        factory.style.display = "none";
        factory.width = 0;
        factory.height = 0;
        factory.type = "application/x-googlegears";
        document.documentElement.appendChild(factory);
      }
    }
  }

  // *Do not* define any objects if Gears is not installed. This mimics the
  // behavior of Gears defining the objects in the future.
  if (!factory) {
    return;
  }

  // Now set up the objects, being careful not to overwrite anything.
  //
  // Note: In Internet Explorer for Windows Mobile, you can't add properties to
  // the window object. However, global objects are automatically added as
  // properties of the window object in all browsers.
  if (!window.google) {
    google = {};
  }

  if (!google.gears) {
    google.gears = {factory: factory};
  }
})();