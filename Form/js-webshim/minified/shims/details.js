jQuery.webshims.register("details",function(a,g,l,m,n,h){var i=function(b){var c=a(b).parent("details");if(c[0]&&c.children(":first").get(0)===b)return c},j=function(b,c){b=a(b);c=a(c);var d=a.data(c[0],"summaryElement");a.data(b[0],"detailsElement",c);if(!d||b[0]!==d[0]){if(d)d.hasClass("fallback-summary")?d.remove():d.unbind(".summaryPolyfill").removeData("detailsElement").removeAttr("role").removeAttr("tabindex").removeAttr("aria-expanded").removeClass("summary-button").find("span.details-open-indicator").remove();
a.data(c[0],"summaryElement",b);c.prop("open",c.prop("open"))}};g.createElement("summary",function(){var b=i(this);if(!(!b||a.data(this,"detailsElement"))){var c;j(this,b);a(this).bind("focus.summaryPolyfill",function(){a(this).addClass("summary-has-focus")}).bind("blur.summaryPolyfill",function(){a(this).removeClass("summary-has-focus")}).bind("mouseenter.summaryPolyfill",function(){a(this).addClass("summary-has-hover")}).bind("mouseleave.summaryPolyfill",function(){a(this).removeClass("summary-has-hover")}).bind("click.summaryPolyfill",
function(d){var e=i(this);if(e){clearTimeout(c);c=setTimeout(function(){d.isDefaultPrevented()||e.attr("open",!e.attr("open"))},0)}}).bind("keydown.summaryPolyfill",function(d){if(d.keyCode==13||d.keyCode==32){var e=this;clearTimeout(c);c=setTimeout(function(){d.isDefaultPrevented()||a(e).trigger("click")},0)}}).attr({tabindex:"0",role:"button"}).prepend('<span class="details-open-indicator" />')}});var f;g.defineNodeNamesBooleanProperty("details","open",function(b){var c=a(a.data(this,"summaryElement"));
if(c){var d=b?"removeClass":"addClass",e=a(this);if(!f&&h.animate){e.stop().css({width:"",height:""});var k={width:e.width(),height:e.height()}}c.attr("aria-expanded",""+b);e[d]("closed-details-summary").children().not(c[0])[d]("closed-details-child");if(!f&&h.animate){b={width:e.width(),height:e.height()};e.css(k).animate(b,{complete:function(){a(this).css({width:"",height:""})}})}}});g.createElement("details",function(){f=true;var b=a.data(this,"summaryElement");if(!b){b=a("> summary:first-child",
this);if(b[0])j(b,this);else{a(this).prependWebshim('<summary class="fallback-summary">'+h.text+"</summary>");a.data(this,"summaryElement")}}a.prop(this,"open",a.prop(this,"open"));f=false})});
