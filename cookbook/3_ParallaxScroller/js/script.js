//Global Vars
var assets_manager = {};
var array_assets;
var content_height = 720;
var min_width = 1024;
var min_height = 768;


$(document).ready(function () {

    // GetBrowserInfo
    var $browser_size = $.browser_size();
    var $browser_width = $browser_size[0];
    var $browser_height = $browser_size[1];

    if ($.browser.msie) {
        var $browser_width = $(window).width();
        var $browser_height = $(window).height();
    }

    if ($browser_width < min_width) {
        $browser_width = min_width;
    }

    if ($browser_height < min_height) {
        $browser_height = min_height;
    }

    $.debug("BROWSER SIZE: " + $browser_size);


    // BROWSER DETECT
    if ($.browser.msie && ($.browser.version == 9)) {
        type_browser = "ie9";
    } else if ($.browser.webkit) {
        type_browser = "webkit";
    } else if ($.browser.mozilla) {
        type_browser = "mozilla";
    } else if ($.browser.opera) {
        type_browser = "opera";
    } else {
        type_browser = "unknown";
    }

    $.debug("CURRENT BROWSER : " + type_browser);

    $(".infobox").css({
        top: ($browser_height / 2) - 140,
        left: ($browser_width / 2) - 100
    });
    $("#canvas")[0].width = $browser_width;
    $("#canvas")[0].height = $browser_height;
    $('#wrap').css({
        width: $browser_width,
        height: $browser_height
    });

    ShowPreloader();
    GetDataAsync();
    array_assets = new Array();


    function ShowPreloader() {
        $("#loaderContainer").fadeTo(400, 1);
    }


    function GetDataAsync() {

        $.ajax({
            type: "GET",
            url: "data/data.xml",
            dataType: "xml",
            success: function (xml) {

                $(xml).find('home').children().each(function () {
                    assets_manager[this.nodeName] = {};
                    get_next_depth(assets_manager[this.nodeName], $(this));
                });

            },
            complete: function () {
                Preloader.init(array_assets);
                //preloader = new Preloader(array_assets);
                Preloader.onComplete = function () {
                    initApp();
                };
                Preloader.init();
            }
        });

    }

    function initApp() {

        $("#loaderContainer").fadeTo(450, 0, function () {

            $("#wrap").fadeTo(450, 0.01);
            $("#wrap").animate({
                opacity: 1
            }, 450).delay(400);
            $("#loaderContainer").hide();

            var useTouch = hasTouchSupport();

            Application.initApplication(document.getElementById("canvas"), useTouch);

            animate();
        });

        $(window).resize(function () {
            handle_resize();
        });

    }

    function animate() {
        requestAnimFrame(animate);
        Application.draw();

    }

    function handle_resize() {

        var $browser_size = $.browser_size();
        var $browser_width = $browser_size[0];
        var $browser_height = $browser_size[1];


        if ($.browser.msie) {
            var $browser_width = $(window).width();
            var $browser_height = $(window).height();
        }

        if ($browser_width < min_width) {
            $browser_width = min_width;
        }

        if ($browser_height < min_height) {
            $browser_height = min_height;
        }

        $('#wrap').css({
            width: $browser_width,
            height: $browser_height
        });
        Application.resize($browser_width, $browser_height);
    }
});

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function ( /* function */ callback, /* DOMElement */ element) {
        window.setTimeout(callback, 1000 / 60);
    };
})();