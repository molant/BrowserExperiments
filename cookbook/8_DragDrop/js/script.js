(function (doc, $, mdnzr) {
    
    var needsFilterTransform = $.browser.msie;
    mdnzr.load({
        
        // Check for FileReader and draganddrop support using Modernizr.load (http://www.modernizr.com/docs/#load)
        // This test will fail for Safari 5 due to lack of support for the standards defined FileReader object.
        // TODO: add $.browser.safari && $.browser.version <= 5, or something?
                
        test: mdnzr.draganddrop && !! (window.File && window.FileList && window.FileReader),
        // If no support, load the Silverlight FileReader HTML5 Polyfill (http://sandbox.knarly.com/js/dropfiles/)
        nope: 'dropfile.js'
    });
    
    mdnzr.load({
        // Test for IE < 9 so we can include the sylvester library for rotate transforms.
        test: needsFilterTransform,
        
        // Load the sylvester library and cssMath for adding Matrix Rotate Transform Filter.
        yep: 'iefilterrotate.js'
    });
                     		    

    var $dropArea = $('.dropArea');    

    // Attach our drag and drop handlers.
    $dropArea.bind({
        dragover: function () {
            $(this).addClass('hover');
            return false;
        },
        
        dragend: function () {
            $(this).removeClass('hover');
            return false;
        },
        
        drop: function (e) {
            //log('file drop', e);
            e = e || window.event;
            e.preventDefault();
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            // jQuery wraps the originalEvent, so we try to detect that here...
            e = e.originalEvent || e;
            
            // Using e.files with fallback because e.dataTransfer is immutable and can't be overridden in Polyfill.            
            var files = (e.files || e.dataTransfer.files);
            
            if (files.length < 1) {
                return false;
            }
            
            var $img = $('<img src="" class="uploadPic" title="" alt="" />');
            var file = files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                var $newImg = $img.clone().attr({
                    src: event.target.result,
                    title: file.name,
                    alt: file.name
              });
                
                // Resize large/small images...
                $newImg.width(400);
                $dropArea.empty();
                $dropArea.width($newImg.width());
                $dropArea.append($newImg);
                
                $newImg.bind('load', function () {
                    $dropArea.css('min-height', $(this).height() + 'px');
                    $dropArea.height($(this).height());
                });
            }
            reader.readAsDataURL(file);
            return false;
        }
    });
    
    $('.mustacheOptions li').live({
        mouseenter: function () {
            $(this).addClass('hover');
        },
        
        mouseleave: function () {
            $(this).removeClass('hover');
        },
        
        mousedown: function (e) {
        
            //log('mustache drag start', e);
            var $dragHolder = $('<div class="dragHolder"><div class="dragDelete"><img class="dragIcon" src="images/closeIcon.png"></img></div><div class="dragAlter"><img class="dragIcon" src="images/resizeIcon.png"></img></div><div class="dragRotate"><img class="dragIcon" src="images/rotateIcon.png"></img></div></div>'),
                $container = $('#container'),
                dragDeets = {
                    offsetX: -80,
                    offsetY: -45,
                    initX: e.layerX,
                    initY: e.layerY,
                    currX: e.layerX + -80,
                    currY: e.layerY + -45,
                    update: function (earg) {
                        dragDeets.currX = (earg.pageX - $container.offset().left) + dragDeets.offsetX;
                        dragDeets.currY = (earg.pageY - $container.offset().top) + dragDeets.offsetY;
                    }
                },
                
                moveHandler = function (e) {
                    //log('mustache drag', dragDeets, e);
                    dragDeets.update(e);
                   
                    // Update our drag templates position
                    $dragHolder.css({
                        top: dragDeets.currY,
                        left: dragDeets.currX
                    });
                    return false;
                },
                
                upHandler = function (e) {
                  
                    //log('mustache drag end', e);
                    dragDeets.update(e);
                    
                    // Update our drag templates position, make fully visible and styled, attach drag handlers.
                    $dragHolder.css({
                        top: dragDeets.currY,
                        left: dragDeets.currX
                    });
                    $dragHolder.children('img').css('opacity', 1.0);
                    $dragHolder.addClass('placed hover');
                    $container.unbind({
                        mousemove: moveHandler,
                        mouseup: $(this).onmouseup
                    });
                    return false;
                };
                
            var stacheImgUrl = $(this).css('background-image').slice(4, -1);
            if (stacheImgUrl[0] === '"') {
                stacheImgUrl = stacheImgUrl.slice(1, -1);
            }
            var $stacheImg = $('<img src="' + stacheImgUrl + '" alt="stache img" title="' + $(this).text() + '" />');
            $dragHolder.prepend($stacheImg);
            
            // Insert our drag template, update it's style, background and position.
            $dragHolder.css({
                top: dragDeets.currY,
                left: dragDeets.currX
            });
            
            $dragHolder.children('img').css('opacity', 0.7);            
            $container.append($dragHolder);
            
            // Create drag handlers on the container object.
            $container.bind({
                mousemove: moveHandler,
                mouseup: upHandler
            });
            
            return false;
        }
    });
    
    // Placed item handlers
    $('.dragHolder.placed').live({
    
        mouseenter: function () {
            $(this).addClass('hover');
        },
    
        mouseleave: function () {
            $(this).removeClass('hover');
        },
    
        mousedown: function (e) {
    
            var $dragHolder = $(this),
                $container = $('#container'),
    
                dragDeets = {
                    offsetX: -($dragHolder.width() / 2),
                    offsetY: -($dragHolder.height() / 2),
                    currX: (e.pageX - $container.offset().left) + -($dragHolder.width() / 2),
                    currY: (e.pageY - $container.offset().top) + -($dragHolder.height() / 2),
                    update: function (earg) {
                        dragDeets.currX = (earg.pageX - $container.offset().left) + dragDeets.offsetX;
                        dragDeets.currY = (earg.pageY - $container.offset().top) + dragDeets.offsetY;
                    }
                },
    
                moveHandler = function (e) {
                    dragDeets.update(e);
                    // Update our drag templates position
                    $dragHolder.css({
                        top: dragDeets.currY,
                        left: dragDeets.currX
                    });
                    return false;
                },
    
                upHandler = function (e) {
    
                    dragDeets.update(e);
    
                    // Update our drag templates position, make fully visible and styled, attach drag handlers.
                    $dragHolder.css({
                        top: dragDeets.currY,
                        left: dragDeets.currX,
                    });
    
                    $dragHolder.addClass('placed');
                    $dragHolder.children('img').css('opacity', 1.0);
                    $container.unbind({
                        mousemove: moveHandler,
                        mouseup: $(this).onmouseup
                    });
    
                    return false;
                };
    
            // Update the dragHolder position.
            $dragHolder.css({
                top: dragDeets.currY,
                left: dragDeets.currX
            });
    
            $dragHolder.children('img').css('opacity', 0.7);
    
            // Create drag handlers on the container object.
            $container.bind({
                mousemove: moveHandler,
                mouseup: upHandler
            });
    
            return false;
        }
    });
    
    // Placed item image manipulation handlers
    $('.placed .dragDelete').live({
        mousedown: function () {
            return false; // Keep the .dragHandler mousedown from occuring.
        },
    
        click: function () {
            var that = this;
            $(this).parent().fadeOut('fast', function () {
                $(that).parent().detach();
            });
            return false;
        }
    });
    
    $('.placed .dragAlter').live({
    
        mousedown: function (e) {
            var $resizingItem = $(this).parent(),
                $container = $('#container'),
                origWidth = $resizingItem.width(),
                origHeight = $resizingItem.height(),
                origin = function () {
                    return {
                        x: e.pageX,
                        y: e.pageY
                    };
                },
    
                dragDeets = {
                    currX: origin().x,
                    currY: origin().y,
                    update: function (earg) {
                        dragDeets.currX = earg.pageX;
                        dragDeets.currY = earg.pageY;
                    },
                    difference: function () {
                        return {
                            x: dragDeets.currX - origin().x,
                            y: dragDeets.currY - origin().y
                        };
                    }
                },
    
                moveHandler = function (e) {
                    dragDeets.update(e);
                    // Scale the size based on the change in x from the origin.
                    var diff = dragDeets.difference(),
                        newWidth = origWidth + diff.x,
                        newHeight = origHeight + diff.y;
                    $resizingItem.width(newWidth).height(newHeight).css({
                        top: (origin().y - $container.offset().y) + (newHeight / 2),
                        left: (origin().x - $container.offset().x) + (newWidth / 2)
                    });
                    return false;
                },
    
                upHandler = function (e) {
                    dragDeets.update(e);
                    // Update the sizes
                    var diff = dragDeets.difference(),
                        newWidth = origWidth + diff.x,
                        newHeight = origHeight + diff.y;
                    $resizingItem.width(newWidth).height(newHeight).css({
                        top: (origin().y - $container.offset().y) + (newHeight / 2),
                        left: (origin().x - $container.offset().x) + (newWidth / 2)
                    });
    
                    $resizingItem.addClass('placed');
                    $resizingItem.children('img').css('opacity', 1.0);
    
                    $container.unbind({
                        mousemove: moveHandler,
                        mouseup: $(this).onmouseup
                    });
                    return false;
                };
    
            $resizingItem.children('img').css('opacity', 0.7);
    
            $container.bind({
                mousemove: moveHandler,
                mouseup: upHandler
            });
    
            return false;
        }
    });
    
    $('.placed .dragRotate').live({
        mousedown: function (e) {
            var $resizingItem = $(this).parent(),
                $container = $('#container'),
                getRotateDegrees = function ($elem) {
                    if ($elem.css('transform') === null || !(typeof $elem.css('transform') === typeof String)) {
                        return 0;
                    }
                    return $elem.css('transform').splice(7, -4);
                },
                setRotateDegrees = function ($elem, deg) {
                    var rotateVal = 'rotate(' + deg + 'deg)';
                    $elem.css({
                        '-moz-transform': rotateVal,
                        '-o-transform': rotateVal,
                        '-webkit-transform': rotateVal,
                        '-ms-transform': rotateVal,
                        'transform': rotateVal,
                        zoom: 1
                    });
                    
                    // We checked for needsFilterTransform at the top of the script section.
                    if (needsFilterTransform) {
                        // IE needs filter for rotate transforms.
                        var filterVal = "progid:DXImageTransform.Microsoft.Matrix(" + cssMath.eval['deg2matrix'](deg) + ", sizingMethod='auto expand')";
                        $elem.css({
                            filter: filterVal
                        });
                        return;
                        var matrix = cssMath.deg2matrixObj(deg);
                        $elem.filters.item(0).M11 = matrix.M11;
                        $elem.filters.item(0).M12 = matrix.M12;
                        $elem.filters.item(0).M21 = matrix.M21;
                        $elem.filters.item(0).M22 = matrix.M22;
                    }
                },
                
                origRotate = getRotateDegrees($resizingItem),
                origin = function () {
                    return {
                        x: e.pageX,
                        y: e.pageY
                    };
                },
                
                dragDeets = {
                    currX: origin().x,
                    currY: origin().y,
                    update: function (earg) {
                        dragDeets.currX = earg.pageX;
                        dragDeets.currY = earg.pageY;
                    },
                    difference: function () {
                        return {
                            x: dragDeets.currX - origin().x,
                            y: dragDeets.currY - origin().y
                        };
                    }
                },
                
                moveHandler = function (e) {
                    dragDeets.update(e);
                    // Rotate based on change in y from origin					
                    var diff = dragDeets.difference();
                    setRotateDegrees($resizingItem, origRotate + diff.y);
                    return false;
                },
                
                upHandler = function (e) {
                    //log('resize drag end', e);
                    dragDeets.update(e);
                    // Update the sizes
                
                    var diff = dragDeets.difference();
                    setRotateDegrees($resizingItem, origRotate + diff.y);
                    $resizingItem.addClass('placed');
                    //$resizingItem.children('img').css('opacity', 1.0);
                
                    $container.unbind({
                        mousemove: moveHandler,
                        mouseup: $(this).onmouseup
                    });
                    return false;
                };
            
            //$resizingItem.children('img').css('opacity', 0.7);
            $container.bind({
                mousemove: moveHandler,
                mouseup: upHandler
            });
            return false;
        }
    });
})(document, jQuery, Modernizr);