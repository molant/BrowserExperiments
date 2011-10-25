// Add events
(function(){

    var step = 50, // Number of ms to between steps
	    coordX = function (e) {
	        // iOS devices expose "changedTouches"
		    if(e.changedTouches){
			    e = e.changedTouches[0];
		    }
		    return e.clientX;
	    },

        scrollCSS = function(x){
            return {marginLeft : x + "px"};
        };

   // Is this a webkit browser
   if($.browser.webkit){
        // use the CSS3 transform translate3d for hardware acceleration performance
        scrollCSS = function(x){
            var v = "translate3d(" + parseInt(x) + "px,0,0)";
            return  {
                "-moz-transform": v,
                "-webkit-transform": v,
                "transform": v
            };
        }
    }

	$('.slider') // jQuery reference to the slider

    // Lets prevent our mouse from selecting page elements whilst dragging over them
    .live('selectstart', function () {
        return false;
    })

    // Scroll
    .live('scroll', function (e,x) {
    	if(typeof(x)!=='number' || !(x<=0 || x>=0) ) return;
    	$(this).data("offsetX",x);
        $(this).css(scrollCSS(x));
    })

    // Initiate a touch start, and set the initial position. we shall use this to appoximate speed.
    .live('mousedown MSPointerDown touchstart',function(e){

        // prevent any further events getting fired
	    e.preventDefault();

		// Set the data on the attribute
    	$(this).data({
    		origT : (new Date).getTime(),
    		origX : $(this).data("offsetX") || this.offsetLeft,
    		startX : coordX(e.originalEvent) // coordinates of the touch
    	});

	    // stop any previous scrolling
	    clearInterval($(this).data('scrollInt'));
    })

    // Listen out for mouse move events to store the new mouse position
    .live('mousemove MSPointerMove touchmove', function (e) {
    
    	var p = $(this).data();

        // has the swipe started
	    if(!p.startX){
    		// If a scroll is started on any other scrollable area then lets kill it.
    		
    		$(".slider").each(function(){
    			var p = $(this).data();
    			if(p.startX){
    				$(this).trigger('mouseup');
    			}
    		});

	    	return;
	    };
	    e.preventDefault();
			
        // Change the sliders position
		$(this).trigger('scroll', [ p.origX + (coordX(e.originalEvent) - p.startX) ] );
		
    })
    // Listen out for the release, the end of the swipe
    .live('mouseup MSPointerUp touchend', function (e) {
    	var p = $(this).data();
        // dont do anything if we dont have a startX in this scope
        if (!p.startX) return;
        // reset the startX 
	    $(this).data({startX:null});

	    e.preventDefault();
	    
        // Remove the class which changed our cursor

		/**
		 * Add inertia to the slider 
		 */
	    var dist = p.offsetX - p.origX,
		    time = ((new Date).getTime() - p.origT)/1000,
		    speed = dist/time,
		    el = this,
		    width = Math.min($(el).parent().width()-$("figure:last-of-type",el).width(),Math.abs(p.offsetX)+$("figure:last-of-type",el).position().left);

	    var scrollInt = setInterval(function () {

			var p = $(el).data();
			
	    	if(p.offsetX>0){
	    		p.offsetX = p.offsetX*0.85;
	    		dist = 0;
	    	}
	    	else if (p.offsetX < 0 && $("figure:last-of-type",el).position().left < width ){
	    		p.offsetX = p.offsetX + ((width - $("figure:last-of-type",el).position().left)*0.85);
	    		dist = 0;
	    	}

            // what distance has it travelled
		    dist = speed*(step/1000);

		    // move the margin
			$(el).trigger('scroll', [p.offsetX + dist] );
		    // decrease the speed
		    speed *= 0.85;
            // stop the slider when we get to a suitably slow speed
		    if(Math.abs(speed)<2){
			    clearInterval(scrollInt);
			    speed=0;
		    }
	    },step);
	    
	    $(this).data('scrollInt',scrollInt);
    });
})();
