var Application = new function () {

    //Public Properties                                              
    this.isPanning = false;
    this.scroller = null;
    this.isActive = false;
    this.itemDroppedEvent = "itemDropped";

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
            _lastMotion, _didDrag = false,
            _windowH, _windowW, _infoArray, self = this,
            _holdTimer = null,
            _curTouchEvent = null,
            _$dragHolder,
            _isOverCart = false,
            _delayedClickSelector = ".listItem",
            _eventType = hasTouchSupport() ? "touch" : "mouse",
            _supportsTransforms = Modernizr.csstransforms3d;

    this.initApplication = function (ele, useTouch) {

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
                _curTouch = t;
                return self.OnMouseDown(e, t.pageX, t.pageY);
            };

            this._dragMoveEvt = "touchmove";
            this._dragMoveCB = function (e) {
                var t = e.originalEvent.targetTouches[0];
                _curTouch = t;
                return self.OnMouseMove(e, t.pageX, t.pageY);
            };

            this._dragStopEvt = "touchend";
            this._dragStopCB = function (e) {
                _curTouch = null;
                return self.OnMouseUp(e);
            };
        }

        $(ele).bind(this._dragStartEvt, this._dragStartCB);

        _viewPortMax = 5380;


        this.GetDataAsync();
        this.isActive = true;

    }

    this.GetDataAsync = function () {

        $.ajax({
            type: "GET",
            url: "data/info.xml",
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
            tempItem.category = temp.find('category').text();
            tempItem.price = temp.find('price').text();
            tempItem.oldPrice = temp.find('oldprice').text();
            _infoArray.push(tempItem);
            return true;
        });

        this.BuildDomItems();

    }


    this.BuildDomItems = function () {

        this.scroller.css({
            opacity: 0
        });

        var i = 0;
        $.each(assets_manager.images.portfolioItems, function (index, value) {

            var infoItem = _infoArray[i];
            var domItem = $('<div id="' + i + '" class="listItem"></div>').appendTo(self.scroller);

            $('<image class="listImage" />').attr('src', this.obj.src).appendTo(domItem);
            var container = $('<div class="container" />').appendTo(domItem);
            $('<h2 class="title" />').html(infoItem.name).appendTo(container);
            $('<h3 class="brand" />').html(infoItem.category).appendTo(container);
            $('<div class="sizes" />').appendTo(container);
            $('<span class="price" />').html(infoItem.price).appendTo(container);
            $('<del class="oldPrice" />').html(infoItem.oldPrice).appendTo(container);
            i++;
        });

        this.resize(_stageW, _stageH);
        this.Arrange();
    }

    this.Arrange = function () {

        var curWidth = 0;

        $.each($(".listItem"), function () {
            $(this).css({
                left: curWidth
            });
            curWidth += _curImgWidth;
        });

        this.scroller.animate({
            opacity: 1,
            leaveTransforms: true
        }, 450);

        //_targetX = 250;
    }





    ///////////////////////////////////SCROLLER EVENTS///////////////////////////////////////////
    this.PreventSelection = function (mouseEvent) {
        mouseEvent.preventDefault();
    }

    this.OnMouseEnter = function (mouseEvent) { };

    this.OnMouseLost = function (mouseEvent) {
        this.OnMouseUp(mouseEvent);
    }

    this.OnMouseDown = function (e, ex, ey) {

        _prevMouseX = ex;
        _curInertiaX = 0;
        _curVelX = 0;
        _lastMotion = new Date().getTime(); ;

        mLastX = _targetX;
        _mouseDown = true;
        _didDrag = false;
        this._$clickEle = $(e.target).closest(_delayedClickSelector);


        //Tap and Hold
        if (!_holdTimer) {
            _holdTimer = setTimeout(function () {

                if (self._$clickEle.length) {
                    _cart.open();
                    _mouseDown = false;
                    // self.disableTracking();
                    clearTimeout(_holdTimer);

                    if (_hasTouch) {
                        var t = e.originalEvent.targetTouches[0];
                        self.createDragAdorner(t.pageX, t.pageY, self._$clickEle);
                    }
                    else
                        self.createDragAdorner(e.pageX, e.pageY, self._$clickEle);
                }
            }, 600);
        }
        this.enableTracking();
        e.preventDefault();
    }

    this.OnMouseMove = function (e, ex, ey) {

        if (!_mouseDown && _$dragHolder != null && _hasTouch)
            moveHandler(ex, ey);

        if (_mouseDown) {
            this.isPanning = true;
            var timeNow = new Date().getTime();

            var newX = ex;
            var deltaX = newX - _prevMouseX;

            if (Math.abs(deltaX) < _moveThreshold) {
                return false;
            }

            clearTimeout(_holdTimer);

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
    }

    this.OnMouseUp = function (e) {

        if (_$dragHolder != null && _hasTouch)
            upHandler();

        if (_mouseDown) {
            _mouseDown = false;
            _curInertiaX = Math.abs(_curVelX);
            _processInertia = true;
            clearTimeout(_holdTimer);
            _holdTimer = null;
            var timeNow = new Date().getTime();
            var deltaTime = timeNow - _lastMotion;

            deltaTime = Math.max(10, deltaTime);
            _lastMotion = 0;

            _curVelX *= 1 - Math.min(1, Math.max(0, deltaTime / 100));
        }

        _prevMouseX = 0;
        this.disableTracking();
        return _didDrag ? false : undefined;
    }

    this.createDragAdorner = function (x, y, el) {

        _$dragHolder = $('<div class="dragHolder"></div>'),
                $container = $('<div id="dragContainer" ></div>'),
                dragDeets = {
                    offsetX: (_curImgWidth / 3) / 2,
                    offsetY: (_curImgHeight / 3)/1.2 ,
                    currX: x - (_curImgWidth / 3) / 2,
                    currY: y - (_curImgHeight / 3) / 1.2,
                    update: function (x, y) {

                        dragDeets.currX = (x - dragDeets.offsetX);
                        dragDeets.currY = (y - dragDeets.offsetY);

                    }
                },

                moveHandler = function (x, y) {

                    dragDeets.update(x, y);

                    _$dragHolder.css({
                        top: dragDeets.currY,
                        left: dragDeets.currX
                    });

                    _isOverCart = false;

                    if (y > _windowH - 250)
                        _isOverCart = true;

                    return false;
                },

                upHandler = function () {

                    $container.unbind({
                        mousemove: moveHandler,
                        mouseup: $(this).onmouseup
                    });

                    if (_isOverCart) {

                        _$dragHolder.animationComplete(function () {
                            _isOverCart = false;
                            _$dragHolder.removeClass('pop out');
                            _$dragHolder = null;
                            $container.remove();
                            $("#dragDim").css({
                                display: 'none',
                                opacity: 0
                            });
                            $(Application).trigger(self.itemDroppedEvent, { item: $itemImg[0].src });
                        }).addClass('pop out');
                    }
                    else {
                        _isOverCart = false;
                        _$dragHolder = null;
                        $container.remove();
                        $("#dragDim").css({
                            display: 'none',
                            opacity: 0
                        });
                        _cart.close();
                    }


                    return false;
                };

        var itemImg = el.find('.listImage')[0];

        var $itemImg = $('<img src="' + itemImg.src + '" />');
        $itemImg.css({
            width: _curImgWidth / 3,
            height: _curImgHeight / 3
        });

        _$dragHolder.css({
            width: _curImgWidth / 3,
            height: _curImgHeight / 3
        });

        _$dragHolder.prepend($itemImg);

        _$dragHolder.css({
            top: dragDeets.currY,
            left: dragDeets.currX
        });


        $("#dragDim").css('display', 'block').animate({
            opacity: 1
        }, 350);

        $('body').append($container);
        $container.append(_$dragHolder);
        _$dragHolder.addClass('pop in');


        $container.bind('mousemove', function (e) {
            moveHandler(e.pageX, e.pageY);
        });
        $container.bind('mouseup', function (e) {
            upHandler(e);
        });

        return false;
    }


    this.draw = function () {

        if (this.isActive) this.update();
    }

    this.deactivate = function () {

        if (this.scroller != null) this.scroller.unbind(this._dragStartEvt);

        this.isActive = false;
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

        var ease = 0.12;
        var speed = (_targetX - _viewPortX) * ease;
        _viewPortX += speed;

        _roundedViewportX = Math.round(-_viewPortX);

        //Offset Viewport
        if (_supportsTransforms && BrowserDetect.browser === "Safari") {
            this.setElementTransform(Application.scroller, _roundedViewportX + "px", 0 + "px");
        } else if (BrowserDetect.browser === "Chrome") {
            Application.scroller.css({
                left: _roundedViewportX
            });
        } else {
            this.set2dTransform(Application.scroller, _roundedViewportX + "px", 0 + "px");
        }


        //Image Scale
        var i = 1;

        $.each($(".listItem"), function () {

            $this = $(this);

            var ImgCenterX = ($this.width() * i) - $this.width() / 2;
            var distFromCenter = _browserCenterX - (_roundedViewportX + ImgCenterX);
            var distInRadians = (distFromCenter * 1.5707) / 450;
            var scale = 1;
            var opacity = 0;


            if ((distFromCenter < 450) && (distFromCenter > -450)) {
                scale = 2 - Math.abs(Math.sin(distInRadians));
                //}
                scale = Math.min(scale, 1.667);
                var newH = Math.min(Math.round(_curImgHeight * scale), 1080);
                var newH2 = Math.round(_curImgHeight * scale);
                var deltaX = Math.round((newH2 - _curImgHeight) / 3.33);
                var deltaX2 = Math.round((newH - _curImgHeight) / 1.33);
                opacity = Math.abs(Math.cos(scale * 1.5707));
                var img = $this.find('.listImage');
                var container = $this.find('.container').css({
                    opacity: opacity
                });
                var title = $this.find('.title');
                var brand = $this.find('.brand');
                var price = $this.find('.price');
                var oldprice = $this.find('.oldPrice');
                var sizes = $this.find('.sizes');


                if (_supportsTransforms && BrowserDetect.browser === "Safari") {
                    if (!_isiPad) self.setElementScaleTransform(img, scale, scale);

                    self.setElementTransform(title, (-deltaX2 + 30) + 'px', 0 + 'px');
                    self.setElementTransform(brand, (deltaX + 10) + 'px', 0 + 'px');
                    self.setElementTransform(price, (-deltaX2 + 30) + 'px', 0 + 'px');
                    self.setElementTransform(oldprice, (-deltaX2 + 30) + 'px', 0 + 'px');
                    self.setElementTransform(sizes, (-deltaX2 + 30) + 'px', 0 + 'px');

                } else if (BrowserDetect.browser == "Explorer") {
                    self.set2dScaleTransform(img, scale, scale);
                    self.set2dTransform(title, (-deltaX2 + 30) + 'px', 0 + 'px');
                    self.set2dTransform(brand, (deltaX + 50) + 'px', 0 + 'px');
                    self.set2dTransform(price, (-deltaX2 + 30) + 'px', 0 + 'px');
                    self.set2dTransform(oldprice, (-deltaX2 + 30) + 'px', 0 + 'px');
                    self.set2dTransform(sizes, (-deltaX2 + 30) + 'px', 0 + 'px');
                } else {
                    img.css({
                        marginLeft: -deltaX2 + 'px',
                        marginTop: -deltaX2 * .33 + 'px',
                        height: newH
                    });
                    title.css({
                        left: (-deltaX + 400) + 'px'
                    })
                    brand.css({
                        left: (deltaX + 130) + 'px'
                    })
                    price.css({
                        left: (-deltaX + 475) + 'px'
                    })
                    oldprice.css({
                        left: (-deltaX + 550) + 'px'
                    })
                    sizes.css({
                        left: (-deltaX + 450) + 'px'
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

        $("#wrap").css({
            width: _windowW
        });

        $(".listImage").css({
            height: _windowH - 100
        });

        $(".listItem").css({
            width: $(".listImage:first").width(),
            height: _windowH - 100
        });

        _viewPortMax = ($(".listImage:first").width() * 10) + 2;

        self.scroller.css({
            width: _viewPortMax,
            height: height - 100,
            top: '50px'
        });

        console.log(_viewPortMax);
        _curImgHeight = $(".listImage").height();
        _curImgWidth = $(".listImage").width();

    }
};