/// <reference path="jquery-1.6.4-vsdoc.js" />
/// <reference path="jquery-1.6.4.js" />
/// <reference path="utils.js" />


var rainIndex = 0;


function createRainItem() {
    var image = $('<image src="' + getNextRainItem() + '" />');
    setCssProperty(image, 'transform', 'rotate(45deg)');
    setCssProperty(image, 'transition', 'all 10s ease-in-out');
    image.appendTo($('body'));
}

function getNextRainItem() {
    if ((rainIndex + 1) > rainValues.length) {
        rainIndex = 0;
    }
    var url = rainValues[rainIndex];
    rainIndex++;
    return url;
}