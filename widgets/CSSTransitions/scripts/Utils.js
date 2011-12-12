function getTransitionEndEvent() {
    var vP = "";
    var transitionEnd = "transitionEnd";
    if ($.browser.webkit) {
        vP = "-webkit-";
        transitionEnd = "webkitTransitionEnd";
    } else if ($.browser.msie) {
        vP = "-ms-";
        transitionEnd = "MSTransitionEnd";

    } else if ($.browser.mozilla) {
        vP = "-moz-";
        transitionEnd = "transitionend";
    } else if ($.browser.opera) {
        vP = "-o-";
        transitionEnd = "oTransitionEnd";
    }
    return transitionEnd;
}

function setCssProperty(element, css, value) {
    var vendor = appendVendor(css);
    $(element).css(css, value);
    $(element).css(vendor, value);

}

function appendVendor(value) {
    var vP = "";
    var transitionEnd = "transitionEnd";
    if ($.browser.webkit) {
        vP = "-webkit-";
        transitionEnd = "webkitTransitionEnd";
    } else if ($.browser.msie) {
        vP = "-ms-";
        transitionEnd = "MSTransitionEnd";

    } else if ($.browser.mozilla) {
        vP = "-moz-";
        transitionEnd = "transitionend";
    } else if ($.browser.opera) {
        vP = "-o-";
        transitionEnd = "oTransitionEnd";
    }
    return vP + value;
}