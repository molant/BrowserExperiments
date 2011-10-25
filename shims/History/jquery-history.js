/** 
 * jquery-history.js
 * @author Andrew Dodson
 *
 * this is so simple it doesn't need an explanation really
 */

(function ($) {
	$.extend({

		/**
		 * History
		 * 
		 * @param string 	selector : This is a live selector and will listen to any change made on the selected elements
		 * @param function	callback : 
		 */
		history : function(selector, callback){

		    // Listen for any anchor tag call
		    $(selector).live("click", function (e) {
		        // prevent the default reloading the page
		        e.preventDefault();
		        // Does the browser support popstate?
		        if ("history" in window && !!history.pushState) {
		            // Goodbye hashchange, you weren't great at deeplinking and SEO but you did create a nice UX.
		            // Is this a change in location?
		            history.pushState({}, this.title, this.href);
		            // Safari doesn't update our search string
		            $(window).trigger('popstate');
		            return false;
		        }
		        window.location.hash = this.href;
		    });

		    // Listen out to the new change in
		    $(window).bind("hashchange popstate", function () {
		        // Get the new url
		        var url = (window.location.hash.replace(/\#/, '') || window.location.pathname);
		        callback(url);
			});
		}
	});


    // Hashchange event doesn't get triggered in all browsers to make it compatible
    // For IE 6,7
    if (!history.pushState && (!("onhashchange" in window) || ($.browser.msie && $.browser.version === '7.0'))) {
        var hash = window.location.hash;
        setInterval(function () {
            if (window.location.hash !== hash) {
                $(window).trigger('hashchange');
                hash = window.location.hash;
            }
        }, 500);
    }
})(jQuery);
