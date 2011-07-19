//Global Vars
var min_width = 1024;
var min_height = 768;
var btnCount = 0;
var touchCount = 0;

$(document).ready(function () {
    
    /* Touch Visualizer
      -------------------------------------------------------------*/
    
    //Init Cavnas Touch visualizer (see touchVisualizer js)
    TouchVisualizer.initVisualizer(document.getElementById('canvas'));
    $("#touchVizCount").html("VISUALIZER TOUCH POINTS:&nbsp;&nbsp;" + "<span style='color:#fff;'>" + touchCount + "</span>");




    
    
    /* Add Touch to Existing jqueryUI elements
      -------------------------------------------------------------*/
    //Create Slider with jqueryUI
    $(".slider").slider({
        animate: true,
        range: "min",
        value: 50,
        min: 0,
        max: 100,
        step: 1,

        //this gets a live reading of the value and prints it on the page
        slide: function (event, ui) {
            $("#slideResult").html("SLIDE VALUE:&nbsp;&nbsp;" + "<span style='color:#fff;'>" +ui.value + "</span>");
        }
    });
    
    $("#slideResult").html("SLIDE VALUE:&nbsp;&nbsp;" + "<span style='color:#fff;'>" + 50 + "</span>");
    
    //handlers in jquery.ui.touch.js
    addTouch($('.slider')[0]);
    
    function addTouch(el){
        el.addEventListener("touchstart", TouchHandler, false); 
        el.addEventListener("touchmove", TouchHandler, false);
        el.addEventListener("touchend", TouchHandler, false);
        el.addEventListener("touchcancel", TouchHandler, false);
    }






    /* Create Manul Touch Events
      -------------------------------------------------------------*/
    
    //Button Touch Events
    if(Modernizr.touch) addBehaviors();  //check touch support with modernizr
        
    
    var btn = $("#btn");
    btn.click(function(){         
        btnCount++;
        $("#touchResult").html("BUTTON PRESS COUNT:&nbsp;&nbsp;" + "<span style='color:#fff;'>" + btnCount + "</span>");    
    });
    
    $("#touchResult").html("BUTTON PRESS COUNT:&nbsp;&nbsp;" + "<span style='color:#fff;'>" + btnCount + "</span>");
    
    function addBehaviors(){    
        var btn = $("#btn")[0];
        btn.addEventListener("touchstart", touchStart, false);
        btn.addEventListener("touchmove", touchMove, false);
        btn.addEventListener("touchend", touchEnd, false);
        btn.addEventListener("touchcancel", touchEnd, false);
        
    }
        
    function touchStart(e){
      e.preventDefault();              
       $("#btn").addClass('the_button_pressed');
    }
    
    function touchMove(e){
      e.preventDefault();
      return false;
    }
    function touchEnd(e){       
        $("#btn").removeClass('the_button_pressed');
         return false;
    }

});