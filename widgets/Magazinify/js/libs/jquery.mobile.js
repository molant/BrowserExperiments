/*!
 * jQuery Mobile v1.0rc1
 * http://jquerymobile.com/
 *
 * Copyright 2010, jQuery Project
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function($, undefined) {

	// jQuery 1.4+
	if ($.cleanData) {
		var _cleanData = $.cleanData;
		$.cleanData = function(elems) {
			for (var i = 0, elem;
			(elem = elems[i]) != null; i++) {
				$(elem).triggerHandler("remove");
			}
			_cleanData(elems);
		};
	} else {
		var _remove = $.fn.remove;
		$.fn.remove = function(selector, keepData) {
			return this.each(function() {
				if (!keepData) {
					if (!selector || $.filter(selector, [this]).length) {
						$("*", this).add([this]).each(function() {
							$(this).triggerHandler("remove");
						});
					}
				}
				return _remove.call($(this), selector, keepData);
			});
		};
	}

	$.widget = function(name, base, prototype) {
		var namespace = name.split(".")[0],
			fullName;
		name = name.split(".")[1];
		fullName = namespace + "-" + name;

		if (!prototype) {
			prototype = base;
			base = $.Widget;
		}

		// create selector for plugin
		$.expr[":"][fullName] = function(elem) {
			return !!$.data(elem, name);
		};

		$[namespace] = $[namespace] || {};
		$[namespace][name] = function(options, element) {
			// allow instantiation without initializing for simple inheritance
			if (arguments.length) {
				this._createWidget(options, element);
			}
		};

		var basePrototype = new base();
		// we need to make the options hash a property directly on the new instance
		// otherwise we'll modify the options hash on the prototype that we're
		// inheriting from
		//	$.each( basePrototype, function( key, val ) {
		//		if ( $.isPlainObject(val) ) {
		//			basePrototype[ key ] = $.extend( {}, val );
		//		}
		//	});
		basePrototype.options = $.extend(true, {},
		basePrototype.options);
		$[namespace][name].prototype = $.extend(true, basePrototype, {
			namespace: namespace,
			widgetName: name,
			widgetEventPrefix: $[namespace][name].prototype.widgetEventPrefix || name,
			widgetBaseClass: fullName
		},
		prototype);

		$.widget.bridge(name, $[namespace][name]);
	};

	$.widget.bridge = function(name, object) {
		$.fn[name] = function(options) {
			var isMethodCall = typeof options === "string",
				args = Array.prototype.slice.call(arguments, 1),
				returnValue = this;

			// allow multiple hashes to be passed on init
			options = !isMethodCall && args.length ? $.extend.apply(null, [true, options].concat(args)) : options;

			// prevent calls to internal methods
			if (isMethodCall && options.charAt(0) === "_") {
				return returnValue;
			}

			if (isMethodCall) {
				this.each(function() {
					var instance = $.data(this, name);
					if (!instance) {
						throw "cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'";
					}
					if (!$.isFunction(instance[options])) {
						throw "no such method '" + options + "' for " + name + " widget instance";
					}
					var methodValue = instance[options].apply(instance, args);
					if (methodValue !== instance && methodValue !== undefined) {
						returnValue = methodValue;
						return false;
					}
				});
			} else {
				this.each(function() {
					var instance = $.data(this, name);
					if (instance) {
						instance.option(options || {})._init();
					} else {
						$.data(this, name, new object(options, this));
					}
				});
			}

			return returnValue;
		};
	};

	$.Widget = function(options, element) {
		// allow instantiation without initializing for simple inheritance
		if (arguments.length) {
			this._createWidget(options, element);
		}
	};

	$.Widget.prototype = {
		widgetName: "widget",
		widgetEventPrefix: "",
		options: {
			disabled: false
		},
		_createWidget: function(options, element) {
			// $.widget.bridge stores the plugin instance, but we do it anyway
			// so that it's stored even before the _create function runs
			$.data(element, this.widgetName, this);
			this.element = $(element);
			this.options = $.extend(true, {},
			this.options, this._getCreateOptions(), options);

			var self = this;
			this.element.bind("remove." + this.widgetName, function() {
				self.destroy();
			});

			this._create();
			this._trigger("create");
			this._init();
		},
		_getCreateOptions: function() {
			var options = {};
			if ($.metadata) {
				options = $.metadata.get(element)[this.widgetName];
			}
			return options;
		},
		_create: function() {},
		_init: function() {},

		destroy: function() {
			this.element.unbind("." + this.widgetName).removeData(this.widgetName);
			this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(
			this.widgetBaseClass + "-disabled " + "ui-state-disabled");
		},

		widget: function() {
			return this.element;
		},

		option: function(key, value) {
			var options = key;

			if (arguments.length === 0) {
				// don't return a reference to the internal hash
				return $.extend({},
				this.options);
			}

			if (typeof key === "string") {
				if (value === undefined) {
					return this.options[key];
				}
				options = {};
				options[key] = value;
			}

			this._setOptions(options);

			return this;
		},
		_setOptions: function(options) {
			var self = this;
			$.each(options, function(key, value) {
				self._setOption(key, value);
			});

			return this;
		},
		_setOption: function(key, value) {
			this.options[key] = value;

			if (key === "disabled") {
				this.widget()[value ? "addClass" : "removeClass"](
				this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled").attr("aria-disabled", value);
			}

			return this;
		},

		enable: function() {
			return this._setOption("disabled", false);
		},
		disable: function() {
			return this._setOption("disabled", true);
		},

		_trigger: function(type, event, data) {
			var callback = this.options[type];

			event = $.Event(event);
			event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
			data = data || {};

			// copy original event properties over to the new event
			// this would happen if we could call $.event.fix instead of $.Event
			// but we don't have a way to force an event to be fixed multiple times
			if (event.originalEvent) {
				for (var i = $.event.props.length, prop; i;) {
					prop = $.event.props[--i];
					event[prop] = event.originalEvent[prop];
				}
			}

			this.element.trigger(event, data);

			return ! ($.isFunction(callback) && callback.call(this.element[0], event, data) === false || event.isDefaultPrevented());
		}
	};

})(jQuery);
/*
	* jQuery Mobile Framework : widget factory extentions for mobile
	* Copyright (c) jQuery Project
	* Dual licensed under the MIT or GPL Version 2 licenses.
	* http://jquery.org/license
	*/

