function Controller() {
///////////////////////////////////////////////////////////////////////////////////////////
// constants
///////////////////////////////////////////////////////////////////////////////////////////
				
this.IMAGE_PATH = 				'images/';								//path to images
this.SOUND_PATH =				'sound/';								//path to sound
this.PAINT_INTERVAL = 			40;										//frequency of canvas repaint in milliseconds
this.ANIMATE_INTERVAL = 		40;										//frequency of jquery animation changes, in milliseconds	
this.TEXT_MOVE_X = 				35;										
this.COMPOSITE_TYPE = 			'source-over';							// lighter, darker, xor, destination-out, source-over(default)

///////////////////////////////////////////////////////////////////////////////////////////
// variables
///////////////////////////////////////////////////////////////////////////////////////////
var _this = this;
this.supportsCanvas;									//whether canvas is supported by browser		
this.canvasWidth;										//width of the canvas
this.canvasHeight;										//height of the canvas			
this.imagesToPreload;									//images to preload
this.imagesPreloaded;									//count of how many images have been preloaded
this.spriteQueue;										//array of active sprites		
this.sprites;
this.paintInterval;										//handle to setInterval() for paint method
this.loadingGraphicInterval;							//handle to setInterval() for loading graphic method

this.loadProgressElement;
this.canvasElement; 									//handle to load progress element
this.canvasElementContext;								//handle to canvas context

this.spriteImg;
this.ringSprite;

this.plusImg;
this.plusSprite;


this.SlotBlurImg;
this.BlurSprite;
this.BlurSprite2;
this.BlurSprite3;

this.SlotImg;
this.SlotSprite;
this.SlotSprite2;
this.SlotSprite3;


this.isSpinning = false;
this.spin1 = false;
this.spin2 = false;
this.spin3 = false;

this.resultXML;
this.tempResult
this.resultsHTML;




///////////////////////////////////////////////////////////////////////////////////////////
// initialization
///////////////////////////////////////////////////////////////////////////////////////////
//determine if this browser supports the HTML5 canvas
this.detectSupportsCanvas = function () {
    return true;
    //	return !!document.createElement('canvas').getContext;
}

this.load = function () {
    //detect if the browser supports the html5 canvas element
    _this.supportsCanvas = _this.detectSupportsCanvas();

    //canvas method
    if (_this.supportsCanvas) {
        //get a handle to page elements
        _this.canvasElement = document.getElementById('canvas');
        if (typeof G_vmlCanvasManager !== 'undefined') {
            G_vmlCanvasManager.initElement(_this.canvasElement);
        }

        //measure content size				
        _this.canvasWidth = '425';
        _this.canvasHeight = '160';

        //get a handle to the canvas elements
        _this.canvasElementContext = _this.canvasElement.getContext('2d');
    }

    //create array to hold sprites
    if (_this.spriteQueue) _this.spriteQueue.removeAll();
    _this.spriteQueue = new SpriteQueue();

    _this.resultsHTML = $("#results");

    _this.loadXML();

    _this.createSprites();

    _this.paintStart();

}			

this.loadXML = function() {

	$.ajax({
		type: "GET",
		url: "xml/results.xml",
		dataType: "xml",
		success: function(data){			 
			 resultXML  = $(data); //cached jquery object to minimize jquery lookups later
		} 								
	}); //close ajax	
		
}

this.createSprites = function() {

	//Create slot image
	_this.SlotImg = new Image();
   	_this.SlotImg.src = 'images/slots.jpg';
	
	
	//Create Blur Image
	_this.SlotBlurImg = new Image();
	_this.SlotBlurImg.src = 'images/blur.jpg';
	
	
	//Create sprite for each slot
	_this.SlotSprite = new Sprite({
	        id: 'slot1',
	        container: _this.canvasElement,
	        image: _this.SlotImg,
	        alpha: 1,
	        x: 10,
	        y: 0,
	        rotate: 0,
	        zIndex: 1,
	        width: 120,
	        height: 2100
	    });

		_this.SlotSprite2 = new Sprite({
		        id: 'slot2',
		        container: _this.canvasElement,
		        image: _this.SlotImg,
		        alpha: 1,
		        x: 150,
		        y: 0,
		        rotate: 0,
		        zIndex: 1,
		        width: 120,
		        height: 2100
		    });
	
		_this.SlotSprite3 = new Sprite({
		        id: 'slot3',
		        container: _this.canvasElement,
		        image: _this.SlotImg,
		        alpha: 1,
		        x: 290,
		        y: 0,
		        rotate: 0,
		        zIndex: 1,
		        width: 120,
		        height: 2100
		    });


    	_this.spriteQueue.add(_this.SlotSprite);
    	_this.spriteQueue.add(_this.SlotSprite2);
    	_this.spriteQueue.add(_this.SlotSprite3);

			//Create Blur for Each Slot
		_this.BlurSprite = new Sprite({
	        id: 'blur1',
	        container: _this.canvasElement,
	        imageStrip: _this.SlotBlurImg,
			imageStripColCount: 2,
			imageStripRowCount: 6,			
	        alpha: 1,
	        x: 0,
	        y: 5,
	        rotate: 0,
	        zIndex: 1,
	        width: 140,
	        height: 140
	    });
		
		_this.BlurSprite2 = new Sprite({
	        id: 'blur2',
	        container: _this.canvasElement,
	        imageStrip: _this.SlotBlurImg,
			imageStripColCount: 2,
			imageStripRowCount: 6,			
	        alpha: 1,
	        x: 70,
	        y: 5,
	        rotate: 0,
	        zIndex: 1,
	        width: 140,
	        height: 140
	    });
		
		_this.BlurSprite3 = new Sprite({
	        id: 'blur3',
	        container: _this.canvasElement,
	        imageStrip: _this.SlotBlurImg,
			imageStripColCount: 2,
			imageStripRowCount: 6,			
	        alpha: 1,
	        x: 140,
	        y: 5,
	        rotate: 0,
	        zIndex: 1,
	        width: 140,
	        height: 140
	    });
}		
		
this.spin = function(){
	
		
	if(!_this.isSpinning)
	{
	
		_this.showBlur(); //Show Blur
	
		
		//clear old result text
		$('#results').empty();
		
		//get random number 1-total number of results
		var numResults = resultXML.find('result').length;
		var r=randomFromTo(1,numResults); 
		
		//Create empty result object
		tempResult = new Object();
		
		//loop through xml, find each result
		
		resultXML.find('result').each(function(){						
			
			//store reference to avoid unncessary jquery lookups
			var temp = $(this); 
				
				//if id matches random number
				if(temp.attr('id') == r)
				{
					
					tempResult.disc1 = temp.find('disc01').text();
					tempResult.disc2 = temp.find('disc02').text();
					tempResult.disc3 = temp.find('disc03').text();				
					
					tempResult.yPos1 = temp.find('disc01').attr('y');
					tempResult.yPos2 = temp.find('disc02').attr('y');
					tempResult.yPos3 = temp.find('disc03').attr('y');
					
					if (tempResult.disc2 != "") tempResult.disc1 += ",&nbsp;";
					if (tempResult.disc3 != "") tempResult.disc2 += ",&nbsp;";						
					
					return true;	
				}
				
		}); //close each
	
		
		$(_this.SlotSprite).animate({ y: -tempResult.yPos1 }, 0 ); 
		$(_this.SlotSprite2).animate({ y: -tempResult.yPos2 }, 0 ); 
		$(_this.SlotSprite3).animate({ y: -tempResult.yPos3 }, 0 ); 			
		
		
		
		//display result
		$('<div class="result" id="id_'+tempResult.id+'"></div>').html('<span id="rowitems"></span>').appendTo('#results');	
		
		$('<h4>').html(tempResult.disc1).appendTo('#rowitems');
		$('<h4>').html(tempResult.disc2).appendTo('#rowitems');
		$('<h4>').html(tempResult.disc3).appendTo('#rowitems');
		
		_this.resultsHTML.animate({opacity: 0}, 0); 
		_this.resultsHTML.delay(3300).animate({opacity: .95}, 300);
		 
	
	}
} //close spin

this.showBlur = function(){
															
		_this.isSpinning = true;
		_this.spin1 = true;
		_this.spin2 = true;
		_this.spin3 = true;
										
		setTimeout(function(){ _this.spin1 = false; _this.snap(_this.SlotSprite);  }, 2000);
		setTimeout(function(){ _this.spin2 = false; _this.snap(_this.SlotSprite2); }, 2700);
		setTimeout(function(){ _this.spin3 = false; _this.snap(_this.SlotSprite3); _this.isSpinning = false;}, 3200);		
}


this.snap = function(slot){
		
	var yPos = slot.y;
					
	 $(slot).animate({ y: yPos-30 }, 0 )
			.animate( { y: yPos } , 250, 'easeOutBack' );
			
	
	//var Stop = new Audio("sound/Stop.wav");
	//Stop.play();
				
}


function randomFromTo(from, to){
       return Math.floor(Math.random() * (to - from + 1) + from);
}


///////////////////////////////////////////////////////////////////////////////////////////
// painting methods
///////////////////////////////////////////////////////////////////////////////////////////
this.paintStart = function () {	    
		_this.paintInterval = setInterval( 
			function(){ 
				try {
					_this.paint(); 
				}
				//stop the painting refresh if an error occurs
				catch(e) {
				    windows.console.log('paintStart-common');
                    _this.paintStop();
					throw(e);
				}							
			}
			, _this.PAINT_INTERVAL
		);	
	}
	
	this.paintStop = function() {
		window.clearTimeout(_this.paintInterval);
	}

	this.clear = function() {
		if (_this.supportsCanvas) {
		    _this.canvasElementContext.clearRect(0, 0, _this.canvasWidth, _this.canvasWidth); 	
		}
	}

	this.paint = function() {
							
		//clear the canvas
		_this.clear();
	
		_this.spriteQueue.paint();		
				
		if(_this.spin1) _this.BlurSprite.paint(); 
		if(_this.spin2) _this.BlurSprite2.paint();
		if(_this.spin3) _this.BlurSprite3.paint();
	}
		
}		


//to improve performance, override default jquery animation timeout
jQuery.fx.prototype.custom = function( from, to, unit ) {
	this.startTime = (new Date).getTime();
	this.start = from;
	this.end = to;
	this.unit = unit || this.unit || "px";
	this.now = this.start;
	this.pos = this.state = 0;

	var self = this;
	function t( gotoEnd ) {
		return self.step(gotoEnd);
	}

	t.elem = this.elem;

	if ( t() && jQuery.timers.push(t) && !jQuery.fx.prototype.timerId ) {
		//jQuery.fx.prototype.timerI = setInterval(jQuery.fx.tick, 13);
		jQuery.fx.prototype.timerId = setInterval(jQuery.fx.tick, controller.ANIMATE_INTERVAL);
	}
}	

