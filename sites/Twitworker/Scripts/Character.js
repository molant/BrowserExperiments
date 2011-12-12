/// <reference path="jquery-1.6.4-vsdoc.js" />
/// <reference path="jquery-1.6.4.js" />
/// <reference path="utils.js" />
/// <reference path="ResourceLoader.js" />
/// <reference path="BackgroundAnimation.js" />


var characterIndex = 0;
var completeType = 0;

function startAnimateCharacter() {
    var character = $('#character');
    character.bind(getTransitionEndEvent(), onCharacterTransitionCompleted);
    animateCharacter();
}

function animateCharacter() {
    completeType = 1;
    var character = $('#character');
    character.removeClassCustom('characterTransition');
    animateProperty(character, 'left', -800);
    var url = getCharacterNextUrl();
    character.css('background', 'url("' + url + '")');
    character.addClassCustom("characterTransition");
    animateProperty(character, 'left', -100, onCharacterTransitionCompleted);
}

function onCharacterTransitionCompleted(e) {
    if (completeType == 1) {
        setTimeout(continueAnimation, 1000 * 2);
    }
    else if (completeType == 2) {
        setTimeout(animateCharacter, 1000 * 3);
    }
}

function continueAnimation() {
    var character = $('#character');
    animateProperty(character, 'left', 800, onCharacterTransitionCompleted);
    completeType = 2;
}

function getCharacterNextUrl() {
    if ((characterIndex + 1) > characterValues.length) {
        characterIndex = 0;
    }
    var url = characterValues[characterIndex];
    characterIndex++;
    return url;
}