(function($, undefined) {

	$.widget("mobile.widget", {
		// decorate the parent _createWidget to trigger `widgetinit` for users
		// who wish to do post post `widgetcreate` alterations/additions
		//
		// TODO create a pull request for jquery ui to trigger this event
		// in the original _createWidget
		_createWidget: function() {
			$.Widget.prototype._createWidget.apply(this, arguments);
			this._trigger('init');
		},

		_getCreateOptions: function() {

			var elem = this.element,
				options = {};

			$.each(this.options, function(option) {

				var value = elem.jqmData(option.replace(/[A-Z]/g, function(c) {
					return "-" + c.toLowerCase();
				}));

				if (value !== undefined) {
					options[option] = value;
				}
			});

			return options;
		}
	});

})(jQuery);
/*
	* jQuery Mobile Framework : a workaround for window.matchMedia
	* Copyright (c) jQuery Project
	* Dual licensed under the MIT or GPL Version 2 licenses.
	* http://jquery.org/license
	*/
(function($, undefined) {

	var $window = $(window),
		$html = $("html");

	/* $.mobile.media method: pass a CSS media type or query and get a bool return
	note: this feature relies on actual media query support for media queries, though types will work most anywhere
	examples:
		$.mobile.media('screen') //>> tests for screen media type
		$.mobile.media('screen and (min-width: 480px)') //>> tests for screen media type with window width > 480px
		$.mobile.media('@media screen and (-webkit-min-device-pixel-ratio: 2)') //>> tests for webkit 2x pixel ratio (iPhone 4)
		*/
	$.mobile.media = (function() {
		// TODO: use window.matchMedia once at least one UA implements it
		var cache = {},
			testDiv = $("<div id='jquery-mediatest'>"),
			fakeBody = $("<body>").append(testDiv);

		return function(query) {
			if (! (query in cache)) {
				var styleBlock = document.createElement("style"),
					cssrule = "@media " + query + " { #jquery-mediatest { position:absolute; } }";

				//must set type for IE!
				styleBlock.type = "text/css";

				if (styleBlock.styleSheet) {
					styleBlock.styleSheet.cssText = cssrule;
				} else {
					styleBlock.appendChild(document.createTextNode(cssrule));
				}

				$html.prepend(fakeBody).prepend(styleBlock);
				cache[query] = testDiv.css("position") === "absolute";
				fakeBody.add(styleBlock).remove();
			}
			return cache[query];
		};
	})();

})(jQuery);

