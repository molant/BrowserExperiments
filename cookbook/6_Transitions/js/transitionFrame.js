var TransitionFrame = new function () {
        this.init = function () {

            var roleName = 'main',
                $loadEl = $('<div class="loading"><center><p>Loading...</p></center></div>'),
                opts = {
                    contentRole: roleName,
                    getContentHolder: function () {
                        return $('[role=' + roleName + ']');
                    },
                    // all links with our special transition attribute.
                    $navLinks: $('nav a[transition-link]'),
                    defaultTransition: 'slide',
                    transitionHandler: function (name, $to, $from, cb) {
                        $from.hide(name, {
                            direction: 'left',
                            easing: 'easeInQuad'
                        }, 300, function () {
                            // Transition in the to element
                            opts.getContentHolder().append($to);
                            $to.show(name, {
                                direction: 'right',
                                easing: 'easeOutQuad'
                            }, 300, function () {
                                // Remove the from element
                                $from.detach();
                                if ($.isFunction(cb)) {
                                    cb();
                                }
                            });
                        });
                    },
                    toggleLoading: function (isLoading, delay) {
                        return; // Not showing the loady in this version.
                        if (isLoading) {
                            $('#container').prepend($loadEl);
                            $loadEl.fadeIn(300, 1);
                        } else {
                            // Introduced a little delay for effect.
                            setTimeout(function () {
                                $loadEl.fadeOut(250, 0, function () {
                                    $loadEl.detach();
                                });
                            }, delay || 0);
                        }
                    }
                },
                pageLoadSettings = {
                    type: "get",
                    data: undefined,
                    reloadPage: false,
                    role: roleName,
                    showLoadMsg: true,
                },
                loadPage = function (url, options) {
                    var deferred = $.Deferred(),
                        settings = $.extend({}, pageLoadSettings, options),
                        page = null,
                        // The DOM element holder for the fetched page.
                        fileUrl = url; // Might want to massage the url in the future.
                    $.ajax({
                        url: fileUrl,
                        type: settings.type,
                        data: settings.data,
                        dataType: "html",
                        success: function (html) {

                            var all = $('<div></div>'),
                                contentSelector = '[role=' + settings.role + ']';

                            //workaround to allow scripts to execute when included in page divs
                            all.get(0).innerHTML = html;

                            // Find the content in the other page.					
                            if (!all.has(contentSelector)) {
                                deferred.reject(url, options);
                                return;
                            }

                            page = all.find('[role=' + settings.role + ']').first().contents();

                            deferred.resolve(page, fileUrl);
                        },
                        error: function () {
                            // hide the loading message.
                            opts.toggleLoading(false);

                            deferred.reject(url, options);
                        }
                    });

                    return deferred.promise();
                };


            //animation complete callback
            $.fn.animationComplete = function (callback) {
                if (Modernizr.csstransitions) {
                    return $(this).one('webkitAnimationEnd', callback);
                } else {
                    // defer execution for consistency between webkit/non webkit
                    setTimeout(callback, 0);
                    return $(this);
                }
            };
            // If we support css transitions, set our alternate transition handler.
            if (Modernizr.csstransitions) {
                opts.transitionHandler = function (name, $to, $from, cb) {
                    $from.addClass('slide out');
                    $from.animationComplete(function () {
                        $from.detach();
                        opts.getContentHolder().append($to);
                        $to.addClass('slide in');
                    });
                    $to.animationComplete(function () {
                        if ($.isFunction(cb)) {
                            cb();
                        }
                    });
                };
            }

            // Attach click handlers for all links with our special transition attribute.
            opts.$navLinks.click(function (e) {
                // Prevent navigation...
                e.preventDefault();

                opts.toggleLoading(true);

                // Toggle the selected menu item.
                $('nav .selected').toggleClass('selected', 200);
                var that = this;
                setTimeout(function () {
                    $(that).parent().addClass('selected', 200);
                }, 210);

                var pageUrl = $(this).attr('href'),
                    transition = $(this).attr('transition-name');
                log(pageUrl);

                loadPage(pageUrl).done(function ($newPageContents, url) {
                    var $oldContentHolder = opts.getContentHolder().wrapInner('<div class="pageWrap"></div>'),
                        $oldContent = $oldContentHolder.children().first(),
                        $newContent = $('<div class="newPageWrap"></div>').append($newPageContents),
                        transitionName = transition || opts.defaultTransition;

                    opts.transitionHandler(transitionName, $newContent, $oldContent, function () {
                        opts.toggleLoading(false);
                        $newContent.contents().unwrap();
                    });
                }).fail(function (url) {
                    opts.toggleLoading(false);
                    alert('Error getting page');
                });
            });


        }; //end init   
    };