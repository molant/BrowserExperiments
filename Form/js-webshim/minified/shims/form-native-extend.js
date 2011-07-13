jQuery.webshims.register("form-extend",function(f,d,j,p,D,A){if(Modernizr.formvalidation){var k=d.inputTypes,v={};d.addInputType=function(a,e){k[a]=e};d.addValidityRule=function(a,e){v[a]=e};d.addValidityRule("typeMismatch",function(a,e,b,g){if(e==="")return false;g=g.typeMismatch;if(!("type"in b))b.type=(a[0].getAttribute("type")||"").toLowerCase();if(k[b.type]&&k[b.type].mismatch)g=k[b.type].mismatch(e,a);return g});var i=A.overrideMessages,w=!Modernizr.requiredSelect||!Modernizr.input.valueAsDate||
i,B=["customError","typeMismatch","rangeUnderflow","rangeOverflow","stepMismatch","tooLong","patternMismatch","valueMissing","valid"];j=i?["value","checked"]:["value"];var l=i?["textarea"]:[],q=function(a,e){if(a){var b=(a.getAttribute&&a.getAttribute("type")||a.type||"").toLowerCase();if(!i)if(!(!Modernizr.requiredSelect&&b=="select-one")&&!k[b])return;i&&!e&&b=="radio"&&a.name?f(p.getElementsByName(a.name)).each(function(){f.prop(this,"validity")}):f.prop(a,"validity")}},m={};["input","textarea",
"select"].forEach(function(a){var e=d.defineNodeNameProperty(a,"setCustomValidity",{prop:{value:function(b){b+="";e.prop._supvalue.call(this,b);Modernizr.validationmessage||d.data(this,"customvalidationMessage",b);if(w){d.data(this,"hasCustomError",!!b);q(this)}}}});m[a]=e.prop._supvalue});if(!Modernizr.input.valueAsNumber||i){j.push("min");j.push("max");j.push("step");l.push("input")}if(!Modernizr.requiredSelect||i){j.push("required");l.push("select")}if(w){var r;l.forEach(function(a){var e=d.defineNodeNameProperty(a,
"validity",{prop:{get:function(){if(!r){var b=this,g=e.prop._supget.call(this);if(!g)return g;var c={};B.forEach(function(h){c[h]=g[h]});if(!f.prop(b,"willValidate"))return c;r=true;var n=f(b),s={type:(b.getAttribute&&b.getAttribute("type")||"").toLowerCase(),nodeName:(b.nodeName||"").toLowerCase()},C=n.val(),x=!!d.data(b,"hasCustomError"),t;r=false;c.customError=x;if(c.valid&&c.customError)c.valid=false;else if(!c.valid){var y=true;f.each(c,function(h,o){if(o)return y=false});if(y)c.valid=true}f.each(v,
function(h,o){c[h]=o(n,C,s,c);if(c[h]&&(c.valid||!t)){m[a].call(b,d.createValidationMessage(b,h));c.valid=false;t=true}});if(c.valid){m[a].call(b,"");d.data(b,"hasCustomError",false)}else i&&!t&&!x&&f.each(c,function(h,o){if(h!=="valid"&&o){m[a].call(b,d.createValidationMessage(b,h));return false}});return c}},writeable:false}})});j.forEach(function(a){d.onNodeNamesPropertyModify(l,a,function(){q(this)})});if(p.addEventListener){var u;p.addEventListener("change",function(a){clearTimeout(u);q(a.target)},
true);p.addEventListener("input",function(a){clearTimeout(u);u=setTimeout(function(){q(a.target)},290)},true)}var z=l.join(",");d.addReady(function(a,e){f(z,a).add(e.filter(z)).each(function(){f.prop(this,"validity")})});i&&d.ready("DOM",function(){var a;f(document).bind("webshimLocalizationReady",function(){var e=d.activeLang()[0];if(a!=e){a=e;f("input, select, textarea").each(function(){if(!d.data(this,"hasCustomError")){var b=this,g=f.prop(b,"validity"),c;if(!g.valid){c=(b.nodeName||"").toLowerCase();
f.each(g,function(n,s){if(n!=="valid"&&s){m[c].call(b,d.createValidationMessage(b,n));return false}})}}})}})})}}});