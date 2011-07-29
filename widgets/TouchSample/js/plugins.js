//logging
window.log = function(){
  log.history = log.history || [];  
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};

(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


var DEBUG_MODE = true;

(function($) {
    // DEBUG FUNCTION
    $.debug = function(message) {if(DEBUG_MODE){if(window.console) {console.log(message);} else {alert(message);}}};
    $.debug_list = function(message) {if(DEBUG_MODE){if(window.console) {console.dir(message);} else {alert(message);}}};

    // INSTANCE FUNCTION
    $.fn.exists = function(){if(jQuery(this).length == 0){return false;}else{return true;}};

    // BROWSER INFO
    $.browser_size = function() {
        if ($.browser.msie) {
            if($.browser.version < 9) {
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

