///
/// transitions.js
/// A JavaScript Implementation of CSS3 Transitions
/// Built using features available in Internet Explorer 9
///
(function(undefined){
    var _prefix = ""; // "", "-moz-", "-webkit-", etc.

    // Utility function to log debug messages.
    function log(msg) { if(window.console) console.log(msg); }
    
    // Verify whether or not this script should run.
    (function(){
        // Ensure CSS Transitions are not supported natively.
        var elm = document.createElement("div");
        var support = ["transition", "MozTransition", "OTransition", "WebkitTransition", "MsTransition"];
        for(var name in support) {
            if(undefined !== elm.style[name]) {
                log("transitions.js: CSS Transitions are supported natively. Exiting.");
                return; 
            }
        }
        // Ensure necessary pre-requisites are supported.
        elm.setAttribute("style", "bogus-property:pass");
        if(
            // 1: matchesSelector (Selectors API Level 2)
            !(elm.matchesSelector || elm.mozMatchesSelector || elm.msMatchesSelector || elm.webkitMatchesSelector)
            // 2: getComputedStyle (DOM Level 2 Style)
            || !window.getComputedStyle
            // 3: Element/CSSStyleDeclaration (WebIDL + DOM Level 3 Core + DOM Level 2 Style)
            || !window.Element
            || !window.CSSStyleDeclaration
            // 4: defineProperty (ES5)
            || !Object.defineProperty
            // 5: mouseenter/mouseleave (DOM Level 3 Events)
            || !document.implementation.hasFeature("Events.mouseenter", "3.0")
            || !document.implementation.hasFeature("Events.mouseleave", "3.0")
            // 6: Preserve unknown CSS properties (including dashes)
            || "pass" !== elm.style["bogus-property"]
        ) {
            log("transitions.js: Not all pre-requisites are supported. Exiting.");
            return;
        }
    })();
 
    // The number of milliseconds to delay between frames.
    var FRAME_DELAY = Math.floor(1000/60); // 60 FPS
    
    // The list of all currently active animations.
    var _animations = [];
    
    // An identifier for the interval to cancel when no active animations remain.
    var _frameInterval;
    
    // A flag indicating that detected style modifications should be ignored.
    // This flag is set when the framework itself needs to alter styles.
    var _ignore = false;
    
    // Animation loop callback passed to setInterval.
    // Run a single frame of all active animations.
    function drawFrame() {
        var isFinished;
        var time = now(true); // Sync all animations to the same time

        // Run each active animation.
        for(var i = _animations.length - 1; i >= 0; i--) {
            isFinished = _animations[i].update(time);
            if(isFinished) _animations.splice(i,1);
        }

        // PERF: Stop the frame loop if no animations remain.
        if(_animations.length == 0) suspendFrameLoop();
    }
    
    // Resume the frame loop interval after a period of inactivity.
    // This is called when the loop is inactive after a new active animation has been created.
    function resumeFrameLoop() {
        _frameInterval = setInterval(drawFrame, FRAME_DELAY);
    }
    
    // Suspend the frame loop interval to conserve CPU cycles.
    // This is called when at the end of a frame when no active animations remain.
    function suspendFrameLoop() {
        clearInterval(_frameInterval);
        _frameInterval = null;
    }
    
    // Convert the provided dash-based CSS name to a camelCased JavaScript name.
    function makeCamelCase(cssName) {
        var domName = "";
        for(var i = 0; i < cssName.length; i++) {
            if(cssName[i] == '-') {
                domName[domName.length - 1] = cssName[i+1].toUpperCase();
                i++;
            } else {
                domName[domName.length - 1] = cssName[i];
            }
        }
        return domName;
    }
    
    // Convert the provided camelCased JavaScript name to a dash-based CSS name.
    function makeDashed(domName) {
        return domName.replace(/([A-Z])/g, "-$1").toLowerCase();
    }
    
    // Retrieve the current time. By default all subsequent calls are synced to the same time.
    // Passing "true" as the first parameter will reset the sync and retrieve the current time.
    var syncedTime;
    function now(reset) {
        if(!syncedTime || reset) syncedTime = new Date().getTime();
        return syncedTime;
    }
    
    /// MODULE: timing
    
    // Convert the provided CSS time string to milliseconds.
    function toMilliseconds(cssTime) {
        if(cssTime[cssTime.length - 2].toLowerCase() == "m") {
            return parseFloat(cssTime.substring(0,cssTime.length - 2));
        } else {
            return parseFloat(cssTime.substring(0,cssTime.length - 1)) * 1000;
        }
    }
    
    // Extract the transition timing definition from the provided CSS string.
    // Then instantiate and return the correct timing function implementation for the transition.
    var parseTimings = /^([^(]+)\(([^\)]+)/; // Regex to separate timing function name from arguments
    function getTimingFunction(name, reverse) {
        var args;
        if(name.indexOf("(") != -1) {
            var match = parseTimings.exec(name);
            if(match) {
                name = match[0];
                args = match[1].split(", ");
            }
        }
        switch(name) {
            // Simple definitions
            case "ease"         : return cubicBezier(0.25, 0.10, 0.25, 1.00, reverse);
            case "linear"       : return function(x){return x}; // Optimize linear
            case "ease-in"      : return cubicBezier(0.42, 0.00, 1.00, 1.00, reverse);
            case "ease-out"     : return cubicBezier(0.00, 0.00, 0.58, 1.00, reverse);
            case "ease-in-out"  : return cubicBezier(0.42, 0.00, 0.58, 1.00, reverse);
            case "step-start"   : return steps(1, 'start', reverse);
            case "step-end"     : return steps(1,   'end', reverse);
            
            // Complex definitions (with arguments)
            case "steps"        : if(args && args.length == 2) {
                return steps(parseInt(args[0]), args[1], reverse);
            }
            case "cubic-bezier" : if(args && args.length == 4) {
                return cubicBezier(parseFloat(args[0]), parseFloat(args[1]), parseFloat(args[2]), parseFloat(args[3]), reverse);
            }
            
            // Default handling (ease)
            default : log("Unrecognized timing function '" + name + "'. Defaulting to 'ease'");
                return cubicBezier(0.25, 0.10, 0.25, 1.00);
        }
    } 

    // Instantiate and return a cubic timing function implementation based on the provided control points.
    var cubicCache = {};
    function cubicBezier(x1, y1, x2, y2, reverse) {
        if(reverse) {
            var tx = x1;
            var ty = y1;
            x1 = 1 - x2;
            y1 = 1 - y2;
            x2 = 1 - tx;
            y2 = 1 - ty;
        }
        var key = "" + x1 + y1 + x2 + y2;
        var points = cubicCache[key] || (cubicCache[key] = createCubicCache(x1, y1, x2, y2));
        var i = 0, point;
        
        // The actual timing function that will be called with the current progress.
        function timingFunction(x) {
            // Scan forward since the time value, x, only increments on repeat calls.
            while((point = points[i]) && point.x < x) i++;
            // Return immediately if x is an exact match.
            if(point.x == x) return point.y;
            // Approximate y along the line connecting this point with the previous one.
            else return point.m*x + point.b; 
        }
        return timingFunction;
    }
    
    // PERF: Pre-calculate 100 points along the cubic bezier curve based on the provided control points.
    // Cache these pre-calculated points for re-use in future transitions.
    var STEPS = 100;
    function createCubicCache(x1, y1, x2, y2) {
        var points = [];
        
        function getX(t) {
            return 3*Math.pow(1-t,2)*t*x1 + 3*(1-t)*Math.pow(t,2)*x2 + Math.pow(t,3);
        }
        
        function getY(t) {
            return 3*Math.pow(1-t,2)*t*y1 + 3*(1-t)*Math.pow(t,2)*y2 + Math.pow(t,3);
        }
        
        // TODO: Use forward differencing to speed up the initial calculation.
        var x0 = 0, y0 = 0, x, y, t, m, b;
        for(var i = 0; i <= STEPS; i++) {
            t = i/STEPS;
            x0 = x;
            y0 = y;
            x = getX(t);
            y = getY(t);
            m = (y - y0) / (x - x0);
            b = y - m*x;
            points.push({ x:x, y:y, m:m, b:b });
        }
        
        return points;
    }
    
    // Instantiate and return a step timing function implementation based on the provided intervals and type.
    function steps(intervals, type) {
        log("Steps are not implemented. Falling back to linear.");
        function timingFunction(progress) {
            // TODO: Implement steps
            return progress;
        }
        return timingFunction;
    }
    
    /// END MODULE: timing

    // Create an animation function for the specified transition between the provided values.
    var splitUnits = /([0-9.]+)(.*)/gi; // Regex used to separate numbers from units in CSS values
    function activateTransition(transition, initialValue, finalValue, useOriginal) {
        log("Activating transition for '" + transition.property + "' from '" + initialValue + "' to '" + finalValue + "' over '" + transition.duration + "'.");
        
        // (Re-)Activate the animation loop if it's inactive.
        if(!_frameInterval) resumeFrameLoop();
        
        // The time offset at which to start this transition.
        // This is based on the current progress of the corresponding active transition (if any).
        var startTime = now();
        var startOffset = cancelActiveTransition(transition, startTime);
        
        var duration = toMilliseconds(transition.duration);
        if(startOffset) startTime -= duration - startOffset; // Adjust the start for a reverse animation
        else startTime += toMilliseconds(transition.delay);
        
        // Instantiate an interpolator to interpret progress between the initial and final values.
        var valueInterpolator = new ValueInterpolator(initialValue, finalValue);
        
        // Retrieve the appropriate timing function for this transition.
        var timingFunction = getTimingFunction(transition.timingFunction, !!startOffset);
        
        // Create a property animation instance to run the provided transition.
        var propertyAnimation = new PropertyAnimation(
            transition.object,
            transition.property,
            valueInterpolator,
            startTime,
            duration,
            timingFunction,
            useOriginal
        );
        
        // Add the property animation to the list of active animations
        _animations.push(propertyAnimation);
    }
    
    // 
    function cancelActiveTransition(transition, time) {
        var startOffset, object, property;
        // Cancel an existing animation for this transition if it exists.
        for(var i = 0; i < _animations.length; i++) {
            object = _animations[i].object;
            property = _animations[i].property;
            if(object === transition.object && property === transition.property) {
                log("Canceling active transition for '" + property + "'.");
                startOffset = _animations[i].cancel(time);
                _animations.splice(i,1);
                break;
            }
        }
        return startOffset;
    }
    
    // 
    function PropertyAnimation(
        object, 
        property, 
        valueInterpolator, 
        startTime, 
        duration, 
        timingFunction,
        useOriginal
    ) {
        /// Private Data
        
        var currentValue = valueInterpolator.getInitialValue();
        var originalValue = object[property];
        
        /// Public Data
        
        this.object = object;
        this.property = property;
        
        /// Private methods
        
        // Perform any necessary initialization for this instance.
        function init() {
            // Force the initial value (avoids visual "glitch").
            object[property] = currentValue;  
        }
        
        /// Public Methods
        
        // Cancel this animation at the provided synchronized current time
        // Returns the elapsed time of the animation.
        this.cancel = function(currentTime) {
            object[property] = originalValue;
            return currentTime - startTime;
        }
        
        // Resume this animation (only called if the animation was previously suspended).
        // This causes the animation to restore its current value to the animated property.
        this.resume = function() {
            object[property] = currentValue
        }
        
        // Suspend this animation.
        // This causes the animation to restore the original value to the animated property.
        this.suspend = function() {
            object[property] = originalValue;
        }
        
        // Update this animation to the provided synchronized current time.
        this.update = function(currentTime) {
            var finished = false;
            var progress = (currentTime - startTime) / duration;
            
            // Exit if we haven't hit our delay value yet
            if(progress < 0) return;
            
            // Determine the current value of the property.
            if(progress >= 1) {
                progress = 1;
                finished = true;
            } else {
                progress = timingFunction(progress);
            }
            currentValue = valueInterpolator.update(progress);
            
            // Assign the current value to the property.
            _ignore = true;
            object[property] = currentValue;
            if(finished && useOriginal) object[property] = originalValue;
            _ignore = false;
            
            return finished;
        }
        
        init();
    }
        
    // Temporarily suspend active animations
    // This allows state-change pseudo selectors to retrieve the correct final value
    var suspended = false;
    function suspendAnimations() {
        if(suspended) return;
        suspended = true;
        for(var i = 0; i < _animations.length; i++) {
            _animations[i].suspend();
        }
    }
    
    // Resume all active animations
    function resumeAnimations() {
        suspended = false;
        for(var i = 0; i < _animations.length; i++) {
            _animations[i].resume();
        }
    }
    
    // 
    function ValueInterpolator(initialValue, finalValue, type) {
    
        /// Private Data
    
        var delta;
        var units;
        
        /// Private Methods
    
        // 
        function init() {
            // Split the inital and final values into [number,unit] pairs.
            var finalComponents = splitUnits.exec(finalValue);
            splitUnits.lastIndex = 0; // Reset search position
            var initialComponents = splitUnits.exec(initialValue);
            splitUnits.lastIndex = 0; // Reset search position
            
            // Utilize the units from the final value.
            units = finalComponents && finalComponents[2];
            
            // Set the initial and final values to unitless numbers.
            finalValue = (units) ? finalComponents[1] : finalValue;
            initialValue = (units) ? initialComponents[1] : initialValue;
            
            // Interpret the initial and final values as floats.
            finalValue = parseFloat(finalValue);
            initialValue = parseFloat(initialValue);
            
            delta = finalValue - initialValue; // TODO: Handle non-number types
        }
        
        // The following describes how each property type undergoes transition or animation.
        // - color: interpolated via red, green, blue and alpha components (treating each as a number, see below).
        //     Issue: Are the colors interpolated in premultiplied space or non-premultiplied space?
        // - length: interpolated as real numbers.
        // - percentage: interpolated as real numbers.
        // - integer: interpolated via discrete steps (whole numbers). The interpolation happens in real number space and is converted to an integer using floor().
        // - number: interpolated as real (floating point) numbers.
        // - transform list: see CSS Transforms specification [CSS3-2D-TRANSFORMS].
        // - rectangle: interpolated via the x, y, width and height components (treating each as a number).
        // - visibility: interpolated via a discrete step. The interpolation happens in real number space between 0 and 1, where 1 is "visible" and all other values are "hidden".
        // - shadow: interpolated via the color, x, y and blur components (treating them as color and numbers where appropriate). In the case where there are lists of shadows, the shorter list is padded at the end with shadows whose color is transparent and all lengths (x, y, blur) are 0.
        // - gradient: interpolated via the positions and colors of each stop. They must have the same type (radial or linear) and same number of stops in order to be animated.
        // - paint server (SVG): interpolation is only supported between: gradient to gradient and color to color. They then work as above.
        // - space-separated list of above: If the lists have the same number of items, each item in the list is interpolated using the rules above. Otherwise, no interpolation (unless stated otherwise above).
        // - a shorthand property: If all the parts of a shorthand can be animated, then interpolation is performed as if each property was individually specified.      
        
        /// Public Methods
    
        //
        this.getInitialValue = function() {
            return initialValue;
        }
    
        // 
        this.update = function(progress) {
            var currentValue = initialValue + delta * progress; // TODO: Handle non-number types
            if(units) currentValue += units; // Add units if needed
            return currentValue;
        }
    
        init();
    }
    
    // Retrieve a transition for the specified property (if it exists)
    function getTransition(object, propName) {
        var transition = null;
        var propNameDashed = makeDashed(propName);
        var transitionProperty = object[_prefix + "transition-property"];
    
        // Check if any transitions are defined on this object
        if(transitionProperty) {
            // Check if the defined transitions include the provided property
            if(transitionProperty.indexOf(propNameDashed) != -1) {
                // Extract transition information
                var props = transitionProperty.split(", ");
                var delays = (object[_prefix + "transition-delay"]) ? object[_prefix + "transition-delay"].split(", ") : ["0s"];
                var durations = (object[_prefix + "transition-duration"]) ? object[_prefix + "transition-duration"].split(", ") : ["1s"];
                var timings = (object[_prefix + "transition-timing-function"]) ? object[_prefix + "transition-timing-function"].split(", ") : ["ease"];
                var index = props.indexOf(propNameDashed);
                
                // Create a transition object to represent the specified property transition
                transition = {
                    object         :    object,
                    property       :  propName,
                    delay          :    delays[ index %    delays.length ],
                    duration       : durations[ index % durations.length ],
                    timingFunction :   timings[ index %   timings.length ]
                };
            }
        }
    
        return transition;
    }
    
    function getComputedStyle(elm) {
        return elm.ownerDocument.defaultView.getComputedStyle(elm);
    }
    
    /// MODULE: inlineStyles
    
        // Wrap all gets/sets to the specified property to check for transitions
        // TODO: respond to changes that require reactive scanning (e.g. elm.style="some css text")
        function hookChangeNotification(proto, propName) {
            var transition;
            
            // Retrieve native getter/setter
            var desc = Object.getOwnPropertyDescriptor(proto, propName);

            // Create getter override
            function getter() {
                // TODO: return the final value during an animation
                return desc.get.apply(this, arguments);
            }

            // Create setter override
            function setter(value) {
                if(!_ignore) {
                    _ignore = true;
                    var style = this;
                    // For styles linked to elements, getComputedStyle must be used to get the current value
                    if(style[OWNER_ELEMENT]) {
                        style = getComputedStyle(style[OWNER_ELEMENT]);
                    } else {
                        // TODO: Compute the values (using a dynamic element) so the units will always match
                    }
                    if(transition = getTransition(style, propName)) {
                        var currentValue = desc.get.call(style);
                        activateTransition(transition, currentValue, value);
                    }
                    _ignore = false;
                }
                return desc.set.apply(this, arguments);
            }
            
            // Replace native getter/setter with defined overrides
            Object.defineProperty(proto, propName, { get : getter, set : setter });
        }

        // Wrap gets/sets to all ANIMATABLE properties to check for transitions
        function hookChangeNotifications() {
            var proto = CSSStyleDeclaration.prototype;
            for(propName in proto) {
                if(propName in ANIMATABLE) {
                    hookChangeNotification(proto, propName);
                }
            }
        }
        
        // Ensure calls to elm.style link the style to the owner element.
        // This enables accessing the owner element when the style is modified.
        var OWNER_ELEMENT = "--owner-element--";
        function linkElementStyles() {
            var ElementPrototype = Element.prototype;
            var desc = Object.getOwnPropertyDescriptor(ElementPrototype, "style");
            function getter() {
                // Retrieve the style object from the native getter.
                var style = desc.get.call(this);
                // Check if this style has already been linked.
                if(!style[OWNER_ELEMENT]) {
                    // Link the element to the returned style.
                    style[OWNER_ELEMENT] = this;
                }
                return style;
            }
            Object.defineProperty(ElementPrototype, "style", { get : getter });
        }
        
    /// END MODULE: inlineStyles
    
    /// MODULE: pseudoSelectors
    (function(){
        // Maintain lists of all rules with pseudo-selectors that can trigger transitions.
        var _pseudoRules;
        function resetPseudoRules() {
            _pseudoRules = {
                focus : [],
                hover : []
            }
        }
        resetPseudoRules();
        
        // Examine all provided rules for state-change pseudo selectors
        // TODO: handle descendant/sibling selectors following the pseudo-selector
        //      (will require splitting the selector, then using querySelectorAll on state change)
        function scanRules(rules) {
            var selectorText, modifiedSelectorText, prop, pseudo;
            // Iterate through all provided rules
            for(var i = 0, rule; rule = rules[i]; i++) {
                selectorText = rule.selectorText;
                // Verify the rule has a selector containing a colon (:)
                if(!selectorText || selectorText.indexOf(":") === -1) continue;
                // Verify the rule's style has at least one animatable property.
                for(prop in ANIMATABLE) {
                    if(rule.style[prop] !== "" && rule.style[prop] !== undefined) {
                        // Verify the selector contains a targetted pseudo-selector
                        for(pseudo in _pseudoRules) {
                            if(selectorText.indexOf(":" + pseudo) === -1) continue;
                            // Add the rule to the appropriate pseudo list
                             modifiedSelectorText = selectorText.replace(":" + pseudo, "");
                            _pseudoRules[pseudo].push({
                                index : i, 
                                cssText : rule.cssText, 
                                modifiedCssText : rule.cssText.replace(/^.+{/, modifiedSelectorText + "{"),
                                selectorText : selectorText, 
                                modifiedSelectorText : modifiedSelectorText, 
                                parent : rule.parentStyleSheet,
                                rule : rule
                            });
                        }
                        break; // We've found one animatable property. Exit to outer loop.
                    }
                }
            }
        }
        
        
        // Examine all loaded stylesheets for state-change pseudo selectors
        function scanStyleSheets() {
            var ss = document.styleSheets;
            for(var i = 0; i < ss.length; i++) {
                scanRules(ss[i].cssRules);
            }
        }
        
        // Check if the number of loaded stylesheets have changed
        // If so, re-examine all of them for state-change pseudo selectors
        var _numStyleSheets = 0;
        function updateStyleSheets() {
            if(_numStyleSheets != document.styleSheets.length) {
                _numStyleSheets = document.styleSheets.length;
                resetPseudoRules();
                scanStyleSheets();
            }
        }
        
        function persistStyles(elm) {
            elm.offsetWidth; // Force positioning styles to update
            var style = getComputedStyle(elm);
            var persistedStyle = {};
            
            // Persist animatable properties
            for(propName in ANIMATABLE) {
                persistedStyle[propName] = style[propName];
            }
            
            // Persist transition-related properties
            for(propName in TRANSITIONS) {
                persistedStyle[_prefix + propName] = style[_prefix + propName];
            }
            
            return persistedStyle;
        }
        
        function checkTransitions(elm, initialStyle, finalStyle) {
            // TODO: Improve perf by limiting this search to animatable properties defined in hoverRule
            // TODO: Properly handle changes to the transition-* properties between original and final styles
            for(var propName in ANIMATABLE) {
                // Look for changes in animatable properties
                if(initialStyle[propName] != finalStyle[propName]) {
                    // Check to see if a transition exists for this property
                    if(transition = getTransition(initialStyle, propName)) {
                        transition.object = elm.style; // Perform the transition on the element
                        activateTransition(transition, initialStyle[propName], finalStyle[propName], true);
                    }
                }
            }
        }
        
        // Abstraction layer for different implementations of "matchesSelector" 
        var p = Element.prototype;
        var _matchFn = p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.webkitMatchesSelector;
        function matchesSelector(elm, selector) {
            return _matchFn.call(elm, selector);
        }
        
        function handlePseudoSelectorActivated(e, rules) {
            var elm = e.target, initialStyle, finalStyle;
            updateStyleSheets(); // Ensure the tracked selectors list is up-to-date
            _ignore = true; // Ignore subsequent CSS modifications
            now(true); // Sync all subsequent time requests
            
            // Check each hover rule to see if it matches the target element
            for(var i = 0, rule; rule = rules[i]; i++) {
                if(matchesSelector(elm, rule.selectorText)) {
                
                    // Temporarily disable the selector to grab initial styles
                    rule.parent.deleteRule(rule.index);
                    initialStyle = persistStyles(elm);

                    // Re-enable the selector to grab final styles
                    rule.parent.insertRule(rule.cssText, rule.index);
                    suspendAnimations(); // TODO: PERF: avoid this by checking for animations and grabbing the correct style from there
                    finalStyle = persistStyles(elm);
                    resumeAnimations(); // TODO: PERF: avoid this by checking for animations and grabbing the correct style from there

                    checkTransitions(elm, initialStyle, finalStyle);
                }
            }
            _ignore = false; // Stop ignoring CSS modifications
        }
        
        function handlePseudoSelectorDeactivated(e, rules) {
            var elm = e.target, initialStyle, finalStyle;
            updateStyleSheets(); // Ensure the tracked selectors list is up-to-date
            _ignore = true; // Ignore subsequent CSS modifications
            now(true); // Sync all subsequent time requests
            
            // Check each hover rule to see if it matches the target element
            for(var i = 0, rule; rule = rules[i]; i++) {
                if(matchesSelector(elm, rule.modifiedSelectorText)) {
                
                    // Temporarily enable the modified selector to grab initial styles
                    rule.parent.insertRule(rule.modifiedCssText, rule.index);
                    initialStyle = persistStyles(elm);

                    // Re-enable the original selector to grab final styles
                    rule.parent.deleteRule(rule.index);
                    suspendAnimations(); // TODO: PERF: avoid this by checking for animations and grabbing the correct style from there
                    finalStyle = persistStyles(elm);
                    resumeAnimations(); // TODO: PERF: avoid this by checking for animations and grabbing the correct style from there

                    checkTransitions(elm, initialStyle, finalStyle);
                }
            }
            _ignore = false; // Stop ignoring CSS modifications
        }
        
        // Watch for style changes in response to :hover selectors
        document.addEventListener("mouseenter", function(e) { handlePseudoSelectorActivated  (e, _pseudoRules.hover); }, true);
        document.addEventListener("mouseleave", function(e) { handlePseudoSelectorDeactivated(e, _pseudoRules.hover); }, true);
       
        // Watch for style changes in response to :focus selectors
        document.addEventListener("focus", function(e) { handlePseudoSelectorActivated  (e, _pseudoRules.focus); }, true);
        document.addEventListener("blur" , function(e) { handlePseudoSelectorDeactivated(e, _pseudoRules.focus); }, true);
    })();
    /// END MODULE: pseudoSelectors
    
    // TODO: Include CSS 2D Transforms
    // TODO: Include animatable SVG properties
    var ANIMATABLE = {
        backgroundColor    : "color",
//TODO:    backgroundImage    : "only gradients",
        backgroundPosition : "percentage, length",
        borderBottomColor  : "color",
        borderBottomWidth  : "length",
        borderColor        : "color",
        borderLeftColor       : "color",
        borderLeftWidth    : "length",
        borderRightColor   : "color",
        borderRightWidth   : "length",
        borderSpacing      : "length",
        borderTopColor     : "color",
        borderTopWidth     : "length",
        borderWidth        : "length",
        bottom             : "length, percentage",
        color              : "color",
        crop               : "rectangle",
        fontSize           : "length, percentage",
        fontWeight         : "number",
//TODO:    grid-*             : "various",
        height             : "length, percentage",
        left               : "length, percentage",
        letterSpacing      : "length",
        lineHeight         : "number, length, percentage",
        marginBottom       : "length",
        marginLeft         : "length",
        marginRight        : "length",
        marginTop          : "length",
        maxHeight          : "length, percentage",
        maxWidth           : "length, percentage",
        minHeight          : "length, percentage",
        minWidth           : "length, percentage",
        opacity            : "number",
        outlineColor       : "color",
        outlineOffset      : "integer",
        outlineWidth       : "length",
        paddingBottom      : "length",
        paddingLeft        : "length",
        paddingRight       : "length",
        paddingTop         : "length",
        right              : "length, percentage",
        textIndent         : "length, percentage",
        textShadow         : "shadow",
        top                : "length, percentage",
        verticalAlign      : "keywords, length, percentage",
        visibility         : "visibility",
        width              : "length, percentage",
        wordSpacing        : "length, percentage",
        zIndex             : "integer",
        zoom               : "number"
    };
    
    var TRANSITIONS = {
        "transition-delay"           : 1,
        "transition-duration"        : 1,
        "transition-property"        : 1,
        "transition-timing-function" : 1
    };

    // Attach DOM hooks immediately after initialization
    hookChangeNotifications();
    
})();