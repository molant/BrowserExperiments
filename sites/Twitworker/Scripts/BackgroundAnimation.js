/// <reference path="jquery-1.6.4-vsdoc.js" />
/// <reference path="modernizr-latest.js" />
/// <reference path="Rain.js" />
/// <reference path="ResourceLoader.js" />
/// <reference path="transitions.js" />
/// <reference path="Utils.js" />
/// <reference path="Character.js" />

var index = 1;
var even = false;
var currentUrl;

function animateProperty(element, propertyName, value, completed) {
    if (!Modernizr.csstransitions) {
        if ($(element).data('animation') == true) {
            var properties = '{"' + propertyName + '":' + value + '}';
            properties = jQuery.parseJSON(properties);
            $(element).animate(properties, 1000, 'linear', completed);
        }
        else {
            $(element).css(propertyName, value);
        }
    }
    else {
        $(element).css(propertyName, value);
    }
}

$.prototype.addClassCustom = function (value) {
    if (Modernizr.csstransitions) {
        this.addClass(value);
    }
    else {
        this.data('animation', true);
    }
};

$.prototype.removeClassCustom = function (value) {
    if (Modernizr.csstransitions) {
        this.removeClass(value);
    }
    else {
        this.data('animation', null);
    }
};

function changeNextBackground() {

    var background = $('#imageBackground');
    background.addClassCustom('transition');

    animateProperty(background, 'opacity', 0);

    var url = getNextUrl();
    currentUrl = url;
    var backgroundNext = $('#imageBackgroundNext');
    backgroundNext.css('background', 'url("' + url + '")');
    backgroundNext.addClassCustom('transition');
    backgroundNext.bind(getTransitionEndEvent(), onBackgroundTransitionCompleted);
    animateProperty(backgroundNext, 'opacity', 1, onBackgroundTransitionCompleted);
}

function onBackgroundTransitionCompleted() {
    var background = $('#imageBackground');
    background.removeClassCustom('transition');
    background.css('background', 'url("' + currentUrl + '")');
    animateProperty(background, 'opacity', 1);


    var backgroundNext = $('#imageBackgroundNext');
    backgroundNext.removeClassCustom('transition');
    animateProperty(backgroundNext, 'opacity', 0);
    backgroundNext.addClassCustom('transition');
    $(this).unbind(getTransitionEndEvent(), onBackgroundTransitionCompleted);
    setTimeout(changeNextBackground, 1400);
}

function getNextUrl() {
    if ((index + 1) > imagesValues.length) {
        index = 0;
    }
    var url = imagesValues[index];
    index++;
    return url;
}