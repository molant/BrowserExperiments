var TouchVisualizer = new function () {

        //Public Properties          
        this.canvas = null;
        this.touchEnabled = false;        

        //Private Properties    
        var _context = null;
        var _targetX = -100;
        var _targetY = -100;
        var _prevX, _prevY;
        var _hasTouch = false;
        var _mouseDown = false;
        var _touches = new Array();
        var _touchesHash = new Object();        
        var _dot;
        
        //init variables / events
        this.initVisualizer = function (canvas) {

            TouchVisualizer.canvas = canvas;
            _context = canvas.getContext('2d');
            
            this.touchEnabled = Modernizr.touch
            
            _dot = new Image();
            _dot.src = "images/dot.png";

            if (this.touchEnabled) {
                this.canvas.addEventListener('touchstart', this.OnTouchDown, false);
                this.canvas.addEventListener('touchmove', this.OnTouchMove, false);
                this.canvas.addEventListener('touchend', this.OnTouchEnd, false);
                this.canvas.addEventListener("touchcancel", this.OnTouchEnd, false);
            } else {
                $(this.canvas).mousedown(this.OnMouseDown);
                $(this.canvas).mouseup(this.OnMouseUp);
                $(this.canvas).mousemove(this.OnMouseMove);
            }
            
            TouchVisualizer.draw();
        };


        /////////////////////TOUCH////////////////////
        this.OnTouchDown = function (e) {

            e.preventDefault();

            _hasTouch = true;
            _touches = e.touches;
            touchCount = e.touches.length;
            var t = TouchVisualizer.canvas;
            var offsetX = t.offsetLeft + parseInt(t.style.borderLeftWidth || 0);
            var offsetY = t.offsetTop + parseInt(t.style.borderTopWidth || 0);
            
            
            
            for (var i = 0; i < e.touches.length; i++) {

                // record initial data in the hash
                var id = e.touches[i].identifier;

                _touchesHash[id] = {
                    identifier: id,
                    x: e.touches[i].clientX - offsetX,
                    y: e.touches[i].clientY - offsetY
                };
            }
            TouchVisualizer.draw();
        }

        this.OnTouchMove = function (e) {

            if (_hasTouch) {

                _touches = e.touches;

                e.preventDefault();

                var t = TouchVisualizer.canvas;
                var offsetX = t.offsetLeft + parseInt(t.style.borderLeftWidth || 0);
                var offsetY = t.offsetTop + parseInt(t.style.borderTopWidth || 0);
                
                touchCount = e.touches.length;
                
                for (var i = 0; i < e.touches.length; i++) {
                    var id = e.touches[i].identifier;
                    _touchesHash[id].x = e.touches[i].clientX - offsetX;
                    _touchesHash[id].y = e.touches[i].clientY - offsetY;
                }
                TouchVisualizer.draw();
            }            
        }

        this.OnTouchEnd = function (e) {

            if (_hasTouch) {
                _hasTouch = false;
                _targetX = _targetY = -100;
                _touches = e.touches;
                
                for (var i = 0; i < e.touches.length; i++) {
                    delete _touchesHash[e.touches[i].identifier];
                }
                touchCount = 0;
                TouchVisualizer.draw();
            }            
        };

        /////////////////////MOUSE////////////////////////////
        this.OnMouseDown = function (e) {
            e.preventDefault();

            _mouseDown = true;
            var t = TouchVisualizer.canvas;
            var offsetX = t.offsetLeft + parseInt(t.style.borderLeftWidth || 0);
            var offsetY = t.offsetTop + parseInt(t.style.borderTopWidth || 0);

            _targetX = e.clientX - offsetX;
            _targetY = e.clientY - offsetY;
            
            touchCount =  1;
            TouchVisualizer.draw();
            
        };

        this.OnMouseMove = function (e) {
            
            if (_mouseDown) {
                e.preventDefault();

                var t = TouchVisualizer.canvas;
                var offsetX = t.offsetLeft + parseInt(t.style.borderLeftWidth || 0);
                var offsetY = t.offsetTop + parseInt(t.style.borderTopWidth || 0);

                var newX = e.clientX - offsetX;
                var newY = e.clientY - offsetY;

                _targetX = newX;
                _targetY = newY;
                
                TouchVisualizer.draw();
            }
        };

        this.OnMouseUp = function (mouseEvent) {
            _mouseDown = false;
            _targetX = _targetY = -100;
            touchCount = 0;
            TouchVisualizer.draw();           
        };


        this.draw = function () {
            
            //Clear Canvas
            _context.clearRect(0, 0, TouchVisualizer.canvas.width, TouchVisualizer.canvas.height);
            _context . globalCompositeOperation = 'source-over';
            _context.fillStyle = 'rgba(0,0,0,.15)';
            _context.fillRect(0, 0, TouchVisualizer.canvas.width, TouchVisualizer.canvas.height);

            //Draw Message            
            if (!_mouseDown && !_hasTouch) {                
                
                _context.fillStyle = 'rgba(0,0,0,.05)';
                _context.fillRect(0, 0, TouchVisualizer.canvas.width, TouchVisualizer.canvas.height);
                _context.fillStyle = 'rgba(92,333,236,.6)';
                _context.font = "italic 12px sans-serif";
                _context.fillText("TOUCH OR CLICK ME", 115, 150);
            }

            //Draw Touches            
            _context . globalCompositeOperation = 'lighter'; //for glow effect
            _context.fillStyle = 'rgb(255,255,255)';
            
            if (TouchVisualizer.touchEnabled && _touches.length > 0) {
                
               
                 $("#touchVizCount").html("VISUALIZER TOUCH POINTS:&nbsp;&nbsp;" + "<span style='color:#fff;'>" + touchCount + "</span>");
                
                for (var i = 0; i < _touches.length; i++) {
                    var id = _touches[i].identifier;
                    
                    if (_touchesHash[id]) {
                                                           
                        _context.beginPath();
                        _context.arc(_touchesHash[id].x, _touchesHash[id].y, 11, 0, Math.PI * 2, false);
                        _context.closePath();                                                                        
                        _context.fill();
                    }
                }
            }

            //Draw Mouse
            else {
                 $("#touchVizCount").html("VISUALIZER TOUCH POINTS:&nbsp;&nbsp;" + "<span style='color:#fff;'>" + touchCount + "</span>");
                _context.drawImage(_dot, _targetX-16, _targetY-16);                
            }
        };

    }