/*
	* jQuery Mobile Framework : support tests
	* Copyright (c) jQuery Project
	* Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
	*/

(function($, undefined) {

	var fakeBody = $("<body>").prependTo("html"),
		fbCSS = fakeBody[0].style,
		vendors = ["Webkit", "Moz", "O"],
		webos = "palmGetResource" in window,
	//only used to rule out scrollTop
	bb = window.blackberry; //only used to rule out box shadow, as it's filled opaque on BB
	// thx Modernizr
	function propExists(prop) {
		var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
			props = (prop + " " + vendors.join(uc_prop + " ") + uc_prop).split(" ");

		for (var v in props) {
			if (fbCSS[props[v]] !== undefined) {
				return true;
			}
		}
	}

	// Test for dynamic-updating base tag support ( allows us to avoid href,src attr rewriting )
	function baseTagTest() {
		var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
			base = $("head base"),
			fauxEle = null,
			href = "",
			link, rebase;

		if (!base.length) {
			base = fauxEle = $("<base>", {
				"href": fauxBase
			}).appendTo("head");
		} else {
			href = base.attr("href");
		}

		link = $("<a href='testurl'></a>").prependTo(fakeBody);
		rebase = link[0].href;
		base[0].href = href ? href : location.pathname;

		if (fauxEle) {
			fauxEle.remove();
		}
		return rebase.indexOf(fauxBase) === 0;
	}

	// non-UA-based IE version check by James Padolsey, modified by jdalton - from http://gist.github.com/527683
	// allows for inclusion of IE 6+, including Windows Mobile 7
	$.mobile.browser = {};
	$.mobile.browser.ie = (function() {
		var v = 3,
			div = document.createElement("div"),
			a = div.all || [];

		while (div.innerHTML = "<!--[if gt IE " + (++v) + "]><br><![endif]-->", a[0]);

		return v > 4 ? v : !v;
	})();

	$.extend($.support, {
		orientation: "orientation" in window,
		touch: "ontouchend" in document,
		cssTransitions: "WebKitTransitionEvent" in window,
		pushState: "pushState" in history && "replaceState" in history,
		mediaquery: $.mobile.media("only all"),
		cssPseudoElement: !!propExists("content"),
		touchOverflow: !!propExists("overflowScrolling"),
		boxShadow: !!propExists("boxShadow") && !bb,
		scrollTop: ("pageXOffset" in window || "scrollTop" in document.documentElement || "scrollTop" in fakeBody[0]) && !webos,
		dynamicBaseTag: baseTagTest()
	});

	fakeBody.remove();
})(jQuery);
/*
* jQuery Mobile Framework : "mouse" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

// This plugin is an experiment for abstracting away the touch and mouse
// events so that developers don't have to worry about which method of input
// the device their document is loaded on supports.
//
// The idea here is to allow the developer to register listeners for the
// basic mouse events, such as mousedown, mousemove, mouseup, and click,
// and the plugin will take care of registering the correct listeners
// behind the scenes to invoke the listener at the fastest possible time
// for that device, while still retaining the order of event firing in
// the traditional mouse environment, should multiple handlers be registered
// on the same element for different events.
//
// The current version exposes the following virtual events to jQuery bind methods:
// "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel"
(function($, window, document, undefined) {

	var dataPropertyName = "virtualMouseBindings",
		touchTargetPropertyName = "virtualTouchID",
		virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
		touchEventProps = "clientX clientY pageX pageY screenX screenY".split(" "),
		activeDocHandlers = {},
		resetTimerID = 0,
		startX = 0,
		startY = 0,
		didScroll = false,
		clickBlockList = [],
		blockMouseTriggers = false,
		blockTouchTriggers = false,
		eventCaptureSupported = "addEventListener" in document,
		$document = $(document),
		nextTouchID = 1,
		lastTouchID = 0;

	$.vmouse = {
		moveDistanceThreshold: 10,
		clickDistanceThreshold: 10,
		resetTimerDuration: 1500
	};



	function getNativeEvent(event) {

		while (event && typeof event.originalEvent !== "undefined") {
			event = event.originalEvent;
		}
		return event;
	}



	function createVirtualEvent(event, eventType) {

		var t = event.type,
			oe, props, ne, prop, ct, touch, i, j;

		event = $.Event(event);
		event.type = eventType;

		oe = event.originalEvent;
		props = $.event.props;

		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if (oe) {
			for (i = props.length, prop; i;) {
				prop = props[--i];
				event[prop] = oe[prop];
			}
		}

		// make sure that if the mouse and click virtual events are generated
		// without a .which one is defined
		if (t.search(/mouse(down|up)|click/) > -1 && !event.which) {
			event.which = 1;
		}

		if (t.search(/^touch/) !== -1) {
			ne = getNativeEvent(oe);
			t = ne.touches;
			ct = ne.changedTouches;
			touch = (t && t.length) ? t[0] : ((ct && ct.length) ? ct[0] : undefined);

			if (touch) {
				for (j = 0, len = touchEventProps.length; j < len; j++) {
					prop = touchEventProps[j];
					event[prop] = touch[prop];
				}
			}
		}

		return event;
	}



	function getVirtualBindingFlags(element) {

		var flags = {},
			b, k;

		while (element) {

			b = $.data(element, dataPropertyName);

			for (k in b) {
				if (b[k]) {
					flags[k] = flags.hasVirtualBinding = true;
				}
			}
			element = element.parentNode;
		}
		return flags;
	}



	function getClosestElementWithVirtualBinding(element, eventType) {
		var b;
		while (element) {

			b = $.data(element, dataPropertyName);

			if (b && (!eventType || b[eventType])) {
				return element;
			}
			element = element.parentNode;
		}
		return null;
	}



	function enableTouchBindings() {
		blockTouchTriggers = false;
	}



	function disableTouchBindings() {
		blockTouchTriggers = true;
	}



	function enableMouseBindings() {
		lastTouchID = 0;
		clickBlockList.length = 0;
		blockMouseTriggers = false;

		// When mouse bindings are enabled, our
		// touch bindings are disabled.
		disableTouchBindings();
	}



	function disableMouseBindings() {
		// When mouse bindings are disabled, our
		// touch bindings are enabled.
		enableTouchBindings();
	}



	function startResetTimer() {
		clearResetTimer();
		resetTimerID = setTimeout(function() {
			resetTimerID = 0;
			enableMouseBindings();
		},
		$.vmouse.resetTimerDuration);
	}



	function clearResetTimer() {
		if (resetTimerID) {
			clearTimeout(resetTimerID);
			resetTimerID = 0;
		}
	}



	function triggerVirtualEvent(eventType, event, flags) {
		var ve;

		if ((flags && flags[eventType]) || (!flags && getClosestElementWithVirtualBinding(event.target, eventType))) {

			ve = createVirtualEvent(event, eventType);

			$(event.target).trigger(ve);
		}

		return ve;
	}



	function mouseEventCallback(event) {
		var touchID = $.data(event.target, touchTargetPropertyName);

		if (!blockMouseTriggers && (!lastTouchID || lastTouchID !== touchID)) {
			var ve = triggerVirtualEvent("v" + event.type, event);
			if (ve) {
				if (ve.isDefaultPrevented()) {
					event.preventDefault();
				}
				if (ve.isPropagationStopped()) {
					event.stopPropagation();
				}
				if (ve.isImmediatePropagationStopped()) {
					event.stopImmediatePropagation();
				}
			}
		}
	}



	function handleTouchStart(event) {

		var touches = getNativeEvent(event).touches,
			target, flags;

		if (touches && touches.length === 1) {

			target = event.target;
			flags = getVirtualBindingFlags(target);

			if (flags.hasVirtualBinding) {

				lastTouchID = nextTouchID++;
				$.data(target, touchTargetPropertyName, lastTouchID);

				clearResetTimer();

				disableMouseBindings();
				didScroll = false;

				var t = getNativeEvent(event).touches[0];
				startX = t.pageX;
				startY = t.pageY;

				triggerVirtualEvent("vmouseover", event, flags);
				triggerVirtualEvent("vmousedown", event, flags);
			}
		}
	}



	function handleScroll(event) {
		if (blockTouchTriggers) {
			return;
		}

		if (!didScroll) {
			triggerVirtualEvent("vmousecancel", event, getVirtualBindingFlags(event.target));
		}

		didScroll = true;
		startResetTimer();
	}



	function handleTouchMove(event) {
		if (blockTouchTriggers) {
			return;
		}

		var t = getNativeEvent(event).touches[0],
			didCancel = didScroll,
			moveThreshold = $.vmouse.moveDistanceThreshold;
		didScroll = didScroll || (Math.abs(t.pageX - startX) > moveThreshold || Math.abs(t.pageY - startY) > moveThreshold),
		flags = getVirtualBindingFlags(event.target);

		if (didScroll && !didCancel) {
			triggerVirtualEvent("vmousecancel", event, flags);
		}

		triggerVirtualEvent("vmousemove", event, flags);
		startResetTimer();
	}



	function handleTouchEnd(event) {
		if (blockTouchTriggers) {
			return;
		}

		disableTouchBindings();

		var flags = getVirtualBindingFlags(event.target),
			t;
		triggerVirtualEvent("vmouseup", event, flags);

		if (!didScroll) {
			var ve = triggerVirtualEvent("vclick", event, flags);
			if (ve && ve.isDefaultPrevented()) {
				// The target of the mouse events that follow the touchend
				// event don't necessarily match the target used during the
				// touch. This means we need to rely on coordinates for blocking
				// any click that is generated.
				t = getNativeEvent(event).changedTouches[0];
				clickBlockList.push({
					touchID: lastTouchID,
					x: t.clientX,
					y: t.clientY
				});

				// Prevent any mouse events that follow from triggering
				// virtual event notifications.
				blockMouseTriggers = true;
			}
		}
		triggerVirtualEvent("vmouseout", event, flags);
		didScroll = false;

		startResetTimer();
	}



	function hasVirtualBindings(ele) {
		var bindings = $.data(ele, dataPropertyName),
			k;

		if (bindings) {
			for (k in bindings) {
				if (bindings[k]) {
					return true;
				}
			}
		}
		return false;
	}



	function dummyMouseHandler() {}



	function getSpecialEventObject(eventType) {
		var realType = eventType.substr(1);

		return {
			setup: function(data, namespace) {
				// If this is the first virtual mouse binding for this element,
				// add a bindings object to its data.
				if (!hasVirtualBindings(this)) {
					$.data(this, dataPropertyName, {});
				}

				// If setup is called, we know it is the first binding for this
				// eventType, so initialize the count for the eventType to zero.
				var bindings = $.data(this, dataPropertyName);
				bindings[eventType] = true;

				// If this is the first virtual mouse event for this type,
				// register a global handler on the document.
				activeDocHandlers[eventType] = (activeDocHandlers[eventType] || 0) + 1;

				if (activeDocHandlers[eventType] === 1) {
					$document.bind(realType, mouseEventCallback);
				}

				// Some browsers, like Opera Mini, won't dispatch mouse/click events
				// for elements unless they actually have handlers registered on them.
				// To get around this, we register dummy handlers on the elements.
				$(this).bind(realType, dummyMouseHandler);

				// For now, if event capture is not supported, we rely on mouse handlers.
				if (eventCaptureSupported) {
					// If this is the first virtual mouse binding for the document,
					// register our touchstart handler on the document.
					activeDocHandlers["touchstart"] = (activeDocHandlers["touchstart"] || 0) + 1;

					if (activeDocHandlers["touchstart"] === 1) {
						$document.bind("touchstart", handleTouchStart).bind("touchend", handleTouchEnd)

						// On touch platforms, touching the screen and then dragging your finger
						// causes the window content to scroll after some distance threshold is
						// exceeded. On these platforms, a scroll prevents a click event from being
						// dispatched, and on some platforms, even the touchend is suppressed. To
						// mimic the suppression of the click event, we need to watch for a scroll
						// event. Unfortunately, some platforms like iOS don't dispatch scroll
						// events until *AFTER* the user lifts their finger (touchend). This means
						// we need to watch both scroll and touchmove events to figure out whether
						// or not a scroll happenens before the touchend event is fired.
						.bind("touchmove", handleTouchMove).bind("scroll", handleScroll);
					}
				}
			},

			teardown: function(data, namespace) {
				// If this is the last virtual binding for this eventType,
				// remove its global handler from the document.
				--activeDocHandlers[eventType];

				if (!activeDocHandlers[eventType]) {
					$document.unbind(realType, mouseEventCallback);
				}

				if (eventCaptureSupported) {
					// If this is the last virtual mouse binding in existence,
					// remove our document touchstart listener.
					--activeDocHandlers["touchstart"];

					if (!activeDocHandlers["touchstart"]) {
						$document.unbind("touchstart", handleTouchStart).unbind("touchmove", handleTouchMove).unbind("touchend", handleTouchEnd).unbind("scroll", handleScroll);
					}
				}

				var $this = $(this),
					bindings = $.data(this, dataPropertyName);

				// teardown may be called when an element was
				// removed from the DOM. If this is the case,
				// jQuery core may have already stripped the element
				// of any data bindings so we need to check it before
				// using it.
				if (bindings) {
					bindings[eventType] = false;
				}

				// Unregister the dummy event handler.
				$this.unbind(realType, dummyMouseHandler);

				// If this is the last virtual mouse binding on the
				// element, remove the binding data from the element.
				if (!hasVirtualBindings(this)) {
					$this.removeData(dataPropertyName);
				}
			}
		};
	}

	// Expose our custom events to the jQuery bind/unbind mechanism.
	for (var i = 0; i < virtualEventNames.length; i++) {
		$.event.special[virtualEventNames[i]] = getSpecialEventObject(virtualEventNames[i]);
	}

	// Add a capture click handler to block clicks.
	// Note that we require event capture support for this so if the device
	// doesn't support it, we punt for now and rely solely on mouse events.
	if (eventCaptureSupported) {
		document.addEventListener("click", function(e) {
			var cnt = clickBlockList.length,
				target = e.target,
				x, y, ele, i, o, touchID;

			if (cnt) {
				x = e.clientX;
				y = e.clientY;
				threshold = $.vmouse.clickDistanceThreshold;

				// The idea here is to run through the clickBlockList to see if
				// the current click event is in the proximity of one of our
				// vclick events that had preventDefault() called on it. If we find
				// one, then we block the click.
				//
				// Why do we have to rely on proximity?
				//
				// Because the target of the touch event that triggered the vclick
				// can be different from the target of the click event synthesized
				// by the browser. The target of a mouse/click event that is syntehsized
				// from a touch event seems to be implementation specific. For example,
				// some browsers will fire mouse/click events for a link that is near
				// a touch event, even though the target of the touchstart/touchend event
				// says the user touched outside the link. Also, it seems that with most
				// browsers, the target of the mouse/click event is not calculated until the
				// time it is dispatched, so if you replace an element that you touched
				// with another element, the target of the mouse/click will be the new
				// element underneath that point.
				//
				// Aside from proximity, we also check to see if the target and any
				// of its ancestors were the ones that blocked a click. This is necessary
				// because of the strange mouse/click target calculation done in the
				// Android 2.1 browser, where if you click on an element, and there is a
				// mouse/click handler on one of its ancestors, the target will be the
				// innermost child of the touched element, even if that child is no where
				// near the point of touch.
				ele = target;

				while (ele) {
					for (i = 0; i < cnt; i++) {
						o = clickBlockList[i];
						touchID = 0;

						if ((ele === target && Math.abs(o.x - x) < threshold && Math.abs(o.y - y) < threshold) || $.data(ele, touchTargetPropertyName) === o.touchID) {
							// XXX: We may want to consider removing matches from the block list
							//      instead of waiting for the reset timer to fire.
							e.preventDefault();
							e.stopPropagation();
							return;
						}
					}
					ele = ele.parentNode;
				}
			}
		},
		true);
	}
})(jQuery, window, document);
/*
* jQuery Mobile Framework : events
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function($, window, undefined) {

	// add new event shortcuts
	$.each(("touchstart touchmove touchend orientationchange throttledresize " + "tap taphold swipe swipeleft swiperight scrollstart scrollstop").split(" "), function(i, name) {

		$.fn[name] = function(fn) {
			return fn ? this.bind(name, fn) : this.trigger(name);
		};

		$.attrFn[name] = true;
	});

	var supportTouch = $.support.touch,
		scrollEvent = "touchmove scroll",
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
	touchStopEvent = supportTouch ? "touchend" : "mouseup",
	touchMoveEvent = supportTouch ? "touchmove" : "mousemove";



	function triggerCustomEvent(obj, eventType, event) {
		var originalType = event.type;
		event.type = eventType;
		$.event.handle.call(obj, event);
		event.type = originalType;
	}

	// also handles scrollstop
	$.event.special.scrollstart = {

		enabled: true,

		setup: function() {

			var thisObject = this,
				$this = $(thisObject),
				scrolling, timer;



			function trigger(event, state) {
				scrolling = state;
				triggerCustomEvent(thisObject, scrolling ? "scrollstart" : "scrollstop", event);
			}

			// iPhone triggers scroll after a small delay; use touchmove instead
			$this.bind(scrollEvent, function(event) {

				if (!$.event.special.scrollstart.enabled) {
					return;
				}

				if (!scrolling) {
					trigger(event, true);
				}

				clearTimeout(timer);
				timer = setTimeout(function() {
					trigger(event, false);
				},
				50);
			});
		}
	};

	// also handles taphold
	$.event.special.tap = {
		setup: function() {
			var thisObject = this,
				$this = $(thisObject);

			$this.bind("vmousedown", function(event) {

				if (event.which && event.which !== 1) {
					return false;
				}

				var origTarget = event.target,
					origEvent = event.originalEvent,
					timer;



				function clearTapTimer() {
					clearTimeout(timer);
				}



				function clearTapHandlers() {
					clearTapTimer();

					$this.unbind("vclick", clickHandler).unbind("vmouseup", clearTapTimer).unbind("vmousecancel", clearTapHandlers);
				}



				function clickHandler(event) {
					clearTapHandlers();

					// ONLY trigger a 'tap' event if the start target is
					// the same as the stop target.
					if (origTarget == event.target) {
						triggerCustomEvent(thisObject, "tap", event);
					}
				}

				$this.bind("vmousecancel", clearTapHandlers).bind("vmouseup", clearTapTimer).bind("vclick", clickHandler);

				timer = setTimeout(function() {
					triggerCustomEvent(thisObject, "taphold", $.Event("taphold"));
				},
				750);
			});
		}
	};

	// also handles swipeleft, swiperight
	$.event.special.swipe = {
		scrollSupressionThreshold: 10,
		// More than this horizontal displacement, and we will suppress scrolling.
		durationThreshold: 1000,
		// More time than this, and it isn't a swipe.
		horizontalDistanceThreshold: 30,
		// Swipe horizontal displacement must be more than this.
		verticalDistanceThreshold: 75,
		// Swipe vertical displacement must be less than this.
		setup: function() {
			var thisObject = this,
				$this = $(thisObject);

			$this.bind(touchStartEvent, function(event) {
				var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event,
				start = {
					time: (new Date()).getTime(),
					coords: [data.pageX, data.pageY],
					origin: $(event.target)
				},
				stop;



				function moveHandler(event) {

					if (!start) {
						return;
					}

					var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event;

					stop = {
						time: (new Date()).getTime(),
						coords: [data.pageX, data.pageY]
					};

					// prevent scrolling
					if (Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.scrollSupressionThreshold) {
						event.preventDefault();
					}
				}

				$this.bind(touchMoveEvent, moveHandler).one(touchStopEvent, function(event) {
					$this.unbind(touchMoveEvent, moveHandler);

					if (start && stop) {
						if (stop.time - start.time < $.event.special.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.verticalDistanceThreshold) {

							start.origin.trigger("swipe").trigger(start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight");
						}
					}
					start = stop = undefined;
				});
			});
		}
	};

	(function($, window) {
		// "Cowboy" Ben Alman
		var win = $(window),
			special_event, get_orientation, last_orientation;

		$.event.special.orientationchange = special_event = {
			setup: function() {
				// If the event is supported natively, return false so that jQuery
				// will bind to the event using DOM methods.
				if ($.support.orientation) {
					return false;
				}

				// Get the current orientation to avoid initial double-triggering.
				last_orientation = get_orientation();

				// Because the orientationchange event doesn't exist, simulate the
				// event by testing window dimensions on resize.
				win.bind("throttledresize", handler);
			},
			teardown: function() {
				// If the event is not supported natively, return false so that
				// jQuery will unbind the event using DOM methods.
				if ($.support.orientation) {
					return false;
				}

				// Because the orientationchange event doesn't exist, unbind the
				// resize event handler.
				win.unbind("throttledresize", handler);
			},
			add: function(handleObj) {
				// Save a reference to the bound event handler.
				var old_handler = handleObj.handler;

				handleObj.handler = function(event) {
					// Modify event object, adding the .orientation property.
					event.orientation = get_orientation();

					// Call the originally-bound event handler and return its result.
					return old_handler.apply(this, arguments);
				};
			}
		};

		// If the event is not supported natively, this handler will be bound to
		// the window resize event to simulate the orientationchange event.
		function handler() {
			// Get the current orientation.
			var orientation = get_orientation();

			if (orientation !== last_orientation) {
				// The orientation has changed, so trigger the orientationchange event.
				last_orientation = orientation;
				win.trigger("orientationchange");
			}
		};

		// Get the current page orientation. This method is exposed publicly, should it
		// be needed, as jQuery.event.special.orientationchange.orientation()
		$.event.special.orientationchange.orientation = get_orientation = function() {
			var elem = document.documentElement;
			return elem && elem.clientWidth / elem.clientHeight < 1.1 ? "portrait" : "landscape";
		};

	})(jQuery, window);

	// throttled resize event
	(function() {

		$.event.special.throttledresize = {
			setup: function() {
				$(this).bind("resize", handler);
			},
			teardown: function() {
				$(this).unbind("resize", handler);
			}
		};

		var throttle = 250,
			handler = function() {
			curr = (new Date()).getTime();
			diff = curr - lastCall;

			if (diff >= throttle) {

				lastCall = curr;
				$(this).trigger("throttledresize");

			} else {

				if (heldCall) {
					clearTimeout(heldCall);
				}

				// Promise a held call will still execute
				heldCall = setTimeout(handler, throttle - diff);
			}
		},
			lastCall = 0,
			heldCall, curr, diff;
	})();

	$.each({
		scrollstop: "scrollstart",
		taphold: "tap",
		swipeleft: "swipe",
		swiperight: "swipe"
	},
	function(event, sourceEvent) {

		$.event.special[event] = {
			setup: function() {
				$(this).bind(sourceEvent, $.noop);
			}
		};
	});

})(jQuery, this);
