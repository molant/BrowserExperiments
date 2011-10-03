/**
 * JQuery-touch
 * Detects when the user is touching the element by a pointing devide, aka mousedown+mousemove, touchmove, MSPointerMove.
 *
 * Author: Andrew Dodson <drew81.com>
 */

// IE10
$("html").attr('style',"-ms-content-zooming: none;overflow:hidden;");

// iOS - fixing the viewport
$(function(){
	document.body.addEventListener('touchmove',function(event){
	  event.preventDefault();
	},false);
});


// JQUERY
(function($){

	/**
	 * Touch
	 * @param callback function - Every touch event fired
	 * @param complete function- Once all touch event ends
	 */
	$.fn.touch = function(callback, complete){


		// Store pointer action
		var mousedown = {};

		$("body").bind('mousedown MSPointerDown', function(e){
			mousedown[e.originalEvent.pointerId||0] = e.originalEvent;
		});
		
		$("body").bind('mouseup MSPointerUp', function(e){
			mousedown[e.originalEvent.pointerId||0] = null;
		});

		// loop through and add events
		return $(this).each(function(){
		

			// 
			$(this)
				.bind("selectstart",function(e){return false;})
				.bind("touchstart touchmove",function(e){
					var touches = e.originalEvent.touches || e.originalEvent.changedTouches || [e];
					for(var i=0; i<touches.length; i++){
						touches[i].pointerId = touches[i].identifier;
						touches[i].offsetX = touches[i].clientX - $(this).offset().left;
						touches[i].offsetY = touches[i].clientY - $(this).offset().top;
						
						// do not paint on the touchstart
						if(e.type==='touchmove'){
							callback.call(this, touches[i],mousedown[touches[i].identifier]);
						}
						// save last event in a object literal
						// to overcome event overwriting which means we can't just store the last event.
						mousedown[touches[i].identifier] = {
							offsetX : touches[i].offsetX,
							offsetY : touches[i].offsetY,
							pointerId : touches[i].pointerId
						};
					}
					e.stopPropagation();
					e.preventDefault();
					return false;
				})
				.bind("mousemove MSPointerMove",function(e){
				
					if(e.type==='mousemove'&&"msPointerEnabled" in window.navigator){
						return;
					}
			
					// default pointer ID
					e.originalEvent.pointerId = e.originalEvent.pointerId || 0;
			
					// only trigger if we have mousedown/pointerdown
					if(( e.originalEvent.pointerId in mousedown ) && ( mousedown[e.originalEvent.pointerId] !== null )){
						callback.call(this,e.originalEvent, mousedown[e.originalEvent.pointerId]);
						mousedown[e.originalEvent.pointerId] = e.originalEvent;
					}
					e.preventDefault();
					e.stopPropagation();
				});
		});
	}


})(jQuery);
