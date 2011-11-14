/* Author: Andrew Dodson #mr_switch */

$(window).resize('resize', function(){
	$("body").height(Math.max($(window).height(),$(document).height()));
}).trigger('resize');


$('form').submit(function(e){

	e.preventDefault();
	e.stopPropagation();

	var a = this.start_time.value.split(':'),
		st = (new Date);
	if(a.length==2){
		st.setHours(a[0]);
		st.setMinutes(a[1]);
		st.setSeconds(0);
	}
	
	// form fields
	var p  = {
		freq		: parseInt(this.freq.value) || 1,
		start_time	: st.getTime(),
		nod			: parseInt(this.nod.value) || parseInt(((new Date(this.end_date.value+" 23:59:59")).getTime() - (new Date).getTime())/(1000*60*60*24)) || 1
	};

	// save results
	window.localStorage.setItem('prescription', JSON.stringify(p) );
	
	setAlarm(p);
	
	var chk = window.Notification.checkPermission();
	if(chk===1){
		window.Notification.requestPermission();
	}
	
	return false;
}).bind('reset', function(){
	window.localStorage.removeItem('prescription');
	$("#main h1").slideUp();
});


$(function(){
	var p = window.localStorage.getItem('prescription');
	if(p){
		p = JSON.parse(p);
		setAlarm(p);
		
		// update form
		$('form input[name=freq]').val(p.freq);
		var c = (new Date(p.start_time));
		$('form input[name=start_time]').val((c.getHours()<10?"0":'')+c.getHours() + ":" + (c.getMinutes()<10?"0":"")+c.getMinutes());

		c.setDate(c.getDate()+p.nod);
		$('form input[name=nod]').val(parseInt((c.getTime() - (new Date).getTime())/(60e3*60*24)));
	}
});

var intC, intA;
function setAlarm(p){

	var rem=0;
	
	if(intC){
		clearTimeout(intC);
		clearTimeout(intA);
	}

	$("#main h1").slideDown();
	
	(function self(){
		// how long have we got until the next one?
		var d = (new Date),
			s = (new Date(p.start_time));
			
		if(s.getTime()>d.getTime()){
			rem = s.getTime()-d.getTime();
		}
		else{
	
			// end date
			s.setDate( s.getDate() + p.nod ); 
			var mod = ((24/p.freq)*60*60*1e3),
				diff = (s.getTime() - d.getTime());
			
			rem = diff%mod;
		}
		
		log( parseInt(rem/(60e3*60)), parseInt((rem/(60e3))%60) );
		$(".countdown:not(.lock)").html( parseInt(rem/(60e3*60)) +" hours : "+ parseInt((rem/(60e3))%60) + " minutes" );
		
		intC = setTimeout(self,60e3);
	})();
	
	
	setTimeout(triggerAlarm, rem);
}

function triggerAlarm(){
	$(".countdown").html("It's time!").addClass("lock");
	window.Notification.createNotification("star.ico","Nurse Webber","Its time to take your medication", function(){
		$(".countdown").removeClass('lock');
	});
}