//Global Vars
var min_width = 1024;
var min_height = 768;
var _stageW, _stageH;
var preloader;
var assets_manager = {};
var array_assets;
var _infoArray;
var _curImgHeight = 0;
var _curImgWidth = 0;
var _request;
var _isiPad;
var _supportsTransforms;
var _isPortrait = true;
var _browserCenterX
var _cartOpen = false;
var _cart;
var _cartCount = 0;
var _cartAmt = 0;
var _hasTouch = hasTouchSupport();

$(document).ready(function () {

    _supportsTransforms = Modernizr.csstransforms3d;
    _isiPad = navigator.userAgent.match(/iPad/i) != null;

    var useTouch = hasTouchSupport();
    var $browser_width = window.innerWidth;
    var $browser_height = window.innerHeight;
    _browserCenterX = $browser_width / 2;
    _stageW = $browser_width;
    _stageH = $browser_height;

    PreloadImages();

    $(window).resize(function () { handle_resize(); });
    window.addEventListener('orientationchange', orientation_changed, false);


    function initApp() {

        $("#main").animate({ opacity: 0 }, 250, function () {
            $("#progressBar").remove();
            $("#cartInfo").click(function () { toggleCart() });
            $("#backBtn").click(function () { LoadSales() });
            _cart = new slideInMenu('cart', false);

            LoadSales();
            animate();
        });
    }


    function clearViewPort() {

        $("#dashBtn").hide();
        Sales.deactivate();
        $(Sales).unbind('itemClicked');
        $(Application).unbind('itemDropped');
        Application.deactivate();
        $("#dataList").empty();
        $("#backBtn").hide();
        $("#sale").hide();

    }


    function LoadSales() {

        clearViewPort();
        Sales.initSales($("#dataList"), useTouch);
        Sales.resize(_stageW, _stageH);
        $(Sales).bind('itemClicked', function () {
            LoadDetail();
        });
    }

    function LoadDetail() {

        clearViewPort();
        Application.initApplication($("#dataList"), useTouch);
        $("#backBtn").show();
        $("#sale").show();
        $(Application).bind('itemDropped', function (e, data) {
            var listItem = $('<li></li>');
            var $itemImg = $('<img src="' + data.item + '" />');
            $itemImg.css({ height: '110px' })
            _cartCount++;
            $("#cartCount").html('(' + _cartCount + ')');
            _cartAmt += (Math.random() * 180 + 80);
            $("#cartTotal").html("$ " + _cartAmt.toLocaleString().split(".")[0] + "." + _cartAmt.toFixed(2).split(".")[1]);
            listItem.prepend($itemImg).appendTo("#itemList");

            setTimeout(function () { _cart.close(); }, 300);
        });
    }


    function animate() {
        _request = requestAnimFrame(animate);
        Application.draw();
        Sales.draw();
    }


    function orientation_changed() {

        _isPortrait = (window.orientation == 0 || window.orientation == null);
        $(window).trigger('resize');

        if (_isiPad) {
            var viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute('content', 'height=device-height,width=device-width; initial-scale=.87; maximum-scale=1.0; user-scalable=0;');
        }

    }

    function toggleCart() {
        _cart.toggle();
    }

    function PreloadImages() {

        array_assets = new Array();

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
                preloader = new Preloader(array_assets);
                preloader.onComplete = function () {

                    $('div[name="wimg1"] h1').css('margin-top', '150px').animate({ 'margin-top': '130px', opacity: 1 }, 350, 'easeOutBack').parent().click(function () { initApp(); });
                    $('div[name="mimg8"] h1').css('margin-top', '150px').animate({ 'margin-top': '130px', opacity: 1 }, 350, 'easeOutBack').parent().click(function () { initApp(); });
                    $('div[name="kimg1"] h1').css('margin-top', '150px').animate({ 'margin-top': '130px', opacity: 1 }, 350, 'easeOutBack').parent().click(function () { initApp(); });

                };
                preloader.onProgress = function (obj) {

                    var w = _stageW * (preloader.progress_number / 100);
                    $("#value").html(preloader.progress_number + "%");
                    $("#progressBar").animate({ width: w }, 50);

                    if (obj.name.indexOf("preload") >= 0) {

                        var key = obj.name.substring(8);
                        var container = $('div[name=' + key + ']');

                        if (container) {

                            var img = $('<img name="img_' + key + '" src="' + obj.src + '" alt="' + obj.name + '" />')
                            img.css({ opacity: 0,
                                display: "block"
                            });

                            container.prepend(img);

                            if (key != "wimg1" && key != "mimg8" && key != "kimg1")
                                img.animate({ opacity: 1 }, (preloader.progress_number * 10) + 1000);
                        }
                    }
                };
                preloader.init();
            }
        });
    }


    function handle_resize() {

        var $browser_width = window.innerWidth;
        var $browser_height = window.innerHeight;

        if (BrowserDetect.browser === "Explorer") {
            var $browser_width = $(window).width();
            var $browser_height = $(window).height();
        }

        _browserCenterX = $browser_width / 2;

        if (Application.isActive) Application.resize($browser_width, $browser_height);
        if (Sales.isActive) Sales.resize($browser_width, $browser_height);

        console.log("w: " + $browser_width + "h: " + $browser_height + "centerX: " + _browserCenterX);
    }

});



window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function ( /* function */ callback, /* DOMElement */ element) {
        return window.setTimeout(callback, 1000 / 60);
    };
})();

