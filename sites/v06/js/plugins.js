window.log = function () {
    log.history = log.history || [];
    log.history.push(arguments);
    arguments.callee = arguments.callee.caller;
    if (this.console) console.log(Array.prototype.slice.call(arguments));
};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

function BlockMove(event) {
    event.preventDefault();
}

function hasTouchSupport(){return ('ontouchstart' in window);};

function get_next_depth(current_dept, $obj) {
    var current_lvl = current_dept;
    if ($obj.children().exists()) {
        $obj.children().each(function () {
            if ($(this).children().exists()) {
                if ($(this).attr('name')) {
                    current_lvl[$(this).attr('name')] = {};
                    current_lvl[$(this).attr('name')]['type'] = this.nodeName;
                    current_dept = current_lvl[$(this).attr('name')];
                }
                else {
                    current_lvl[this.nodeName] = {};
                    current_dept = current_lvl[this.nodeName];
                }
                get_next_depth(current_dept, $(this));
            }
            else {
                if (($(this).attr('browser') != undefined) && (type_browser == $(this).attr('browser'))) {
                    current_lvl[this.nodeName] = $(this).text();
                    if (this.nodeName == 'src') {
                        array_assets[$(this).text()] = current_dept;
                    }

                }
                if ($(this).attr('browser') == undefined) {
                    current_lvl[this.nodeName] = $(this).text();
                    if (this.nodeName == 'src') {
                        array_assets[$(this).text()] = current_dept;
                    }
                }
            }


            for (var i = 0; i <= $(this)[0].attributes.length - 1; i++) {
                if (($(this).attr('browser') != undefined) && (type_browser == $(this).attr('browser'))) {
                    current_dept[$(this)[0].attributes[i].nodeName] = $(this)[0].attributes[i].nodeValue;
                }
                if ($(this).attr('browser') == undefined) {
                    current_dept[$(this)[0].attributes[i].nodeName] = $(this)[0].attributes[i].nodeValue;
                }
            }

        });
    }
}


var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
		{
		    string: navigator.userAgent,
		    subString: "Chrome",
		    identity: "Chrome"
		},
		{ string: navigator.userAgent,
		    subString: "OmniWeb",
		    versionSearch: "OmniWeb/",
		    identity: "OmniWeb"
		},
		{
		    string: navigator.vendor,
		    subString: "Apple",
		    identity: "Safari",
		    versionSearch: "Version"
		},
		{
		    prop: window.opera,
		    identity: "Opera"
		},
		{
		    string: navigator.vendor,
		    subString: "iCab",
		    identity: "iCab"
		},
		{
		    string: navigator.vendor,
		    subString: "KDE",
		    identity: "Konqueror"
		},
		{
		    string: navigator.userAgent,
		    subString: "Firefox",
		    identity: "Firefox"
		},
		{
		    string: navigator.vendor,
		    subString: "Camino",
		    identity: "Camino"
		},
		{		// for newer Netscapes (6+)
		    string: navigator.userAgent,
		    subString: "Netscape",
		    identity: "Netscape"
		},
		{
		    string: navigator.userAgent,
		    subString: "MSIE",
		    identity: "Explorer",
		    versionSearch: "MSIE"
		},
		{
		    string: navigator.userAgent,
		    subString: "Gecko",
		    identity: "Mozilla",
		    versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
		    string: navigator.userAgent,
		    subString: "Mozilla",
		    identity: "Netscape",
		    versionSearch: "Mozilla"
		}
	],
    dataOS: [
		{
		    string: navigator.platform,
		    subString: "Win",
		    identity: "Windows"
		},
		{
		    string: navigator.platform,
		    subString: "Mac",
		    identity: "Mac"
		},
		{
		    string: navigator.userAgent,
		    subString: "iPhone",
		    identity: "iPhone/iPod"
		},
		{
		    string: navigator.platform,
		    subString: "Linux",
		    identity: "Linux"
		}
	]

};
BrowserDetect.init();



$.fn.animationComplete = function (callback) {
    if (Modernizr.csstransforms3d) {
        return $(this).one('webkitAnimationEnd', callback);
    } else {
        // defer execution for consistency between webkit/non webkit
        setTimeout(callback, 0);
        return $(this);
    }
};


var DEBUG_MODE = true;

(function ($) {
    // DEBUG FUNCTION
    $.debug = function (message) { if (DEBUG_MODE) { if (window.console) { console.log(message); } else { alert(message); } } };
    $.debug_list = function (message) { if (DEBUG_MODE) { if (window.console) { console.dir(message); } else { alert(message); } } };

    // INSTANCE FUNCTION
    $.fn.exists = function () { if (jQuery(this).length == 0) { return false; } else { return true; } };

    // BROWSER INFO
    $.browser_size = function () {
        if ($.browser.msie) {
            if ($.browser.version < 9) {
                var document_width = $(window).height();
                var document_height = $(document).height();
                return [
                    window.innerWidth ||                        // ie7+
                            document.documentElement.clientWidth ||     // ie6
                            document.body.clientWidth,                  // ie6 quirks mode
                    document_height - document_width < 20 ? document_width : document_height
                ];
            }
            return [$(window).width(), $(window).height()];

        }
        return [$(window).width(), $(window).height()];
    };

})(jQuery);