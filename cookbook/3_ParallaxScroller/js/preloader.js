
var Preloader = new function () {
        
    //PUBLIC
    this.STATE = 0; 
    this.IMG_IS_LOADING = false;
    this.ASSETS_ARRAY = [];
    this.progress_number;
    this.number_total_assets_to_load = 0;
    this.current_number_loaded = 0;
    
    
    this.init = function(array_to_preload){
        this.STATE = 1;
               
        this.ASSETS_ARRAY = array_to_preload;
        this.declareVars(); 
        
        for(key in this.ASSETS_ARRAY) {
                    
        
            if(this.ASSETS_ARRAY[key].type == 'image') {                                       
                this.load_image(this.ASSETS_ARRAY[key]);
            }
                     
           
            if(this.ASSETS_ARRAY[key].type == 'audio') {
                this.load_audio(this.ASSETS_ARRAY[key]);
            }

            if(this.ASSETS_ARRAY[key].type == 'video') {
                this.load_video(this.ASSETS_ARRAY[key]);
            }
        }
    };

    this.declareVars = function(){
        for(key in this.ASSETS_ARRAY) {
            this.number_total_assets_to_load++;
        }
        
        var el = $('#preloader');
        this.draw_preloader(el,360);
    };


    this.load_image = function(obj) {
        var self = this;
        if(self.STATE == 1) {
            var img = new Image();             
            img.src = obj.src;

            img.onerror = function() {
                self.STATE = 3;
                self.onError(obj);
            };

            img.onload = function() {
                obj.$obj = $('<img src="'+img.src+'" alt="'+obj.name+'">');
                obj.obj = img;
                self.setProgressVars(obj);                
            };
        }
    };

    this.load_audio = function(obj) {
        var self = this;
        if(self.STATE == 1) {
            var $audio = '<audio id="'+obj.name+'" src="'+obj.src+'" controls="controls" preload="auto"></audio>';
            $('#audios').append($audio);
            obj.$obj =  $($audio);
            var audio = document.getElementById(obj.name);
            //audio.volume = 0;
            //audio.play();
            /*audio.addEventListener("canplaythrough", function() {
             audio.currentTime = 0;
             audio.volume = 1;
             audio.pause();
             $.debug("allLoaded");
             self.onProgress();
             }, true);*/

            audio.addEventListener("error", function() {
                self.STATE = 3;
                self.onError(obj);
            },true);

            audio.addEventListener("ended", function() {
                audio.currentTime = 0;
                audio.pause();
            },true);

            audio.addEventListener("loadstart", function() {
                self.setProgressVars(obj);
            },true);
        }
    };

    this.load_video = function(obj) {
        var self = this;
        if(self.STATE == 1) {
            var $video = '<video id="'+obj.name+'" src="'+obj.src+'" controls="controls"></audio>';
            $('#videos').append($video);
            obj.$obj =  $($video);
            var video = document.getElementById(obj.name);
            //video.volume = 0;
            //video.play();
            /*video.addEventListener("canplaythrough", function() {
             video.currentTime = 0;
             video.volume = 1;
             video.pause();
             $.debug("allLoaded");
             self.onProgress();
             }, true);*/

            video.addEventListener("error", function() {
                self.STATE = 3;
                self.onError(obj);
            },true);

            video.addEventListener("ended", function() {
                video.currentTime = 0;
                video.pause();
            },true);

            video.addEventListener("loadstart", function() {
                self.setProgressVars(obj);
            },true);
        }
    };

    
    this.setProgressVars = function(obj){
        $.debug("Finish Loading : "+ obj.name +" | SRC : "+ obj.src+" | TYPE : "+ obj.type);
        this.current_number_loaded ++;
        this.progress_number = Math.round((this.current_number_loaded / this.number_total_assets_to_load)*100);                
                        
        var angle = (360*this.progress_number)/100;
        var el = $('#preloader');
        this.draw_preloader(el,angle);
        
        if(this.progress_number == 100){
            this.draw_preloader(el,0);            
            
            var self = this;
            
            setTimeout(function(){                          
                self.onComplete();
            },400);            
        }        
    };

    this.draw_preloader = function(el, angle){
        var context = el[0].getContext('2d');
        var width = el.width();
        var height = el.height();
        var lineWidth = 5;
        var r = 45;        
        var px = (r + lineWidth/2);
        var py = (r + lineWidth/2);
        
        
        var startAngle = 2*Math.PI/360*270;
        context.clearRect(0, 0, width, height);
        
        context.lineWidth = lineWidth;
        context.strokeStyle = "#e5e5e5";
        context.beginPath();
        context.arc(px, py, r, 0, 2*Math.PI, false);
        context.stroke();
                
        context.lineWidth = lineWidth;
        context.strokeStyle = "#37bbda";
        context.beginPath();
        context.arc(px, py, r, startAngle, 2*Math.PI/360*(angle-90), false);
        context.stroke();
                        
        context.fillStyle = "#333";
        context.font = "bold 16px helvetica";
        context.textAlign = 'center';
        
        var percent = this.progress_number == undefined ? "0%": this.progress_number+"%";        
        context.fillText(percent, 40 + lineWidth+3, height/2-5);        
        context.fillStyle = "#666";
        context.font = "12px sans-serif";
        var m = context.measureText('loading');
        context.fillText("loading", m.width + lineWidth+2, (height/2)+10)
        
    };

    this.onComplete = function() {
        
        $.debug("done");
    };

    this.onError = function(obj){
        $.debug("ERROR Loading : "+ obj.name +" | SRC : "+ obj.src+" | TYPE : "+ obj.type);
    };

};