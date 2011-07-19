/*
	* Sprite.js
	* Represents a sprite to be rendered on a <canvas>
	* Version: 1.0
*/

function SpriteQueue() {
	this.sprites = new Array();
	this.spritesHash = new Object();
	this.updated;
	
	this.paint = function() {
		//paint all sprites in the array		
		$.each(this.sprites, function(i, sprite) {
			sprite.paint();
			sprite.updated = true;
		});
		
		//remove inactive sprites from the array
		for (var i=0; i < this.sprites.length; i++) {
			var sprite = this.sprites[i];
		
			if (sprite.active == false) {
				this.remove(i);
				i--;	
			}
		}

		this.updated = false; //repaint is finished
	}
	

	this.add = function(sprite) {
		//add sprite to sprites array
		this.sprites.push(sprite);
		this.sprites.sort(function(a, b) { return a.zIndex - b.zIndex; });
		
		//add sprite to sprites hash for fast lookup based on id
		this.spritesHash[sprite.id] = sprite
		this.updated = true; //force a repaint
	}
	
	this.remove = function(i) {
		var sprite = this.sprites[i];
		if (sprite.deallocateFn) sprite.deallocateFn();		
		this.spritesHash[sprite.id] = null;
		this.sprites.splice(i, 1); //remove the element from the array
	}
	
	this.removeAll = function() {
		for (var i=0; i < this.sprites.length; i++) {
			this.remove(i);
		};
	}
	
	//fast lookup of sprite based on Id. 
	this.get = function(id) {
		return this.spritesHash[id];
	}
	
	this.getAll = function() {
		return this.sprites;
	}
	
	//lookup of sprites based on a specific property (eg, name)
	this.find = function(property, value, like) {
		var matchedSprites = new Array();
	
		$.each(this.sprites, function(i, sprite) {
			var match = false;
			
			if (like) {
				if (sprite[properly].indexOf(value) >= 0) {
					match = true;
				}
			}
			else {
				if (sprite[property] == value) {
					match = true;
				}
			}
			if (match) matchedSprites.push(sprite);
		});	
		
		return matchedSprites;
	}
	
	this.toString = function() {
		var str = 'length: ' + this.sprites.length + '\n';
	
		$.each(this.sprites, function(i, sprite) {
			str += sprite.toString() + '\n';
		});
		
		return str;
	}	
}

