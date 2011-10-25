/**
 *	Author: Andrew Dodson <drew81.com>
 *	CopyRight: Andrew Dodson 
 */


$(function(){

	var stop = true;
	
	$('#svg rect').touch(function(e,o){
			// event fired for each touch
			svg('path', 
				{
					fill:'none',
					stroke:'#9f9f9f', 
					d:'M'+o.offsetX+','+o.offsetY+'L'+e.offsetX+','+e.offsetY, 
					style:'stroke-width:10px', 
					"stroke-width" : 3
				}, 
				this.parentNode);
		});
	
	
	function pause(bool){
		stop = bool;
		$play.removeClass(bool?'play':'pause').addClass(!bool?'play':'pause');
	}
	
	/**
	 * once the button is clicked start/stop annimation
	 */
	var $play = $("button.go").click(function(){
	
	
		// turn off the brakes
		if(	!stop ){
			pause(true);
			return;
		}
		else {
			pause(false);
		}
	
		// take the paths and join them together so that we can work with them more easily
		var L="",p,reg=/([LM])\s*([0-9\.]+)[\s,]+([0-9\.]+)\s*/ig, bb = {};
		$("#svg path").each(function(){
	
			var m = $(this).attr('d').match(/M\s*([0-9\.]+[\s,]+[0-9\.]+)\s*L\s*([0-9\.]+[\s,]+[0-9\.]+)/);
	
			if(L!==m[1]){
				// create a new path tag
				p = this;
			}
			else{
				p.setAttribute('d', p.getAttribute('d') + ' L ' + m[2]);
				$(this).remove();
			}
			// update our last position
			L = m[2];
		});
		
		$("#svg").each(function(){
			bb = {
				x : parseInt(this.getAttribute('width')),
				X : 0,
				y : parseInt(this.getAttribute('height')),
				Y : 0
			};
		});
		
	
		// loop through the path and get the bounding box
		$("#svg path").each(function(){
			var d = this.getAttribute('d').substr(1),
				a = d.replace(/^\s+/,'').replace(/\s+$/,'').split(/\s*L\s*/);
	
			for(var i=0;i<a.length;i++){
				_a = a[i].split(/[,\s]+/);
				_a = [parseInt(_a[0]),parseInt(_a[1])];
	
				if(bb.x>_a[0]){
					bb.x = _a[0];
				}
				else if(bb.X<_a[0]){
					bb.X = _a[0];
				}
				if(bb.y>_a[1]){
					bb.y = _a[1];
				}
				else if(bb.Y<_a[1]){
					bb.Y = _a[1];
				}
			}
		});
	
	
		// print bounding box
		bb.w = bb.X - bb.x;
		bb.h = bb.Y - bb.y;
	
		// loop through the paths and transform the objects to skew to a rombus..
		$("#svg path").each(function(){
	
			var path = this,
				i = 1;
	
	
			(function self(){
				var d = path.getAttribute('d');
				var s = d.replace(reg, function(m,s,x,y){
					var dh = ((y - bb.y)/bb.h),
						dw = ((x - bb.x)/bb.w);
	
					if(!i){
						dw = 1-dw;
					}
	
					return " " + s + " " + x + " " + (((((dh-0.5)*((dw*0.85)+0.30))+0.1)*bb.h)+bb.y); 
				});
				i = !i;
				transition(path, {d:s.replace(/^\s/,'')}, 300, self);
			})();
		});
		
	});
	
	/**
	 * Clear the board
	 */
	$("button.clr").click(function(){
		pause(true);
		$("#svg path").remove();
	});
	
	
	function transition(elem,attr,dur, callback){
		var step = {},
			loop = true;
		dur = dur || 1e3;
		var iterations = ((dur/1000)*60);
	
		for(var x in attr){
			var sp = /[^0-9\.\-]+/ig,
				d = elem.getAttribute(x),
				a = d.split(sp),
				b = attr[x].split(sp);
			
			a.shift();
			b.shift();
	
			step[x] = [];
			for(var i=0;i<a.length;i++){
				step[x][i] = (b[i]-a[i])/iterations;
			}
		}
	
	
		(function self(){
			for(var x in attr){
				var i=0,
					d = elem.getAttribute(x),
	
				_d = d.replace(/[0-9\.\-]+/ig, function(m){
					return parseFloat(m) + ((loop===false?-1:1)*parseFloat(step[x][i++]));
				});
				elem.setAttribute(x, _d);
			}
			if(iterations-- > 0){
				setTimeout(self,1e3/60);
			}
			else if(loop){
				loop = false;
				iterations = ((dur/1000)*60);
				setTimeout(self,1e3/60);
			}
			else if(!stop){
				callback();
			}
		})();
	}
});


/**
 * SVG
 * jQuery cannot handle the insertion of SVG elements... neither can browsers.
*/

function svg(tag, attrs, target) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs){
		el.setAttribute(k, attrs[k]);
	}
	if(target){
		target.appendChild(el)
	}
	
	return el;
}
