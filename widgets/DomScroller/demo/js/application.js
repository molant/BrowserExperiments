var Application = new function () {

        //Public Properties          
        this.canvas = null;
       
        //Private Properties    
        var _context = null;

       
       //INIT APP : WIRE UP EVENTS AND INITAL VALUES
        this.initApplication = function (canvas, useTouch) {

            var self = this;

            this.canvas = canvas;
            _context  = canvas.getContext( '2d' );            
        };
                    
        this.draw = function () {

            var time = new Date().getTime() * 0.002;
            var x = Math.sin( time ) * 96 + 128;
            var y = Math.cos( time * 0.9 ) * 96 + 128;
        
            _context.fillStyle = 'rgb(245,245,245)';
            _context.fillRect( 0, 0, Application.canvas.width, Application.canvas.height );
        
            _context.fillStyle = 'rgb(255,0,0)';
            _context.beginPath();
            _context.arc( x, y, 10, 0, Math.PI * 2, true );
            _context.closePath();
            _context.fill();
        };
    
        this.resize = function (width, height) {

            Application.canvas.width = width;
            Application.canvas.height = height;
        }
    };