function Sprite(params) {
	//parse required parameters
	this.id = 					params.id == null ? 'unnamed' : params.id; 						//id of sprite - MUST be unique
	this.container =			params.container == null ? null : params.container; 			//parent container element to append to	

	//parse optional parameters
	this.name = 				params.name == null ? null : params.name; 						//name of sprite - does not need to be unique (could identify a group)
	this.x = 					params.x == null ? 0 : params.x; 								//x coordinate
	this.y = 					params.y == null ? 0 : params.y; 								//y coordinate
	this.zIndex =				params.zIndex == null ? 0 : params.zIndex;						//z-index to determine layer
	this.text =					params.text == null ? null : params.text; 						//text to render
	this.align =				params.align == null ? null : params.align;							//text alignment
	this.font =					params.font == null ? null: params.font;						//font for text
	this.color = 				params.color == null ? null : params.color;						//color for text
	this.dropShadow =			params.dropShadow == null ? null : params.dropShadow;			//if true, a drop shadow will be created
	this.alpha =				params.alpha == null ? 1 : params.alpha;						//opacity value
	this.imageStrip = 			params.imageStrip == null ? null : params.imageStrip; 			//Sprite sheet
	this.imageStripColCount = 	params.imageStripColCount == null ? null : params.imageStripColCount; //Num of Cols in sprite sheet
	this.imageStripRowCount = 	params.imageStripRowCount == null ? null : params.imageStripRowCount;  //Nul of Rows in sprite sheet
	this.image = 				params.image == null ? null : params.image;						//Regular single image
	this.scaleX =				params.scaleX == null ? 1 : params.scaleX; 						//scale amount (height)
	this.scaleY = 				params.scaleY == null ? 1 : params.scaleY; 						//scale amount (width)
	this.rotate =				params.rotate == null ? 0 : params.rotate; 						//rotate amount (in degrees)
	this.width = 				params.width == null ? 0 : params.width;						//width (for collision detection purposes only)
	this.height = 				params.height == null ? 0 : params.height;						//height (for collision detection purposes only)
	this.deltaX = 				params.deltaX == null ? 0 : params.deltaX;						//x increases at a constant velocity
	this.deltaY = 				params.deltaY == null ? 0 : params.deltaY;						//y increases at a constant velocity
	this.deltaDelay = 			params.deltaDelay == null ? 0 : params.deltaDelay;				//delay before x/y position is changed
	this.composite = 			params.composite == null ? null : params.composite;				//composite effect
	this.evalFn = 				params.evalFn == null ? null : params.evalFn;					//function to evaluate on every frame
	this.deallocateFn = 		params.deallocateFn  == null ? null : params.deallocateFn;		//function to evaluate once sprite becomes in
	
	this.onclick =				params.onclick == null ? null : params.onclick;					//click event handler
	
	//variables
	this.active = 				true;
	this.currentCellX = 		0;
	this.currentCellY = 		0;
	this.context =				this.container.get(0).getContext('2d'); //get a handle to the canvas context
	
	this.customAnimate = true;
	this.updated = false;

this.set = function(property, value) {
		this[property] = value;
		controller.spriteQueue.updated = true;
		this.updated = true;		
}
	
this.paint = function() {

    if (this.active) {
   
            //increment position
            this.x += this.deltaX;
            this.y += this.deltaY;

            //make changes to canvas settings
            this.context.save();
            if (this.color != null) this.context.fillStyle = this.color;
            this.context.globalAlpha = this.alpha;

            var translateX = this.x;
            var translateY = this.y;
            if (this.align != null) this.context.textAlign = this.align;

            this.context.translate(translateX, translateY);

            if (this.dropShadow) {
                this.context.shadowOffsetX = 2;
                this.context.shadowOffsetY = 2;
                this.context.shadowBlur = 5;
                this.context.shadowColor = 'rgba(0, 0, 0, ' + (this.alpha * 0.5) + ')';
            }

            var transformAboutCenter = (this.width != 0 && this.height != 0) ? true: false;
            if (transformAboutCenter) this.context.translate(this.width * 0.5, this.height * 0.5);
            if (this.scaleX != 1 || this.scaleY != 1) this.context.scale(this.scaleX, this.scaleY);
            if (this.rotate != 0) this.context.rotate(this.rotate * Math.PI / 180);
            if (transformAboutCenter) this.context.translate( - this.width * 0.5, -this.height * 0.5);
            if (this.composite != null) this.context.globalCompositeOperation = this.composite;


            if (this.image != null) this.paintImage();					//render the image on the canvas			
            else if (this.imageStrip != null) this.paintImageStrip();   //render Image Strip
            else this.paintText();						                //render text on the canvas
            this.context.restore();						                //restore canvas settings

        }    
}


this.paintImage = function () {
    try {
        var image = this.image;
        if (image != null) this.context.drawImage(image, 0, 0, this.width, this.height);
    }
    catch (err) {
  	
    }
}

	
this.updateImageStrip = function(){
	
	this.currentCellX++;
	if(this.currentCellX >= this.imageStripColCount)
	{
		this.currentCellX = 0;
		this.currentCellY++;
		
		if(this.currentCellY >= this.imageStripRowCount) this.currentCellY = 0;
			
	}
		
}	

this.paintImageStrip = function () {

	var strip = this.imageStrip;
	
	if(strip != null)
	{

		this.context.drawImage(strip, this.currentCellX * this.width, 
									  this.currentCellY * this.height, 
									  this.width, 
									  this.height, 
								      this.x, 
								      this.y, 
								      this.width, 
								      this.height);
	}
	
	this.updateImageStrip();
	
}
	
this.paintText = function() {
		if (this.context.fillText) {
			if (this.context.font != null) this.context.font = this.font;
			this.context.textBaseline = 'top';
			this.context.fillText(this.text, 0, 0);			
		}
	}
	
	this.click = function(e) {
		
		
		if (this.onclick != null) {
			var position = this.getRelativePosition(e);
			if (this.isHit(position.x, position.y)) {
				this.onclick();
			}
		}
		
	}
	
	this.isHit = function(x, y) {
		if (x >= this.x && x <= this.x + this.width &&
			y >= this.y  && y <= this.y + this.height)
			return true;
		else return false;
	}
	
	this.getRelativePosition = function(e) {
		var t = this.container.get(0);
		var x = e.clientX + (window.pageXOffset||0);
		var y = e.clientY + (window.pageYOffset||0);
								
		do {
			x -= t.offsetLeft+parseInt(t.style.borderLeftWidth||0),
			y -= t.offsetTop+parseInt(t.style.borderTopWidth||0);	
		}
		while (t=t.offsetParent);
		return {x:x,y:y};
	}
	
	this.toString = function() {
		var str = 	this.id + ' ' +  
					'(' + parseInt(this.x) + ',' + parseInt(this.y) + ') ' +
					'(' + parseInt(this.deltaX) + ',' + parseInt(this.deltaY) + ') ' +
					(this.active ? 'active' : 'inactive')
			
		return str;
	}
}

Sprite.computeWidth = function(o, font, container) {
	var context = container.get(0).getContext('2d'); //get a handle to the canvas context
	var width = 0;
	if(typeof o == 'string') {
		if (context.measureText != null) {
			context.save();
			context.font = font;
			var textDim = context.measureText(o);
			width = textDim.width;
			context.restore();
		}
	}
	else {
		width = o.width;
	}
	return width;
}
	
Sprite.computeHeight= function(o, font, container) {
	var context = container.get(0).getContext('2d'); //get a handle to the canvas context
	var height = 0;
	if(typeof o == 'string') {
		if (context.measureText) {
			context.save();
			context.font = font;	
			var textDim = context.measureText('gM');
			height = textDim.width; //browsers don't currently support height measurement
			context.restore();
		}
	}
	else {
		height = o.height;
	}	
	return height;
}	


// Allow animating object properties directly.
var $_fx_step_default = $.fx.step._default;
$.fx.step._default = function (fx) {
	if (!fx.elem.customAnimate) return $_fx_step_default(fx);
	fx.elem[fx.prop] = fx.now;
	fx.elem.updated = true;
	controller.spriteQueue.updated = true;
};	
