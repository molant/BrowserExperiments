//variables
var slotImage01;
var bgImage;
var ctx;
var canvas;
var timer;
var easing = .125;
var SlotMachines = new Array();
var slot1 = new Object();
var slot2 = new Object();
var slot3 = new Object();

/*function spin() {
	

	$('#drinks').empty();
	
	var r=randomFromTo(1,50);          
	
			$.ajax({
				type: "GET",
				url: "xml/recipes.xml",
				dataType: "xml",
				success: function(xml) {
				yArray = new Array();
				$(xml).find('recipe').each(function(){						
							var name = $(this).find('name').text();
							var size = $(this).find('size').text();
							var id= $(this).attr('id');
							var disc1 = $(this).find('disc01').text();
							var disc2 = $(this).find('disc02').text();
							if (disc2 != "") disc1 += ",&nbsp;"
							var disc3 = $(this).find('disc03').text();
							if (disc3 != "") disc2 += ",&nbsp;"
							var d1y = $(this).find('disc01').attr('y');
							var d2y = $(this).find('disc02').attr('y');
							var d3y = $(this).find('disc03').attr('y');
	
					if(id == r)
					{
						
						
						//display recipe
						$('<div class="drink" id="id_'+id+'"></div>').html('<h4>' + name + '</h4><span id="serving-size"><h3>SERVING SIZE: '+ size +'</h3></span><span id="ingredients"></span>').appendTo('#drinks');	
						
						$('<h2>').html(disc1).appendTo('#ingredients');
						$('<h2>').html(disc2).appendTo('#ingredients');
						$('<h2>').html(disc3).appendTo('#ingredients');
						
						$('#drinks').animate({opacity: 0}, 0); 
						$('#drinks').delay(500).animate({opacity: .95}, 1000);
						 
						//spin slot1
						slot1.y = -150;
    					slot1.vy = -10;
						slot1.targetY = - d1y; 
						
						//spin slot 2
						slot2.y = -300;
    					slot2.vy = -20;
						slot2.targetY = - d2y; 
						
						//spin slot3
						slot3.y = -150;
    					slot3.vy = -30;
						slot3.targetY = - d3y;    
					}

					}); //close each
				} //close success						
			}); //close ajax		
		} //close spin
*/	
function init() {
	
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    setup();
	
}

function setup() {
	
    //Create slots
    slotImage01 = new Image();                
    slotImage01.src = 'images/slots.jpg';

    //Slot 1
    slot1.y = -150;
    slot1.vy = -20;
    slot1.targetY = 0;
    ctx.drawImage(slotImage01, 10, -150, 120, 2100);
    SlotMachines.push(slot1);

    //Slot 2
    slot2.y = -300;
    slot2.vy = -20;
    slot2.targetY = 0;
    ctx.drawImage(slotImage01, 150, -300, 120, 2100);
    SlotMachines.push(slot2);
    
    //Slot 3
    slot3.y = -750;
    slot3.vy = -20;
    slot3.targetY = 0;
    ctx.drawImage(slotImage01, 292, -750, 120, 2100);
    SlotMachines.push(slot3);
	
	startTimer();
}

function update() {

	var temp;
  
  	for (var i = 0; i < SlotMachines.length; i++) {
	        
		temp = SlotMachines[i];
		temp.vy = (temp.targetY - temp.y) * easing;
		temp.y += temp.vy;
  	}
            
  	draw();
	
}



function draw() {
    
	//Save Context    
    ctx.save();

    //Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Slot with new YValue
    ctx.drawImage(slotImage01,   10, SlotMachines[0].y %2100, 120, 2100);
    ctx.drawImage(slotImage01, 150, SlotMachines[1].y %2100, 120, 2100);
    ctx.drawImage(slotImage01, 292, SlotMachines[2].y %2100, 120, 2100);

    //Restore Context
    ctx.restore();
}


function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}


function startTimer() {
    timer = setInterval(update, 35);
}

function stopTimer() {
    clearInterval(timer);
}




