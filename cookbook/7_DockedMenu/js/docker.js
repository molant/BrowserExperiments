var Docker = new function () {

    var supportTouch = hasTouchSupport();
    var currentstate = 'inline',
            delayTimer, showDelay = 100,
            toolbarSelector = '.ui-header-fixed:first, .ui-footer-fixed:not(.ui-footer-duplicate):last',
            touchStartEvent = "touchstart",
            touchStopEvent = "touchend",
            stateBefore = null,
            scrollTriggered = false,
            self = this;

    this.init = function () {

        //Grab Footer/header and Add styles
        var $this = $(this);
        $('.ui-header').addClass('ui-header-fixed');
        $('.ui-footer').addClass('ui-footer-fixed');

        this.hide();

        if (supportTouch) {
            $(document).bind(touchStartEvent, function (event) {
                self.hide();
            }).bind(touchStopEvent, function (event) {
                self.show();
            });
        }

        $(document).bind('scroll', function (event) { self.show(); });
        $(window).bind('resize', function (event) { self.show(); });

        this.show();
    }


    this.setTop = function (el) {

        var fromTop = $(window).scrollTop(),
                screenHeight = window.innerHeight,
                thisHeight = el.outerHeight(),
                relval;

        if (el.is('.ui-header-fixed')) { //Set header
            if (supportTouch) {
                return el.css('top', fromTop);
            } else { //For smoother positioning
                return el.css({
                    position: 'fixed',
                    top: 0
                });
            }
        } else { //set footer
            if (supportTouch) {
                return el.css('top', fromTop + screenHeight - thisHeight);  //needed for iOS

            } else { 
                return el.css({
                    position: 'fixed',
                    top: screenHeight - thisHeight
                });
            }
        }
    }


    this.show = function () {

        currentstate = 'overlay';

        $(toolbarSelector).each(function () {
            var el = $(this),
                    fromTop = $(window).scrollTop(),
                    screenHeight = window.innerHeight,
                    thisHeight = el.outerHeight();

            self.setTop(el);

            if (supportTouch) {
                var classes = 'fade in';
                el.animationComplete(function () {
                    el.fadeTo(0, 1);
                    el.removeClass(classes);
                }).addClass(classes);
            }
            else
                el.fadeTo(350, 1);
        });
    }


    this.hide = function () {

        currentstate = 'inline';
        $(toolbarSelector).each(function () {

            var el = $(this);
            el.fadeTo(0, 0);
        });
    }
}