var Sales = new function () {

        //Public Properties                                              
        this.isPanning = false;
        this.scroller = null;
        this.isActive = false;
        this.itemClickEvent = "itemClicked";

        //Private Properties            
        var _viewPort = null,
            _mouseDown = false,
            _prevMouseX = 0,
            _prevViewportX, _roundedViewportX = 0,
            _moveThreshold = 10,
            _targetX = 0,
            _viewPortX = 0,
            _curVelX = 0,
            _curInertiaX = 0,
            _prevMotion = 0,
            _direction = 0,
            _processInertia = false,
            _viewPortMax = 0,
            _viewPortMin = 0,
            _lastMotion, _windowH, _windowW, self = this,
            _infoArray, _eventType = hasTouchSupport() ? "touch" : "mouse",
            _supportsTransforms = Modernizr.csstransforms3d,
            _delayedClickSelector = ".listItem",
            _didDrag = false

            this.initSales = function (ele, useTouch) {
              
                console.log('here: initSales');
                
                this.scroller = ele;

                if (_eventType === 'mouse') {

                    this._dragStartEvt = "mousedown";
                    this._dragStartCB = function (e) {
                        return self.OnMouseDown(e, e.clientX, e.clientY);
                    };

                    this._dragMoveEvt = "mousemove";
                    this._dragMoveCB = function (e) {
                        return self.OnMouseMove(e, e.clientX, e.clientY);
                    };

                    this._dragStopEvt = "mouseup";
                    this._dragStopCB = function (e) {
                        return self.OnMouseUp(e);
                    };

                    this._dragOutEvt = 'mouseout';
                    this._dragOutCB = function (e) {
                        return self.OnMouseUp(e);
                    }

                    //$(window).bind(this._dragOutEvt, this._dragOutCB);
                    // $(document).mousedown(this.PreventSelection);
                } else {

                    this._dragStartEvt = "touchstart";
                    this._dragStartCB = function (e) {
                        var t = e.originalEvent.targetTouches[0];
                        return self.OnMouseDown(e, t.pageX, t.pageY);
                    };

                    this._dragMoveEvt = "touchmove";
                    this._dragMoveCB = function (e) {
                        var t = e.originalEvent.targetTouches[0];
                        return self.OnMouseMove(e, t.pageX, t.pageY);
                    };

                    this._dragStopEvt = "touchend";
                    this._dragStopCB = function (e) {
                        return self.OnMouseUp(e);
                    };
                }

                $(ele).bind(this._dragStartEvt, this._dragStartCB);

                _viewPortMax = 5000;
               // _viewPortX = 400;
               // _targetX = 1;


                this.GetDataAsync();
                this.isActive = true;
            }

        this.deactivate = function () {

            if (this.scroller != null) this.scroller.unbind(this._dragStartEvt);

            this.isActive = false;
        }

        this.GetDataAsync = function () {

            $.ajax({
                type: "GET",
                url: "data/sales.xml",
                dataType: "xml",
                success: function (data) {
                    self.ParseData($(data));
                }
            });
        }

        this.ParseData = function (xmlData) {

            _infoArray = new Array();

            xmlData.find('item').each(function () {
                var tempItem = new Object();
                var temp = $(this);
                tempItem.id = temp.attr('id');
                tempItem.name = temp.find('name').text();
                _infoArray.push(tempItem);
                return true;
            });

            this.BuildSalesItems();
            this.Arrange();

        }


        this.BuildSalesItems = function () {
            
            var i = 0;
          //  this.scroller.css({  opacity: 0  });
            
            $.each(assets_manager.images.sales, function (index, value) {
                var infoItem = _infoArray[i];
                var domItem = $('<div id="' + i + '" class="listItem" ></div>').appendTo("#dataList");
                var container = $('<div class="salesContainer" />').appendTo(domItem);
                $('<image class="listImage" />').attr('src', this.obj.src).appendTo(container);
                $('<div class="title" />').html(infoItem.name).appendTo(container);
            
                i++;
            });

        }

        this.Arrange = function () {

            var self = this;
            var curWidth = 0;

            $.each($(".listItem"), function (index, value) {

                var w = 460,
                    h = 260,
                    t = 0;
                
                if (index == 10) curWidth = 0;
                if (index >= 10) {
                    w = 920, h = 313, t = 260
                }

                $(this).css({
                    left: curWidth,
                    width: w,
                    height: h,
                    top: t
                });
                
                curWidth += w;

            });
            
          //  this.scroller.animate({
          //      opacity: 1
          //  }, 350);
            
            _viewPortMax = curWidth;
        }

        ///////////////////////////////////SCROLLER EVENTS///////////////////////////////////////////
        this.PreventSelection = function (mouseEvent) {
            mouseEvent.preventDefault();
        }

        this.OnMouseEnter = function (mouseEvent) {};

        this.OnMouseLost = function (mouseEvent) {
            this.OnMouseUp(mouseEvent);
        }

        this.OnMouseDown = function (e, ex, ey) {

            _prevMouseX = ex;
            _curInertiaX = 0;
            _curVelX = 0;
            _lastMotion = 0;
            _didDrag = false;
            mLastX = _targetX;
            _mouseDown = true;

            this._$clickEle = $(e.target).closest(_delayedClickSelector);           

            this.enableTracking();
            e.preventDefault();

        }

        this.OnMouseMove = function (e, ex, ey) {

            if (_mouseDown) {
                this.isPanning = true;
                var timeNow = new Date().getTime();

                var newX = ex;
                var deltaX = newX - _prevMouseX;

                if (Math.abs(deltaX) < _moveThreshold) {                    
                    return false;
                }
                
                    
                _prevMouseX = newX;
                _lastMotion = timeNow;

                if ((_targetX) > 0 && (_targetX < _viewPortMax - _windowW)) _targetX -= deltaX;
                else _targetX -= deltaX / 3;

                var dX = _targetX - mLastX;
                mLastX = _targetX;

                var velocity = Math.abs(dX);
                _curVelX += (velocity - _curVelX) * .3;
                _direction = dX < 0 ? -1 : 1;
                _didDrag = true;
                
            }
            return false;
        }

        this.OnMouseUp = function (e) {

            if (_mouseDown) {
                _mouseDown = false;
                _curInertiaX = Math.abs(_curVelX);
                _processInertia = true;

                var timeNow = new Date().getTime();
                var deltaTime = timeNow - _lastMotion;
                deltaTime = Math.max(10, deltaTime);
                _lastMotion = 0;

                _curVelX *= 1 - Math.min(1, Math.max(0, deltaTime / 100));

            }

            if (!_didDrag && this._$clickEle.length) {                
                return $(Sales).trigger(self.itemClickEvent);
            }


            _prevMouseX = 0;
            this.disableTracking();

            return _didDrag ? false : undefined;

        }

        this.draw = function () {

            if (this.isActive) this.update();
        }


        this.update = function () {


            if (_processInertia) {
                this.isPanning = true;
                _targetX += _curVelX * _direction;
                _curVelX *= .9;

                if (_targetX < _viewPortMin) {
                    _curVelX = 0;
                    _targetX = _viewPortMin;
                    _processInertia = false;
                } else if (_targetX > _viewPortMax - _windowW) {
                    _curVelX = 0;
                    _targetX = _viewPortMax - _windowW;
                    _processInertia = false;
                }

                if (_curVelX < 0.01) {
                    this.isPanning = false;
                    _processInertia = false;
                    _curVelX = 0;
                }
            }

            var ease = 0.14;
            var speed = (_targetX - _viewPortX) * ease;
            _viewPortX += speed;

            _roundedViewportX = Math.round(-_viewPortX);

            //Offset Viewport
            if (_supportsTransforms && BrowserDetect.browser === "Safari") self.setElementTransform(Sales.scroller, _roundedViewportX + "px", 0 + "px");
            else if (BrowserDetect.browser === "Chrome") Sales.scroller.css({
                left: _roundedViewportX
            });
            else self.set2dTransform(Sales.scroller, _roundedViewportX + "px", 0 + "px");


            //Image Scale
            var i = 1;

             $.each($(".listItem"), function () {

                $this = $(this);
                if(i == 10) i = 0;
                
                var ImgCenterX = ($this.width() * i) - $this.width() / 2;
                var distFromCenter = _browserCenterX - (_roundedViewportX + ImgCenterX);
                var distInRadians = (distFromCenter * 1.5707) / 700;
                var scale = 1;
                var opacity = 0;
            
                if ((distFromCenter < 700) && (distFromCenter > -700)) {
                    scale = 2 - Math.abs(Math.sin(distInRadians));                
                scale = Math.min(scale, 1.667);

                opacity = Math.abs(Math.cos(scale*1.5707));
                var title = $this.find('.title');
        
                if (_supportsTransforms && BrowserDetect.browser === "Safari") 
                    self.setElementTransform(title, 0 + 'px', -(scale*100)+50 + 'px');
                  
                else{
                 
                 title.css({
                            bottom: (scale*25)-40 + 'px',
                            opacity: opacity
                        })
                    
                }
        
                 
                 
                }
            
                i++;
            });
            
                
        }
        this.set2dTransform = function ($ele, x, y) {

            var v = "translate(" + x + "," + y + ")";

            if (BrowserDetect.browser === 'Explorer') //weird ie9 9stuff                                
            $ele[0].style['-ms-transform'] = v;

            else {
                $ele.css({
                    "transform": v,
                    "-webkit-transform": v,
                    "-moz-transform": v
                });
            }
        }

        this.set2dScaleTransform = function ($ele, sx, sy) {

            var v = "scale(" + sx + "," + sy + ")";

            if (BrowserDetect.browser === 'Explorer') { //weird ie9 9stuff                                
                $ele[0].style['-ms-transform'] = v;
                $ele[0].style['-ms-transform-origin'] = '90% 30%';
            }

            $ele.css({
                "-moz-transform": v,
                "-webkit-transform": v,
                "transform": v,
                "-webkit-transform-origin": "90% 30%"
            });
        }

        this.setElementTransform = function ($ele, x, y) {

            var v = "translate3d(" + x + "," + y + ", 0px)"; //scale3d("+ sx +"," + sy + ",0)";
            $ele.css({
                "-moz-transform": v,
                "-webkit-transform": v,
                "transform": v
            });
        }

        this.setElementScaleTransform = function ($ele, sx, sy) {

            var v = "scale3d(" + sx + "," + sy + ",0)";
            $ele.css({
                "-moz-transform": v,
                "-webkit-transform": v,
                "transform": v,
                "-webkit-transform-origin": "90% 30%"
            });
        }

        this.enableTracking = function () {
            $(this.scroller).bind(this._dragMoveEvt, this._dragMoveCB);
            $(this.scroller).bind(this._dragStopEvt, this._dragStopCB);
        }

        this.disableTracking = function () {

            $(this.scroller).unbind(this._dragMoveEvt, this._dragMoveCB);
            $(this.scroller).unbind(this._dragStopEvt, this._dragStopCB);
        }


        this.resize = function (width, height) {
            _windowH = height;
            _windowW = width;
            var top =  Math.max((_windowH/2) - 300, 50);
            self.scroller.css({
                width: _viewPortMax,
                height: "577px",
                top: top
            });
        }
    };