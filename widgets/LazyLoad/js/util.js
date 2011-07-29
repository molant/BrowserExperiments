function ContentLoader() {}

ContentLoader.Init = function (container) {

    var elements = container.find(".placeholder");
    elements.each(function () {

        var self = this;
        self.loaded = false;

        $(self).one("appear", function (url) {
            if (!this.loaded) {
                $(self).hide();
                $(self).removeClass('placeholder');
                $(self).addClass("listImage");
                $(self).attr('src', $(self).attr("originalUrl"));
                $(self).fadeTo(300, 1);

                self.loaded = true;
            };
        });

        if (ContentLoader.InViewPort(self)) {

            ContentLoader.LoadImageWithCallback($(self).attr("originalUrl"), function (img) {
                $(self).trigger('appear');
            });
        }
    });


    $(window).bind("scroll", function (event) {

        if (elements != undefined && elements.length > 0) {
            elements.each(function () {

                var self = this;

                if (ContentLoader.InViewPort(self) && !self.loaded) {
                    ContentLoader.LoadImageWithCallback($(self).attr("originalUrl"), function (img) {
                        $(self).trigger('appear');
                    });
                }

                var temp = $.grep(elements, function (element) {
                    return !element.loaded;
                });
                elements = $(temp);

            });
        }
    });
}


ContentLoader.LoadImageWithCallback = function (url, callback) {

    var image = new Image();

    image.onload = function () {
        callback(image);
    }

    setTimeout(function () {
        image.src = url;
    }, 100 + Math.random() * 300);

    return image
}


ContentLoader.InViewPort = function (element) {

    var uiElement = $(element);
    var offset = uiElement.offset();

    var win = $(window);
    var windowTop = win.scrollTop();
    var windowLeft = win.scrollLeft();

    //Top Bottom
    if (offset.top < windowTop) {

        if (offset.top + uiElement.height() >= windowTop) {} else {
            return false;
        }
    } else {

        if (offset.top <= windowTop + win.height()) {} else {
            return false;
        }
    }

    //Left Right
    if (offset.left < windowLeft) {
        if (offset.left + uiElement.width() >= windowLeft) {} else {
            return false;
        }
    } else {
        if (offset.left <= windowLeft + win.width()) {} else {
            return false;
        }
    }

    return true;
}