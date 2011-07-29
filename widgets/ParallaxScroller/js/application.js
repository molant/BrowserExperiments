var Application = new function () {


        //Public Properties   
        this.FRAME_RATE = 60;
        this.canvas = null;
        this.stage = null;


        //Private Properties    
        var _imageContainer = null;
        var _mouseDown = false;
        var _prevMouseX = 0;
        var _prevViewportX;
        var _targetX = 0;
        var _viewPortX = 0;
        var _curVelX = 0;
        var _curInertiaX = 0;
        var _prevMotion = 0;
        var _maxInertiaTime = 0;
        var _direction = 0;
        var _processInertia = false;
        var _viewPortMax = 0;
        var _bgImg;

        this.initApplication = function (canvas, useTouch) {

            var self = this;

            this.canvas = canvas;
            if (!useTouch) {

                $(this.canvas).mousedown(this.OnMouseDown);
                $(this.canvas).mouseup(this.OnMouseUp);
                $(this.canvas).mouseout(this.OnMouseUp);
                $(this.canvas).mousemove(this.OnMouseMove);
                $(this.canvas).mouseover(this.OnMouseEnter);
                $(document).mousedown(this.PreventSelection);
                
            } else {
                this.canvas.addEventListener('touchstart', this.OnTouchDown, false);
                this.canvas.addEventListener('touchmove', this.OnTouchMove, false);
                this.canvas.addEventListener('touchend', this.OnTouchEnd, false);
            }

            this.stage = new Stage(this.canvas, false);

            _bgImg = new Bitmap(assets_manager.images.backgrounds.background.obj);
            this.stage.addChild(_bgImg);

            _imageContainer = new Container();
            _imageContainer.width = this.stage.width;
            _imageContainer.height = this.stage.height;

            this.stage.addChild(_imageContainer);

            imagesArray = new Array();

            $.each(assets_manager.images.portfolioItems, $.proxy(this, 'setImage'));

            this.startAnimation();
        };

        this.setImage = function (name, obj) {

            var bitmap = new Bitmap(obj.obj);
            bitmap.x = _viewPortMax - 300;
            bitmap.y = (this.canvas.height - obj.obj.height) / 2;
            bitmap.scaleX = bitmap.scaleY = .85;
            bitmap.alpha = 0;
            _viewPortMax += obj.obj.width;
            _imageContainer.addChild(bitmap);
        };



        this.startAnimation = function () {

            var images = _imageContainer;
            var self = this;

            _targetX = -1200;
            $.each(images.children, function (index, value) {

                var delay = ((index * 0.3) / 6.0) * 1000;

                $(value).delay(100 + delay).animate({
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                    x: index * value.image.width
                }, 1500, 'easeInOutQuart');

            });
            $(_imageContainer).delay(1000).animate({
                x: 0
            }, {
                step: function (now, fx) {
                    _targetX = now;
                }
            }, 3000, 'easeInOutQuart');
        };


        ///////////////////////////////////EVENTS///////////////////////////////////////////
        this.PreventSelection = function (mouseEvent) {
            mouseEvent.preventDefault();
        }


        this.OnTouchDown = function (e) {
            e.preventDefault();

            var targetEvent = e.touches.item(0);
            _mouseDown = true;
            _prevMouseX = targetEvent.clientX;
            _curVelX = 0;
            _curInertiaX = 0;
            _prevViewportX = _viewPortX;
            _processInertia = false;

        }

        this.OnTouchMove = function (e) {
            var targetEvent = e.touches.item(0);
            if (_mouseDown) {

                var newX = targetEvent.clientX;
                var deltaX = newX - _prevMouseX;
                _prevMouseX = newX;

                //Elastic Edge
                if ((_targetX * -1) > 0 && (_targetX * -1) < _viewPortMax - self.canvas.width) {
                    _targetX += deltaX;
                } else {
                    _targetX += deltaX / 4;
               }
            }
        };

        this.OnTouchEnd = function (e) {

            if (_mouseDown) {
                _mouseDown = false;

                _curInertiaX = Math.abs(_curVelX);
                _processInertia = true;

                //Snap Edges
                if ((_targetX * -1) > _viewPortMax - self.canvas.width) {

                    _targetX = -(_viewPortMax - self.canvas.width);
                } else if ((_targetX * -1) < 0) {
                    _targetX = 0;
                }
            }
            _prevViewportX = 0;
        };

        this.OnMouseEnter = function (mouseEvent) {};

        this.OnMouseLost = function (mouseEvent) {
            this.OnMouseUp(mouseEvent);
        }

        this.OnMouseDown = function (mouseEvent) {

            _mouseDown = true;
        
            _prevMouseX = mouseEvent.pageX;
            _curVelX = 0;
            _curInertiaX = 0;
            _prevViewportX= _targetX;
            mouseEvent.preventDefault();
            //_processInertia = false;
            
        };

        this.OnMouseMove = function (mouseEvent) {

            if (_mouseDown) {

                var newX = mouseEvent.pageX;
                var deltaX = newX - _prevMouseX;
                _prevMouseX = newX;

                //Elastic Edge
               if ((_targetX * -1) > 0 && (_targetX * -1) < _viewPortMax - Application.canvas.width) {
                    _targetX += deltaX;
                } else {
                   _targetX += deltaX / 4;
                }                                                    
            }
        };

        this.OnMouseUp = function (mouseEvent) {

            if (_mouseDown) {
                _mouseDown = false;

                _curInertiaX = Math.abs(_curVelX);
                _processInertia = true;
        
            }
            
            _prevViewportX = 0;            
        };


        this.draw = function () {

            this.update();
            this.stage.update();
        };

        this.update = function () {
                   
            if (_mouseDown) {

                var dX = _targetX - _prevViewportX;
                _prevViewportX = _targetX;

                //if ((_targetX * -1) > 0 && (_targetX * -1) < _viewPortMax - Application.canvas.width) {
                    var velocity = Math.abs(dX);
                    _curVelX += (velocity - _curVelX) * .3;
               // }
              
                _direction = dX < 0 ? -1 : 1;
            }
                
                                             
            else if (_processInertia) {

                _targetX += _curVelX * _direction;
                _curVelX *= .9;

                if ((_targetX * -1) > _viewPortMax - Application.canvas.width) {
                    _curVelX = 0;
                    _targetX = -(_viewPortMax - Application.canvas.width);
                    _processInertia = false;
                } else if ((_targetX * -1) < 0) {
                    _curVelX = 0;
                    _targetX = 0;
                    _processInertia = false;
                }
                
                if (_curVelX < 0.01) {
                    _processInertia = false;
                    _curVelX = 0;
                }
            }                        
            

            var ease = 0.12;
            var speed = (_targetX - _viewPortX) * ease;
            _viewPortX += speed;
            _imageContainer.x = Math.round(_viewPortX);
            _bgImg.x = Math.round(_viewPortX / 10);
        };


        this.resize = function (width, height) {

            Application.canvas.width = width;
            Application.canvas.height = height;
        }
    };