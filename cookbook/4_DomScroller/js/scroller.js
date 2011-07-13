function Scroller(params) {

    //parse required parameter    
    this.container = params.container == null ? null : params.container; //parent container element to append to 
    //optional
    this.fps = params.fps == null ? 60 : params.fps; // Frames per second in msecs.
    this.direction = params.direction == null ? null : params.direction; // "x", "y", or null for both.    
    this.showScrollBars = params.showScrollBars == null ? true : params.showScrollBars;

    //private
    var _scrollMethod;
    var _scrollDuration = 2000; // Duration of the scrolling animation in msecs.
    var _overshootDuration = 250; // Duration of the overshoot animation in msecs.
    var _snapbackDuration = 250; // Duration of the snapback animation in msecs.    
    var _moveThreshold = 10; // User must move this many pixels in any direction to trigger a scroll.
    var _moveIntervalThreshold = 150; // Time between mousemoves must not exceed this threshold.    
    var _startEventName = "scrollstart";
    var _updateEventName = "scrollupdate";
    var _stopEventName = "scrollstop";
    var _eventType = hasTouchSupport() ? "touch" : "mouse";

    var _delayedClickSelector = "a,input,textarea,select,button,.ui-btn";
    var _delayedClickEnabled = true;

    this._$clip = null;
    this._$view = null;
    this._timerCB = null;
    this._hTracker = null;
    this._vTracker = null;

    this.create = function () {

        this._$clip = $("#dataList").addClass("ui-scrollview-clip");

        var $child = this._$clip.children();
        if ($child.length > 1) {
            $child = this._$clip.wrapInner("<div></div>").children();
        }

        this._$view = $child.addClass("ui-scrollview-view");
        this._$clip.css("overflow", _scrollMethod === "scroll" ? "scroll" : "hidden");

        this.makePositioned(this._$clip);

        if ($.browser.webkit) _scrollMethod = "translate";
        else _scrollMethod = "position";    
        
        this._$view.css("overflow", "hidden");

        this.showScrollBars = _scrollMethod === "scroll" ? false : this.showScrollBars;

        this._$view.css({
            left: 0,
            top: 0
        });

        this._sx = 0;
        this._sy = 0;

        var direction = this.direction;
        this._hTracker = (direction !== "y") ? new MomentumTracker() : null;
        this._vTracker = (direction !== "x") ? new MomentumTracker() : null;

        this._timerInterval = 1000 / this.fps;
        this._timerID = 0;

        var self = this;
        this._timerCB = function () {
            self.handleMomentumScroll();
        };

        this.addBehaviors();
    }


    this.addBehaviors = function () {

        var self = this;
        if (_eventType === "mouse") {
            this._dragStartEvt = "mousedown";
            this._dragStartCB = function (e) {
                return self.handleDragStart(e, e.clientX, e.clientY);
            };

            this._dragMoveEvt = "mousemove";
            this._dragMoveCB = function (e) {
                return self.handleDragMove(e, e.clientX, e.clientY);
            };
            this._dragStopEvt = "mouseup";
            this._dragStopCB = function (e) {
                return self.handleDragStop(e);
            };
            this._dragOutEvt = 'mouseout';
            this._dragOutCB = function (e) {
                return self.handelDragStop(e);
            }
        } else // "touch"
        {
            this._dragStartEvt = "touchstart";
            this._dragStartCB = function (e) {
                var t = e.originalEvent.targetTouches[0];
                return self.handleDragStart(e, t.pageX, t.pageY);
            };

            this._dragMoveEvt = "touchmove";
            this._dragMoveCB = function (e) {
                var t = e.originalEvent.targetTouches[0];
                return self.handleDragMove(e, t.pageX, t.pageY);
            };

            this._dragStopEvt = "touchend";
            this._dragStopCB = function (e) {
                return self.handleDragStop(e);
            };
        }


        this._$view.bind(this._dragStartEvt, this._dragStartCB);

        if (this.showScrollBars) {

            var $c = this._$clip;
            var prefix = "<div class=\"ui-scrollbar ui-scrollbar-";
            var suffix = "\"><div class=\"ui-scrollbar-track\"><div class=\"ui-scrollbar-thumb\"></div></div></div>";
            if (this._vTracker) {
                $c.append(prefix + "y" + suffix);
                this._$vScrollBar = $c.children(".ui-scrollbar-y");
            }
            if (this._hTracker) {
                $c.append(prefix + "x" + suffix);
                this._$hScrollBar = $c.children(".ui-scrollbar-x");
            }
        }
    }


    this.handleDragStart = function (e, ex, ey) {

        // Stop any scrolling of elements in our parent hierarcy.
        this.stopMScroll();
        var c = this._$clip;
        var v = this._$view;

        if (_delayedClickEnabled) {
            this._$clickEle = $(e.target).closest(_delayedClickSelector);
        }
        this._lastX = ex;
        this._lastY = ey;
        this._doSnapBackX = false;
        this._doSnapBackY = false;
        this._speedX = 0;
        this._speedY = 0;
        this._directionLock = "";
        this._didDrag = false;

        if (this._hTracker) {
            var cw = parseInt(c.css("width"), 10);
            var vw = parseInt(v.css("width"), 10);
            this._maxX = cw - vw;
            if (this._maxX > 0) this._maxX = 0;
            if (this._$hScrollBar) this._$hScrollBar.find(".ui-scrollbar-thumb").css("width", (cw >= vw ? "100%" : Math.floor(cw / vw * 100) + "%"));

        }

        if (this._vTracker) {
            var ch = parseInt(c.css("height"), 10);
            var vh = parseInt(v.css("height"), 10);
            this._maxY = ch - vh;
            if (this._maxY > 0) this._maxY = 0;
            if (this._$vScrollBar) this._$vScrollBar.find(".ui-scrollbar-thumb").css("height", (ch >= vh ? "100%" : Math.floor(ch / vh * 100) + "%"));
        }

        var svdir = this.direction;

        this._pageDelta = 0;
        this._pageSize = 0;
        this._pagePos = 0;

        this._lastMove = 0;
        this.enableTracking();

        e.preventDefault();

    }



    this.handleDragMove = function (e, ex, ey) {

        this._lastMove = this.getCurrentTime();
        var v = this._$view;
        var dx = ex - this._lastX;
        var dy = ey - this._lastY;
        var svdir = this.direction;

        if (!this._directionLock) {
            var x = Math.abs(dx);
            var y = Math.abs(dy);
            var mt = _moveThreshold;

            if (x < mt && y < mt) {
                return false;
            }

            var dir = null;
            var r = 0;
            if (x < y && (x / y) < 0.5) {
                dir = "y";
            } else if (x > y && (y / x) < 0.5) {
                dir = "x";
            }

            this._directionLock = svdir ? svdir : (dir ? dir : "none");
        }

        var newX = this._sx;
        var newY = this._sy;

        if (this._directionLock !== "y" && this._hTracker) {
            var x = this._sx;
            this._speedX = dx;
            newX = x + dx;

            // Simulate resistance.
            this._doSnapBackX = false;
            if (newX > 0 || newX < this._maxX) {
                e.preventDefault();
                this.showScrollBars();

                if (this._directionLock === "x") {
                    var sv = $("#dataList");
                    if (sv) {
                        this.setScrollPosition(newX, newY);
                        // return false;
                    }
                }

                newX = x + (dx / 3);
                this._doSnapBackX = true;
            }
        }

        if (this._directionLock !== "x" && this._vTracker) {
            var y = this._sy;
            this._speedY = dy;
            newY = y + dy;

            // Simulate resistance.
            this._doSnapBackY = false;
            if (newY > 0 || newY < this._maxY) {
                e.preventDefault();
                this.showScrollBars();

                //if (this._directionLock === "y") {                 
                var sv = $("#dataList");
                if (sv) {

                    this.setScrollPosition(newX, newY);
                    //return false;
                }
                // }
                newY = y + (dy / 3);
                this._doSnapBackY = true;
            }

        }

        this._didDrag = true;
        this._lastX = ex;
        this._lastY = ey;

        this.setScrollPosition(newX, newY);
        this.showScrollBars();
        e.preventDefault();
        return false;
    }

    this.handleDragStop = function (e) {

        var l = this._lastMove;
        var t = this.getCurrentTime();
        var doScroll = l && (t - l) <= _moveIntervalThreshold;

        var sx = (this._hTracker && this._speedX && doScroll) ? this._speedX : (this._doSnapBackX ? 1 : 0);
        var sy = (this._vTracker && this._speedY && doScroll) ? this._speedY : (this._doSnapBackY ? 1 : 0);

        var svdir = this.direction;

        if (sx || sy) this.startMScroll(sx, sy);
        else this.hideScrollBars();

        this.disableTracking();

        if (!this._didDrag && _delayedClickEnabled && this._$clickEle.length) {
            this._$clickEle.trigger("mouseup");


            //.trigger("focus")
        }

        // If a view scrolled, then we need to absorb
        // the event so that links etc, underneath our
        // cursor/finger don't fire.
        
        return this._didDrag ? false : undefined;
    }

    this.setScrollPosition = function (x, y) {

        this._sx = x;
        this._sy = y;

        var $v = this._$view;

        var sm = _scrollMethod;

        switch (sm) {
        case "translate":
            this.setElementTransform($v, x + "px", y + "px");
            break;
        case "position":
            $v.css({
                left: x + "px",
                top: y + "px"
            });
            break;
        case "scroll":
            var c = this._$clip[0];
            c.scrollLeft = -x;
            c.scrollTop = -y;
            break;
        }

        var $vsb = this._$vScrollBar;
        var $hsb = this._$hScrollBar;

        if ($vsb) {
            var $sbt = $vsb.find(".ui-scrollbar-thumb");
            if (sm === "translate") this.setElementTransform($sbt, "0px", -y / $v.height() * $sbt.parent().height() + "px");
            else $sbt.css("top", -y / $v.height() * 100 + "%");
        }

        if ($hsb) {
            var $sbt = $hsb.find(".ui-scrollbar-thumb");
            if (sm === "translate") this.setElementTransform($sbt, -x / $v.width() * $sbt.parent().width() + "px", "0px");
            else $sbt.css("left", -x / $v.width() * 100 + "%");
        }
    }



    ///Internal Scroll Methods
    this.startMScroll = function (speedX, speedY) {

        this.stopMScroll();
        this.showScrollBars();

        var keepGoing = false;
        var duration = _scrollDuration;

        //this._$clip.trigger(this.options.startEventName);
        var ht = this._hTracker;
        if (ht) {
            var c = this._$clip.width();
            var v = this._$view.width();
            ht.start(this._sx, speedX, duration, (v > c) ? -(v - c) : 0, 0);
            keepGoing = !ht.done();
        }

        var vt = this._vTracker;
        if (vt) {
            var c = this._$clip.height();
            var v = this._$view.height();
            vt.start(this._sy, speedY, duration, (v > c) ? -(v - c) : 0, 0);
            keepGoing = keepGoing || !vt.done();
        }

        if (keepGoing) this._timerID = setTimeout(this._timerCB, this._timerInterval);
        else this.stopMScroll();
    }

    this.handleMomentumScroll = function () {

        var keepGoing = false;
        var v = this._$view;

        var x = 0,
            y = 0;

        var vt = this._vTracker;
        if (vt) {
            vt.update();
            y = vt.getPosition();
            keepGoing = !vt.done();
        }

        var ht = this._hTracker;
        if (ht) {
            ht.update();
            x = ht.getPosition();
            keepGoing = keepGoing || !ht.done();
        }

        this.setScrollPosition(x, y);
        //this._$clip.trigger(this.options.updateEventName, [ { x: x, y: y } ]);
        if (keepGoing) this._timerID = setTimeout(this._timerCB, this._timerInterval);
        else this.stopMScroll();
    }

    this.stopMScroll = function () {

        if (this._timerID) {
            //this._$clip.trigger(_stopEventName);
            clearTimeout(this._timerID);
        }
        this._timerID = 0;

        if (this._vTracker) this._vTracker.reset();
        if (this._hTracker) this._hTracker.reset();

        this.hideScrollBars();
    }


    ///////Utilities

    this.scrollTo = function (x, y, duration) {
        this.stopMScroll();
        if (!duration) return this.setScrollPosition(x, y);

        x = -x;
        y = -y;

        var self = this;
        var start = this.getCurrentTime();
        var efunc = $.easing["easeOutQuad"];
        var sx = this._sx;
        var sy = this._sy;
        var dx = x - sx;
        var dy = y - sy;
        var tfunc = function () {
                var elapsed = getCurrentTime() - start;
                if (elapsed >= duration) {
                    self._timerID = 0;
                    self.setScrollPosition(x, y);
                } else {
                    var ec = efunc(elapsed / duration, elapsed, 0, 1, duration);
                    self.setScrollPosition(sx + (dx * ec), sy + (dy * ec));
                    self._timerID = setTimeout(tfunc, self._timerInterval);
                }
            };

        this._timerID = setTimeout(tfunc, this._timerInterval);
    }


    this.setElementTransform = function ($ele, x, y) {

        var v = "translate3d(" + x + "," + y + ", 0px)";
        $ele.css({
            "-moz-transform": v,
            "-webkit-transform": v,
            "transform": v
        });
    }

    this.getCurrentTime = function () {
        return (new Date()).getTime();
    }


    this.enableTracking = function () {

        $(document).bind(this._dragMoveEvt, this._dragMoveCB);
        $(document).bind(this._dragStopEvt, this._dragStopCB);
    }

    this.disableTracking = function () {

        $(document).unbind(this._dragMoveEvt, this._dragMoveCB);
        $(document).unbind(this._dragStopEvt, this._dragStopCB);
    }


    this.showScrollBars = function () {

        var vclass = "ui-scrollbar-visible";
        if (this._$vScrollBar) this._$vScrollBar.addClass(vclass);
        if (this._$hScrollBar) this._$hScrollBar.addClass(vclass);
    }

    this.hideScrollBars = function () {

        var vclass = "ui-scrollbar-visible";
        if (this._$vScrollBar) this._$vScrollBar.removeClass(vclass);
        if (this._$hScrollBar) this._$hScrollBar.removeClass(vclass);
    }

    this.makePositioned = function ($ele) {
        if ($ele.css("position") == "static") $ele.css("position", "relative");
    }
}