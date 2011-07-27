/**
* EaselJS
* Visit http://easeljs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011 Grant Skinner
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
**/
(function (l) { UID = function () { throw "UID cannot be instantiated"; }; UID._nextID = 0; UID.get = function () { return UID._nextID++ }; l.UID = UID })(window); (function (l) {
    Ticker = function () { throw "Ticker cannot be instantiated."; }; Ticker._listeners = []; Ticker._pauseable = []; Ticker._paused = false; Ticker._inited = false; Ticker._startTime = 0; Ticker._pausedTime = 0; Ticker._ticks = 0; Ticker._pausedTickers = 0; Ticker._interval = 50; Ticker._intervalID = null; Ticker._lastTime = 0; Ticker._times = []; Ticker.addListener = function (b, a) {
        if (!Ticker._inited) { Ticker._inited = true; Ticker._startTime = Ticker._getTime(); Ticker._times.push(0); Ticker.setInterval(Ticker._interval) } this.removeListener(b);
        Ticker._pauseable[Ticker._listeners.length] = a == null ? true : a; Ticker._listeners.push(b)
    }; Ticker.removeListener = function (b) { if (Ticker._listeners != null) { b = Ticker._listeners.indexOf(b); if (b != -1) { Ticker._listeners.splice(b, 1); Ticker._pauseable.splice(b, 1) } } }; Ticker.removeAllListeners = function () { Ticker._listeners = []; Ticker._pauseable = [] }; Ticker.setInterval = function (b) {
        Ticker._intervalID != null && clearInterval(Ticker._intervalID); Ticker._lastTime = Ticker.getTime(false); Ticker._interval = b; Ticker._intervalID = setInterval(Ticker._tick,
b)
    }; Ticker.getInterval = function () { return Ticker._interval }; Ticker.getFPS = function () { return 1E3 / Ticker._interval }; Ticker.setFPS = function (b) { Ticker.setInterval(1E3 / b) }; Ticker.getMeasuredFPS = function (b) { if (Ticker._times.length < 2) return -1; if (b == null) b = Ticker.getFPS() >> 1; b = Math.min(Ticker._times.length - 1, b); return 1E3 / ((Ticker._times[0] - Ticker._times[b]) / b) }; Ticker.setPaused = function (b) { Ticker._paused = b }; Ticker.getPaused = function () { return Ticker._paused }; Ticker.getTime = function (b) {
        return Ticker._getTime() -
Ticker._startTime - (b ? Ticker._pausedTime : 0)
    }; Ticker.getTicks = function (b) { return Ticker._ticks - (b ? Ticker._pausedTickers : 0) }; Ticker._tick = function () { Ticker._ticks++; var b = Ticker.getTime(false), a = b - Ticker._lastTime, c = Ticker._paused; if (c) { Ticker._pausedTickers++; Ticker._pausedTime += a } Ticker._lastTime = b; for (var d = Ticker._pauseable, e = Ticker._listeners.slice(), f = e ? e.length : 0, g = 0; g < f; g++) { var h = d[g], i = e[g]; i == null || c && h || i.tick == null || i.tick(a) } Ticker._times.unshift(b); Ticker._times.length > 100 && Ticker._times.pop() };
    Ticker._getTime = function () { return (new Date).getTime() }; l.Ticker = Ticker
})(window); (function (l) { MouseEvent = function (a, c, d) { this.initialize(a, c, d) }; var b = MouseEvent.prototype; b.stageX = 0; b.stageY = 0; b.type = null; b.nativeEvent = null; b.onMouseMove = null; b.onMouseUp = null; b.initialize = function (a, c, d) { this.type = a; this.stageX = c; this.stageY = d }; b.clone = function () { var a = new MouseEvent(this.type, this.stageX, this.stageY); a.nativeEvent = this.nativeEvent; return a }; b.toString = function () { return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]" }; l.MouseEvent = MouseEvent })(window); (function (l) {
    Matrix2D = function (a, c, d, e, f, g) { this.initialize(a, c, d, e, f, g) }; var b = Matrix2D.prototype; Matrix2D.identity = null; Matrix2D.DEG_TO_RAD = Math.PI / 180; b.a = 1; b.b = 0; b.c = 0; b.d = 1; b.tx = 0; b.ty = 0; b.alpha = 1; b.shadow = null; b.compositeOperation = null; b.initialize = function (a, c, d, e, f, g) { if (a != null) this.a = a; if (c != null) this.b = c; if (d != null) this.c = d; if (e != null) this.d = e; if (f != null) this.tx = f; if (g != null) this.ty = g }; b.prepend = function (a, c, d, e, f, g) {
        var h = this.tx; if (a != 1 || c != 0 || d != 0 || e != 1) {
            var i = this.a, j = this.c; this.a =
i * a + this.b * d; this.b = i * c + this.b * e; this.c = j * a + this.d * d; this.d = j * c + this.d * e
        } this.tx = h * a + this.ty * d + f; this.ty = h * c + this.ty * e + g
    }; b.append = function (a, c, d, e, f, g) { var h = this.a, i = this.b, j = this.c, k = this.d; this.a = a * h + c * j; this.b = a * i + c * k; this.c = d * h + e * j; this.d = d * i + e * k; this.tx = f * h + g * j + this.tx; this.ty = f * i + g * k + this.ty }; b.prependMatrix = function (a) { this.prepend(a.a, a.b, a.c, a.d, a.tx, a.ty); this.prependProperties(a.alpha, a.shadow, a.compositeOperation) }; b.appendMatrix = function (a) {
        this.append(a.a, a.b, a.c, a.d, a.tx, a.ty); this.appendProperties(a.alpha,
a.shadow, a.compositeOperation)
    }; b.prependTransform = function (a, c, d, e, f, g, h, i, j) { if (f % 360) { var k = f * Matrix2D.DEG_TO_RAD; f = Math.cos(k); k = Math.sin(k) } else { f = 1; k = 0 } if (i || j) { this.tx -= i; this.ty -= j } if (g || h) { g *= Matrix2D.DEG_TO_RAD; h *= Matrix2D.DEG_TO_RAD; this.prepend(f * d, k * d, -k * e, f * e, 0, 0); this.prepend(Math.cos(h), Math.sin(h), -Math.sin(g), Math.cos(g), a, c) } else this.prepend(f * d, k * d, -k * e, f * e, a, c) }; b.appendTransform = function (a, c, d, e, f, g, h, i, j) {
        if (f % 360) { var k = f * Matrix2D.DEG_TO_RAD; f = Math.cos(k); k = Math.sin(k) } else {
            f =
1; k = 0
        } if (g || h) { g *= Matrix2D.DEG_TO_RAD; h *= Matrix2D.DEG_TO_RAD; this.append(Math.cos(h), Math.sin(h), -Math.sin(g), Math.cos(g), a, c); this.append(f * d, k * d, -k * e, f * e, 0, 0) } else this.append(f * d, k * d, -k * e, f * e, a, c); if (i || j) { this.tx -= i * this.a + j * this.c; this.ty -= i * this.b + j * this.d } 
    }; b.rotate = function (a) { var c = Math.cos(a); a = Math.sin(a); var d = this.a, e = this.c, f = this.tx; this.a = d * c - this.b * a; this.b = d * a + this.b * c; this.c = e * c - this.d * a; this.d = e * a + this.d * c; this.tx = f * c - this.ty * a; this.ty = f * a + this.ty * c }; b.skew = function (a, c) {
        a *= Matrix2D.DEG_TO_RAD;
        c *= Matrix2D.DEG_TO_RAD; this.append(Math.cos(c), Math.sin(c), -Math.sin(a), Math.cos(a), 0, 0)
    }; b.scale = function (a, c) { this.a *= a; this.d *= c; this.tx *= a; this.ty *= c }; b.translate = function (a, c) { this.tx += a; this.ty += c }; b.identity = function () { this.alpha = this.a = this.d = 1; this.b = this.c = this.tx = this.ty = 0; this.shadow = this.compositeOperation = null }; b.invert = function () {
        var a = this.a, c = this.b, d = this.c, e = this.d, f = this.tx, g = a * e - c * d; this.a = e / g; this.b = -c / g; this.c = -d / g; this.d = a / g; this.tx = (d * this.ty - e * f) / g; this.ty = -(a * this.ty - c *
f) / g
    }; b.decompose = function (a) { if (a == null) a = {}; a.x = this.tx; a.y = this.ty; a.scaleX = Math.sqrt(this.a * this.a + this.b * this.b); a.scaleY = Math.sqrt(this.c * this.c + this.d * this.d); var c = Math.atan2(-this.c, this.d), d = Math.atan2(this.b, this.a); if (c == d) { a.rotation = d / Matrix2D.DEG_TO_RAD; if (this.a < 0 && this.d >= 0) a.rotation += a.rotation <= 0 ? 180 : -180; a.skewX = a.skewY = 0 } else { a.skewX = c / Matrix2D.DEG_TO_RAD; a.skewY = d / Matrix2D.DEG_TO_RAD } return a }; b.appendProperties = function (a, c, d) {
        this.alpha *= a; this.shadow = c || this.shadow; this.compositeOperation =
d || this.compositeOperation
    }; b.prependProperties = function (a, c, d) { this.alpha *= a; this.shadow = this.shadow || c; this.compositeOperation = this.compositeOperation || d }; b.clone = function () { var a = new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty); a.shadow = this.shadow; a.alpha = this.alpha; a.compositeOperation = this.compositeOperation; return a }; b.toString = function () { return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]" }; Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0,
0); l.Matrix2D = Matrix2D
})(window); (function (l) { Point = function (a, c) { this.initialize(a, c) }; var b = Point.prototype; b.x = 0; b.y = 0; b.initialize = function (a, c) { this.x = a == null ? 0 : a; this.y = c == null ? 0 : c }; b.clone = function () { return new Point(this.x, this.y) }; b.toString = function () { return "[Point (x=" + this.x + " y=" + this.y + ")]" }; l.Point = Point })(window); (function (l) { Rectangle = function (a, c, d, e) { this.initialize(a, c, d, e) }; var b = Rectangle.prototype; b.x = 0; b.y = 0; b.width = 0; b.height = 0; b.initialize = function (a, c, d, e) { this.x = a == null ? 0 : a; this.y = c == null ? 0 : c; this.width = d == null ? 0 : d; this.height = e == null ? 0 : e }; b.clone = function () { return new Rectangle(this.x, this.y, this.width, this.height) }; b.toString = function () { return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]" }; l.Rectangle = Rectangle })(window); (function (l) { Shadow = function (a, c, d, e) { this.initialize(a, c, d, e) }; var b = Shadow.prototype; Shadow.identity = null; b.color = null; b.offsetX = 0; b.offsetY = 0; b.blur = 0; b.initialize = function (a, c, d, e) { this.color = a; this.offsetX = c; this.offsetY = d; this.blur = e }; b.toString = function () { return "[Shadow]" }; b.clone = function () { return new Shadow(this.color, this.offsetX, this.offsetY, this.blur) }; Shadow.identity = new Shadow(null, 0, 0, 0); l.Shadow = Shadow })(window); (function (l) {
    SpriteSheet = function (a, c, d, e) { this.initialize(a, c, d, e) }; var b = SpriteSheet.prototype; b.image = null; b.frameWidth = 0; b.frameHeight = 0; b.frameData = null; b.loop = true; b.totalFrames = 0; b.initialize = function (a, c, d, e) { this.image = a; this.frameWidth = c; this.frameHeight = d; this.frameData = e }; b.toString = function () { return "[SpriteSheet]" }; b.clone = function () { var a = new SpriteSheet(this.image, this.frameWidth, this.frameHeight, this.frameData); a.loop = this.loop; a.totalFrames = this.totalFrames; return a }; l.SpriteSheet =
SpriteSheet
})(window); (function (l) {
    function b(c, d) { this.f = c; this.params = d } b.prototype.exec = function (c) { this.f.apply(c, this.params) }; Graphics = function (c) { this.initialize(c) }; var a = Graphics.prototype; Graphics.getRGB = function (c, d, e, f) { if (c != null && e == null) { f = d; e = c & 255; d = c >> 8 & 255; c = c >> 16 & 255 } return f == null ? "rgb(" + c + "," + d + "," + e + ")" : "rgba(" + c + "," + d + "," + e + "," + f + ")" }; Graphics.getHSL = function (c, d, e, f) { return f == null ? "hsl(" + c % 360 + "," + d + "%," + e + "%)" : "hsla(" + c % 360 + "," + d + "%," + e + "%," + f + ")" }; Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
    Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"]; Graphics._ctx = document.createElement("canvas").getContext("2d"); Graphics.beginCmd = new b(Graphics._ctx.beginPath, []); Graphics.fillCmd = new b(Graphics._ctx.fill, []); Graphics.strokeCmd = new b(Graphics._ctx.stroke, []); a._strokeInstructions = null; a._strokeStyleInstructions = null; a._fillInstructions = null; a._instructions = null; a._oldInstructions = null; a._activeInstructions = null; a._active = false; a._dirty = false; a._minX = NaN; a._minY = NaN; a._maxX = NaN; a._maxY = NaN; a._boundsQueue =
null; a._x = 0; a._y = 0; a.initialize = function (c) { this.clear(); this._ctx = Graphics._ctx; with (this) eval(c) }; a.draw = function (c) { this._dirty && this._updateInstructions(); for (var d = this._instructions, e = 0, f = d.length; e < f; e++) d[e].exec(c) }; a.getBounds = function () { this._boundsQueue.length && this._updateBounds(); return isNaN(this._minX) ? null : new Rectangle(this._minX, this._minY, this._maxX - this._minX, this._maxY - this._minY) }; a.moveTo = function (c, d) {
    this._activeInstructions.push(new b(this._ctx.moveTo, [c, d])); this._x = c;
    this._y = d; return this
}; a.lineTo = function (c, d) { this._dirty = this._active = true; this._activeInstructions.push(new b(this._ctx.lineTo, [c, d])); this._extendBounds(this._x, this._y); this._extendBounds(c, d); this._x = c; this._y = d; return this }; a.arcTo = function (c, d, e, f, g) { this._dirty = this._active = true; this._activeInstructions.push(new b(this._ctx.arcTo, [c, d, e, f, g])); return this }; a.arc = function (c, d, e, f, g, h) {
    this._dirty = this._active = true; if (h == null) h = false; this._activeInstructions.push(new b(this._ctx.arc, [c, d, e,
f, g, h])); return this
}; a.quadraticCurveTo = function (c, d, e, f) { this._dirty = this._active = true; this._activeInstructions.push(new b(this._ctx.quadraticCurveTo, [c, d, e, f])); return this }; a.bezierCurveTo = function (c, d, e, f, g, h) { this._dirty = this._active = true; this._activeInstructions.push(new b(this._ctx.bezierCurveTo, [c, d, e, f, g, h])); this._boundsQueue.push(new b(this._bezierCurveToBounds, [_x, _y, c, d, e, f, g, h])); return this }; a.rect = function (c, d, e, f) {
    this._dirty = this._active = true; this._activeInstructions.push(new b(this._ctx.rect,
[c, d, e - 1, f])); this._extendBounds(c, d); this._extendBounds(c + e, d + f); return this
}; a.closePath = function () { if (this._active) { this._dirty = true; this._activeInstructions.push(new b(this._ctx.closePath, [])) } return this }; a.clear = function () { this._instructions = []; this._oldInstructions = []; this._activeInstructions = []; this._strokeStyleInstructions = this._strokeInstructions = this._fillInstructions = null; this._active = this._dirty = false; this._boundsQueue = []; this._minX = this._minY = this._maxX = this._maxY = NaN; return this }; a.beginFill =
function (c) { this._active && this._newPath(); this._fillInstructions = c ? [new b(this._setProp, ["fillStyle", c])] : null; return this }; a.beginLinearGradientFill = function (c, d, e, f, g, h) { this._active && this._newPath(); e = this._ctx.createLinearGradient(e, f, g, h); f = 0; for (g = c.length; f < g; f++) e.addColorStop(d[f], c[f]); this._fillInstructions = [new b(this._setProp, ["fillStyle", e])]; return this }; a.beginRadialGradientFill = function (c, d, e, f, g, h, i, j) {
    this._active && this._newPath(); e = this._ctx.createRadialGradient(e, f, g, h, i, j); f =
0; for (g = c.length; f < g; f++) e.addColorStop(d[f], c[f]); this._fillInstructions = [new b(this._setProp, ["fillStyle", e])]; return this
}; a.beginBitmapFill = function (c, d) { this._active && this._newPath(); var e = this._ctx.createPattern(c, d || ""); this._fillInstructions = [new b(this._setProp, ["fillStyle", e])]; return this }; a.endFill = function () { this.beginFill(null); return this }; a.setStrokeStyle = function (c, d, e, f) {
    this._active && this._newPath(); this._strokeStyleInstructions = [new b(this._setProp, ["lineWidth", c == null ? "1" : c]),
new b(this._setProp, ["lineCap", d == null ? "butt" : isNaN(d) ? d : Graphics.STROKE_CAPS_MAP[d]]), new b(this._setProp, ["lineJoin", e == null ? "miter" : isNaN(e) ? e : Graphics.STROKE_JOINTS_MAP[e]]), new b(this._setProp, ["miterLimit", f == null ? "10" : f])]; return this
}; a.beginStroke = function (c) { this._active && this._newPath(); this._strokeInstructions = c ? [new b(this._setProp, ["strokeStyle", c])] : null; return this }; a.beginLinearGradientStroke = function (c, d, e, f, g, h) {
    this._active && this._newPath(); e = this._ctx.createLinearGradient(e, f,
g, h); f = 0; for (g = c.length; f < g; f++) e.addColorStop(d[f], c[f]); this._strokeInstructions = [new b(this._setProp, ["strokeStyle", e])]; return this
}; a.beginRadialGradientStroke = function (c, d, e, f, g, h, i, j) { this._active && this._newPath(); e = this._ctx.createRadialGradient(e, f, g, h, i, j); f = 0; for (g = c.length; f < g; f++) e.addColorStop(d[f], c[f]); this._strokeInstructions = [new b(this._setProp, ["strokeStyle", e])]; return this }; a.beginBitmapStroke = function (c, d) {
    this._active && this._newPath(); var e = this._ctx.createPattern(c, d || "");
    this._strokeInstructions = [new b(this._setProp, ["strokeStyle", e])]; return this
}; a.endStroke = function () { this.beginStroke(null); return this }; a.curveTo = a.quadraticCurveTo; a.drawRect = a.rect; a.drawRoundRect = function (c, d, e, f, g) { this.drawRoundRectComplex(c, d, e, f, g, g, g, g); return this }; a.drawRoundRectComplex = function (c, d, e, f, g, h, i, j) {
    this._dirty = this._active = true; this._activeInstructions.push(new b(this._ctx.moveTo, [c + g, d]), new b(this._ctx.lineTo, [c + e - h, d]), new b(this._ctx.arc, [c + e - h, d + h, h, -Math.PI / 2, 0, false]),
new b(this._ctx.lineTo, [c + e, d + f - i]), new b(this._ctx.arc, [c + e - i, d + f - i, i, 0, Math.PI / 2, false]), new b(this._ctx.lineTo, [c + j, d + f]), new b(this._ctx.arc, [c + j, d + f - j, j, Math.PI / 2, Math.PI, false]), new b(this._ctx.lineTo, [c, d + g]), new b(this._ctx.arc, [c + g, d + g, g, Math.PI, Math.PI * 3 / 2, false])); return this
}; a.drawCircle = function (c, d, e) { this.arc(c, d, e, 0, Math.PI * 2); return this }; a.drawEllipse = function (c, d, e, f) {
    this._dirty = this._active = true; var g = e / 2 * 0.5522848, h = f / 2 * 0.5522848, i = c + e, j = d + f; e = c + e / 2; f = d + f / 2; this._activeInstructions.push(new b(this._ctx.moveTo,
[c, f]), new b(this._ctx.bezierCurveTo, [c, f - h, e - g, d, e, d]), new b(this._ctx.bezierCurveTo, [e + g, d, i, f - h, i, f]), new b(this._ctx.bezierCurveTo, [i, f + h, e + g, j, e, j]), new b(this._ctx.bezierCurveTo, [e - g, j, c, f + h, c, f])); return this
}; a.drawPolyStar = function (c, d, e, f, g, h) {
    this._dirty = this._active = true; if (g == null) g = 0; g = 1 - g; if (h == null) h = 0; else h /= 180 / Math.PI; var i = Math.PI / f; this._activeInstructions.push(new b(this._ctx.moveTo, [c + Math.cos(h) * e, d + Math.sin(h) * e])); for (var j = 0; j < f; j++) {
        h += i; g != 1 && this._activeInstructions.push(new b(this._ctx.lineTo,
[c + Math.cos(h) * e * g, d + Math.sin(h) * e * g])); h += i; this._activeInstructions.push(new b(this._ctx.lineTo, [c + Math.cos(h) * e, d + Math.sin(h) * e]))
    } return this
}; a.clone = function () {
    var c = new Graphics; c._instructions = this._instructions.slice(); c._activeInstructions = this._activeInstructions.slice(); c._oldInstructions = this._oldInstructions.slice(); if (this._fillInstructions) c._fillInstructions = this._fillInstructions.slice(); if (this._strokeInstructions) c._strokeInstructions = this._strokeInstructions.slice(); if (this._strokeStyleInstructions) c._strokeStyleInstructions =
this._strokeStyleInstructions.slice(); c._active = this._active; c._dirty = this._dirty; return c
}; a.toString = function () { return "[Graphics]" }; a.mt = a.moveTo; a.lt = a.lineTo; a.at = a.arcTo; a.bt = a.bezierCurveTo; a.qt = a.quadraticCurveTo; a.a = a.arc; a.r = a.rect; a.cp = a.closePath; a.c = a.clear; a.f = a.beginFill; a.lf = a.beginLinearGradientFill; a.rf = a.beginRadialGradientFill; a.bf = a.beginBitmapFill; a.ef = a.endFill; a.ss = a.setStrokeStyle; a.s = a.beginStroke; a.ls = a.beginLinearGradientStroke; a.rs = a.beginRadialGradientStroke; a.bs = a.beginBitmapStroke;
    a.es = a.endStroke; a.dr = a.drawRect; a.rr = a.drawRoundRect; a.rc = a.drawRoundRectComplex; a.dc = a.drawCircle; a.de = a.drawEllipse; a.dp = a.drawPolyStar; a._updateInstructions = function () {
        this._instructions = this._oldInstructions.slice(); this._instructions.push(Graphics.beginCmd); this._fillInstructions && this._instructions.push.apply(this._instructions, this._fillInstructions); if (this._strokeInstructions) {
            this._instructions.push.apply(this._instructions, this._strokeInstructions); this._strokeStyleInstructions && this._instructions.push.apply(this._instructions,
this._strokeStyleInstructions)
        } this._instructions.push.apply(this._instructions, this._activeInstructions); this._fillInstructions && this._instructions.push(Graphics.fillCmd); this._strokeInstructions && this._instructions.push(Graphics.strokeCmd)
    }; a._newPath = function () { this._dirty && this._updateInstructions(); this._oldInstructions = this._instructions; this._activeInstructions = []; this._active = this._dirty = false }; a._setProp = function (c, d) { this[c] = d }; a._extendBounds = function (c, d) {
        if (isNaN(this._minX)) {
            this._minX =
this._maxX = c; this._minY = this._maxY = d
        } else { if (c < this._minX) this._minX = c; else if (c > this._maxX) this._maxX = c; if (d < this._minY) this._minY = d; else if (d > this._maxY) this._maxY = d } 
    }; a._updateBounds = function () { for (; boundsQueue.length; ) boundsQueue.pop().exec(this) }; a._bezierCurveToBounds = function (c, d, e, f, g, h, i, j) { this._extendBounds(c, d); this._extendBounds(i, j) }; l.Graphics = Graphics
})(window); (function (l) {
    DisplayObject = function () { this.initialize() }; var b = DisplayObject.prototype; DisplayObject.suppressCrossDomainErrors = false; DisplayObject._hitTestCanvas = document.createElement("canvas"); DisplayObject._hitTestCanvas.width = DisplayObject._hitTestCanvas.height = 1; DisplayObject._hitTestContext = DisplayObject._hitTestCanvas.getContext("2d"); DisplayObject._workingMatrix = new Matrix2D; b.alpha = 1; b.cacheCanvas = null; b.id = -1; b.mouseEnabled = true; b.name = null; b.parent = null; b.regX = 0; b.regY = 0; b.rotation = 0; b.scaleX =
1; b.scaleY = 1; b.skewX = 0; b.skewY = 0; b.shadow = null; b.visible = true; b.x = 0; b.y = 0; b.compositeOperation = null; b.snapToPixel = false; b.onPress = null; b.onClick = null; b.onDoubleClick = null; b.onMouseOver = null; b.onMouseOut = null; b.filters = null; b._cacheOffsetX = 0; b._cacheOffsetY = 0; b._cacheDraw = false; b._activeContext = null; b._restoreContext = false; b._revertShadow = false; b._revertX = 0; b._revertY = 0; b._revertAlpha = 1; b._minX = NaN; b._minY = NaN; b._maxX = NaN; b._maxY = NaN; b.initialize = function () { this.id = UID.get(); this.children = [] }; b.isVisible =
function () { return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 }; b.draw = function (a, c) { if (c || !this.cacheCanvas) return false; a.drawImage(this.cacheCanvas, this._cacheOffsetX, this._cacheOffsetY); return true }; b.cache = function (a, c, d, e) {
    if (this.cacheCanvas == null) this.cacheCanvas = document.createElement("canvas"); var f = this.cacheCanvas.getContext("2d"); this.cacheCanvas.width = d; this.cacheCanvas.height = e; f.setTransform(1, 0, 0, 1, 0, 0); f.clearRect(0, 0, d + 1, e + 1); this.draw(f, true, new Matrix2D(1, 0, 0, 1,
-a, -c)); this._cacheOffsetX = a; this._cacheOffsetY = c; this._applyFilters()
}; b.updateCache = function (a) { if (this.cacheCanvas == null) throw "cache() must be called before updateCache()"; var c = this.cacheCanvas.getContext("2d"); c.setTransform(1, 0, 0, 1, -this._cacheOffsetX, -this._cacheOffsetY); if (a) c.globalCompositeOperation = a; else c.clearRect(0, 0, this.cacheCanvas.width + 1, this.cacheCanvas.height + 1); this.draw(c, true); if (a) c.globalCompositeOperation = "source-over"; this._applyFilters() }; b.uncache = function () {
    this.cacheCanvas =
null; this._cacheOffsetX = this._cacheOffsetY = 0
}; b.getStage = function () { for (var a = this; a.parent; ) a = a.parent; if (a instanceof Stage) return a; return null }; b.localToGlobal = function (a, c) { var d = this.getConcatenatedMatrix(); if (d == null) return null; d.append(1, 0, 0, 1, a, c); return new Point(d.tx, d.ty) }; b.globalToLocal = function (a, c) { var d = this.getConcatenatedMatrix(); if (d == null) return null; d.invert(); d.append(1, 0, 0, 1, a, c); return new Point(d.tx, d.ty) }; b.localToLocal = function (a, c, d) {
    a = this.localToGlobal(a, c); return d.globalToLocal(a.x,
a.y)
}; b.setTransform = function (a, c, d, e, f, g, h, i, j) { this.x = a || 0; this.y = c || 0; this.scaleX = d == null ? 1 : d; this.scaleY = e == null ? 1 : e; this.rotation = f || 0; this.skewX = g || 0; this.skewY = h || 0; this.regX = i || 0; this.regY = j || 0 }; b.getConcatenatedMatrix = function (a) { if (a) a.identity(); else a = new Matrix2D; for (var c = this; c != null; ) { a.prependTransform(c.x, c.y, c.scaleX, c.scaleY, c.rotation, c.skewX, c.skewY, c.regX, c.regY); a.prependProperties(c.alpha, c.shadow, c.compositeOperation); c = c.parent } return a }; b.hitTest = function (a, c) {
    var d = DisplayObject._hitTestContext,
e = DisplayObject._hitTestCanvas; d.setTransform(1, 0, 0, 1, -a, -c); this.draw(d); d = this._testHit(d); e.width = 0; e.width = 1; return d
}; b.getBounds = function () { return this._cacheCanvas ? new Rectangle(-this._cacheOffsetX, -this._cacheOffsetY, this.cacheCanvas.width, this.cacheCanvas.height) : this._calculateBounds() }; b.clone = function () { var a = new DisplayObject; this.cloneProps(a); return a }; b.toString = function () { return "[DisplayObject (name=" + this.name + ")]" }; b.cloneProps = function (a) {
    a.alpha = this.alpha; a.name = this.name; a.regX =
this.regX; a.regY = this.regY; a.rotation = this.rotation; a.scaleX = this.scaleX; a.scaleY = this.scaleY; a.shadow = this.shadow; a.skewX = this.skewX; a.skewY = this.skewY; a.visible = this.visible; a.x = this.x; a.y = this.y; a.mouseEnabled = this.mouseEnabled; a.compositeOperation = this.compositeOperation
}; b.applyShadow = function (a, c) { c = c || Shadow.identity; a.shadowColor = c.color; a.shadowOffsetX = c.offsetX; a.shadowOffsetY = c.offsetY; a.shadowBlur = c.blur }; b._testHit = function (a) {
    try { var c = a.getImageData(0, 0, 1, 1).data[3] > 1 } catch (d) {
        if (!DisplayObject.suppressCrossDomainErrors) throw "An error has occured. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
    } return c
}; b._applyFilters = function () { if (!(!this.filters || this.filters.length == 0 || !this.cacheCanvas)) for (var a = this.filters.length, c = this.cacheCanvas.getContext("2d"), d = this.cacheCanvas.width, e = this.cacheCanvas.height, f = 0; f < a; f++) this.filters[f].applyFilter(c, 0, 0, d, e) }; b._calculateBounds = function () { return new Rectangle(0, 0, 0, 0) }; l.DisplayObject = DisplayObject
})(window); (function (l) {
    Container = function () { this.initialize() }; var b = Container.prototype = new DisplayObject; b.children = null; b.DisplayObject_initialize = b.initialize; b.initialize = function () { this.DisplayObject_initialize(); this.children = [] }; b.isVisible = function () { return this.visible && this.alpha > 0 && this.children.length && this.scaleX != 0 && this.scaleY != 0 }; b.DisplayObject_draw = b.draw; b.draw = function (a, c, d) {
        var e = Stage._snapToPixelEnabled; if (!d) { d = new Matrix2D; d.appendProperties(this.alpha, this.shadow, this.compositeOperation) } if (this.DisplayObject_draw(a,
c)) return true; c = this.children.length; for (var f = this.children.slice(0), g = 0; g < c; g++) {
            var h = f[g]; h.tick && h.tick(); if (h.isVisible()) {
                var i = false, j = d.clone(); j.appendTransform(h.x, h.y, h.scaleX, h.scaleY, h.rotation, h.skewX, h.skewY, h.regX, h.regY); j.appendProperties(h.alpha, h.shadow, h.compositeOperation); if (!(h instanceof Container && h.cacheCanvas == null)) {
                    e && h.snapToPixel && j.a == 1 && j.b == 0 && j.c == 0 && j.d == 1 ? a.setTransform(j.a, j.b, j.c, j.d, j.tx + 0.5 | 0, j.ty + 0.5 | 0) : a.setTransform(j.a, j.b, j.c, j.d, j.tx, j.ty); a.globalAlpha =
j.alpha; a.globalCompositeOperation = j.compositeOperation || "source-over"; if (i = j.shadow) this.applyShadow(a, i)
                } h.draw(a, false, j); i && this.applyShadow(a)
            } 
        } return true
    }; b.addChild = function (a) { var c = arguments.length; if (c > 1) { for (var d = 0; d < c; d++) this.addChild(arguments[d]); return arguments[c - 1] } a.parent && a.parent.removeChild(a); a.parent = this; this.children.push(a); return a }; b.addChildAt = function (a, c) {
        var d = arguments.length; if (d > 2) {
            c = arguments[e - 1]; for (var e = 0; e < d - 1; e++) this.addChildAt(arguments[e], c + e); return arguments[d -
2]
        } a.parent && a.parent.removeChild(a); a.parent = this; this.children.splice(c, 0, a); return a
    }; b.removeChild = function (a) { var c = arguments.length; if (c > 1) { for (var d = true, e = 0; e < c; e++) d = d && this.removeChild(arguments[e]); return d } return this.removeChildAt(this.children.indexOf(a)) }; b.removeChildAt = function (a) {
        var c = arguments.length; if (c > 1) { for (var d = [], e = 0; e < c; e++) d[e] = arguments[e]; d.sort(function (g, h) { return h - g }); var f = true; for (e = 0; e < c; e++) f = f && this.removeChildAt(d[e]); return f } if (a < 0 || a > this.children.length -
1) return false; c = this.children[a]; if (c != null) c.parent = null; this.children.splice(a, 1); return true
    }; b.removeAllChildren = function () { for (; this.children.length; ) this.removeChildAt(0) }; b.getChildAt = function (a) { return this.children[a] }; b.sortChildren = function (a) { this.children.sort(a) }; b.getChildIndex = function (a) { return this.children.indexOf(a) }; b.getNumChildren = function () { return this.children.length }; b.contains = function (a) { for (; a; ) { if (a == this) return true; a = a.parent } return false }; b.hitTest = function (a, c) {
        return this.getObjectUnderPoint(a,
c) != null
    }; b.getObjectsUnderPoint = function (a, c) { var d = [], e = this.localToGlobal(a, c); this._getObjectsUnderPoint(e.x, e.y, d); return d }; b.getObjectUnderPoint = function (a, c) { var d = this.localToGlobal(a, c); return this._getObjectsUnderPoint(d.x, d.y) }; b.clone = function (a) { var c = new Container; this.cloneProps(c); if (a) for (var d = c.children = [], e = 0, f = this.children.length; e < f; e++) d.push(this.children[e].clone(a)); return c }; b.toString = function () { return "[Container (name=" + this.name + ")]" }; b._getObjectsUnderPoint = function (a,
c, d, e) {
        var f = DisplayObject._hitTestContext, g = DisplayObject._hitTestCanvas, h = DisplayObject._workingMatrix, i = e & 1 && (this.onPress || this.onClick || this.onDoubleClick) || e & 2 && (this.onMouseOver || this.onMouseOut); if (this.cacheCanvas) { this.getConcatenatedMatrix(h); f.setTransform(h.a, h.b, h.c, h.d, h.tx - a, h.ty - c); f.globalAlpha = h.alpha; this.draw(f); if (this._testHit(f)) { g.width = 0; g.width = 1; if (i) return this } else return null } for (var j = this.children.length - 1; j >= 0; j--) {
            var k = this.children[j]; if (k.isVisible() && k.mouseEnabled) if (k instanceof
Container) if (i) { if (k = k._getObjectsUnderPoint(a, c)) return this } else { k = k._getObjectsUnderPoint(a, c, d, e); if (!d && k) return k } else if (!e || i || e & 1 && (k.onPress || k.onClick || k.onDoubleClick) || e & 2 && (k.onMouseOver || k.onMouseOut)) { k.getConcatenatedMatrix(h); f.setTransform(h.a, h.b, h.c, h.d, h.tx - a, h.ty - c); f.globalAlpha = h.alpha; k.draw(f); if (this._testHit(f)) { g.width = 0; g.width = 1; if (i) return this; else if (d) d.push(k); else return k } } 
        } return null
    }; b._calculateBounds = function () { }; l.Container = Container
})(window); (function (l) {
    Stage = function (a, c) { this.initialize(a, c) }; var b = Stage.prototype = new Container; Stage._snapToPixelEnabled = false; b.autoClear = true; b.canvas = null; b.mouseX = null; b.mouseY = null; b.onMouseMove = null; b.onMouseUp = null; b.onMouseDown = null; b.snapToPixelEnabled = false; b.mouseInBounds = false; b._tmpCanvas = null; b._activeMouseEvent = null; b._activeMouseTarget = null; b._mouseOverIntervalID = null; b._mouseOverX = 0; b._mouseOverY = 0; b._mouseOverTarget = null; b.Container_initialize = b.initialize; b.initialize = function (a, c) {
        this.Container_initialize();
        this.canvas = a; this.mouseChildren = true; var d = this; if (c) { a.addEventListener("touchstart", function (e) { d._handleTouchStart(e) }, false); document.addEventListener("touchend", function (e) { d._handleTouchEnd(e) }, false) } else {
            if (l.addEventListener) { l.addEventListener("mouseup", function (e) { d._handleMouseUp(e) }, false); l.addEventListener("mousemove", function (e) { d._handleMouseMove(e) }, false); l.addEventListener("dblclick", function (e) { d._handleDoubleClick(e) }, false) } else if (document.addEventListener) {
                document.addEventListener("mouseup",
function (e) { d._handleMouseUp(e) }, false); document.addEventListener("mousemove", function (e) { d._handleMouseMove(e) }, false); document.addEventListener("dblclick", function (e) { d._handleDoubleClick(e) }, false)
            } a.addEventListener("mousedown", function (e) { d._handleMouseDown(e) }, false)
        } 
    }; b.update = function () { if (this.canvas) { this.autoClear && this.clear(); Stage._snapToPixelEnabled = this.snapToPixelEnabled; this.draw(this.canvas.getContext("2d"), false, this.getConcatenatedMatrix(DisplayObject._workingMatrix)) } }; b.tick =
b.update; b.clear = function () { if (this.canvas) { var a = this.canvas.getContext("2d"); a.setTransform(1, 0, 0, 1, 0, 0); a.clearRect(0, 0, this.canvas.width, this.canvas.height) } }; b.toDataURL = function (a, c) {
    c || (c = "image/png"); var d = this.canvas.getContext("2d"), e = this.canvas.width, f = this.canvas.height, g; if (a) { g = d.getImageData(0, 0, e, f); var h = d.globalCompositeOperation; d.globalCompositeOperation = "destination-over"; d.fillStyle = a; d.fillRect(0, 0, e, f) } var i = this.canvas.toDataURL(c); if (a) {
        d.clearRect(0, 0, e, f); d.putImageData(g,
0, 0); d.globalCompositeOperation = h
    } return i
}; b.enableMouseOver = function (a) { if (this._mouseOverIntervalID) { clearInterval(this._mouseOverIntervalID); this._mouseOverIntervalID = null } if (!(a <= 0)) { var c = this; this._mouseOverIntervalID = setInterval(function () { c._testMouseOver() }, 1E3 / Math.min(50, a)); this._mouseOverX = NaN; this._mouseOverTarget = null } }; b.clone = function () { var a = new Stage(null); this.cloneProps(a); return a }; b.toString = function () { return "[Stage (name=" + this.name + ")]" }; b._primaryTouchId = -1; b._handleTouchMoveListener =
null; b._handleTouchStart = function (a) { a.preventDefault(); a = a.changedTouches; if (this._primaryTouchId == -1) { if (!this._handleTouchMoveListener) { var c = this; this._handleTouchMoveListener = function (d) { c._handleTouchMove(d) } } document.addEventListener("touchmove", this._handleTouchMoveListener, false); a = a[0]; this._primaryTouchId = a.identifier; this._updateMousePosition(a.pageX, a.pageY); this._handleMouseDown(a) } }; b._handleTouchMove = function (a) { (a = this._findPrimaryTouch(a.changedTouches)) && this._handleMouseMove(a) };
    b._handleTouchEnd = function (a) { if (a = this._findPrimaryTouch(a.changedTouches)) { this._handleMouseUp(a); this._primaryTouchId = -1; document.removeEventListener("touchmove", this._handleTouchMoveListener) } }; b._findPrimaryTouch = function (a) { for (var c = a.length, d, e = 0; e < c; e++) { d = a[e]; if (d.identifier == this._primaryTouchId) return d } return null }; b._handleMouseMove = function (a) {
        if (this.canvas) {
            if (!a) a = l.event; var c = this.mouseInBounds; this._updateMousePosition(a.pageX, a.pageY); if (c || this.mouseInBounds) {
                c = new MouseEvent("onMouseMove",
this.mouseX, this.mouseY); c.nativeEvent = a; if (this.onMouseMove) this.onMouseMove(c); if (this._activeMouseEvent && this._activeMouseEvent.onMouseMove) this._activeMouseEvent.onMouseMove(c)
            } 
        } else this.mouseX = this.mouseY = null
    }; b._updateMousePosition = function (a, c) { var d = this.canvas; do { a -= d.offsetLeft; c -= d.offsetTop } while (d = d.offsetParent); if (this.mouseInBounds = a >= 0 && c >= 0 && a < this.canvas.width && c < this.canvas.height) { this.mouseX = a; this.mouseY = c } }; b._handleMouseUp = function (a) {
        var c = new MouseEvent("onMouseUp", this.mouseX,
this.mouseY); c.nativeEvent = a; if (this.onMouseUp) this.onMouseUp(c); if (this._activeMouseEvent && this._activeMouseEvent.onMouseUp) this._activeMouseEvent.onMouseUp(c); if (this._activeMouseTarget && this._activeMouseTarget.onClick && this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true, this._mouseOverIntervalID ? 3 : 1) == this._activeMouseTarget) { c = new MouseEvent("onClick", this.mouseX, this.mouseY); c.nativeEvent = a; this._activeMouseTarget.onClick(c) } this._activeMouseEvent = this.activeMouseTarget = null
    }; b._handleMouseDown =
function (a) { var c; if (this.onMouseDown) { c = new MouseEvent("onMouseDown", this.mouseX, this.mouseY); c.nativeEvent = a; this.onMouseDown(c) } var d = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, this._mouseOverIntervalID ? 3 : 1); if (d) { if (d.onPress instanceof Function) { c = new MouseEvent("onPress", this.mouseX, this.mouseY); c.nativeEvent = a; d.onPress(c); if (c.onMouseMove || c.onMouseUp) this._activeMouseEvent = c } this._activeMouseTarget = d } }; b._testMouseOver = function () {
    if (!(this.mouseX == this._mouseOverX && this.mouseY ==
this._mouseOverY && this.mouseInBounds)) { var a = null; if (this.mouseInBounds) { a = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3); this._mouseOverX = this.mouseX; this._mouseOverY = this.mouseY } if (this._mouseOverTarget != a) { if (this._mouseOverTarget && this._mouseOverTarget.onMouseOut) this._mouseOverTarget.onMouseOut(new MouseEvent("onMouseOver", this.mouseX, this.mouseY)); if (a && a.onMouseOver) a.onMouseOver(new MouseEvent("onMouseOut", this.mouseX, this.mouseY)); this._mouseOverTarget = a } } 
}; b._handleDoubleClick =
function (a) { var c; if (this.onDoubleClick) { c = new MouseEvent("onDoubleClick", this.mouseX, this.mouseY); c.nativeEvent = a; this.onDoubleClick(c) } var d = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, this._mouseOverIntervalID ? 3 : 1); if (d) if (d.onDoubleClick instanceof Function) { c = new MouseEvent("onPress", this.mouseX, this.mouseY); c.nativeEvent = a; d.onDoubleClick(c) } }; l.Stage = Stage
})(window); (function (l) {
    Bitmap = function (a) { this.initialize(a) }; var b = Bitmap.prototype = new DisplayObject; b.image = null; b.snapToPixel = true; b.DisplayObject_initialize = b.initialize; b.initialize = function (a) { this.DisplayObject_initialize(); this.image = a }; b.isVisible = function () { return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.image && (this.image.complete || this.image.getContext) }; b.DisplayObject_draw = b.draw; b.draw = function (a, c) {
        if (this.DisplayObject_draw(a, c)) return true; a.drawImage(this.image, 0,
0); return true
    }; b.clone = function () { var a = new Bitmap(this.image); this.cloneProps(a); return a }; b.toString = function () { return "[Bitmap (name=" + this.name + ")]" }; b._calculateBounds = function () { return this.image && (this.image.complete || this.image.getContext) ? new Rectangle(0, 0, this.image.width, this.image.height) : new Rectangle(0, 0, 0, 0) }; l.Bitmap = Bitmap
})(window); (function (l) {
    BitmapSequence = function (a) { this.initialize(a) }; var b = BitmapSequence.prototype = new DisplayObject; b.callback = null; b.currentFrame = -1; b.currentSequence = null; b.currentEndFrame = null; b.currentStartFrame = null; b.nextSequence = null; b.paused = false; b.spriteSheet = null; b.snapToPixel = true; b.DisplayObject_initialize = b.initialize; b.initialize = function (a) { this.DisplayObject_initialize(); this.spriteSheet = a }; b.isVisible = function () {
        var a = this.spriteSheet ? this.spriteSheet.image : null; return this.visible && this.alpha >
0 && this.scaleX != 0 && this.scaleY != 0 && a && this.currentFrame >= 0 && (a.complete || a.getContext)
    }; b.DisplayObject_draw = b.draw; b.draw = function (a, c) {
        if (this.DisplayObject_draw(a, c)) return true; var d = this.spriteSheet.image, e = this.spriteSheet.frameWidth, f = this.spriteSheet.frameHeight, g = d.width / e | 0, h = d.height / f | 0; if (this.currentEndFrame != null) {
            if (this.currentFrame > this.currentEndFrame) {
                if (this.nextSequence) this._goto(this.nextSequence); else { this.paused = true; this.currentFrame = this.currentEndFrame } this.callback &&
this.callback(this)
            } 
        } else { h = this.spriteSheet.totalFrames || g * h; if (this.currentFrame >= h) { if (this.spriteSheet.loop) this.currentFrame = 0; else { this.currentFrame = h - 1; this.paused = true } this.callback && this.callback(this) } } this.currentFrame >= 0 && a.drawImage(d, e * (this.currentFrame % g), f * (this.currentFrame / g | 0), e, f, 0, 0, e, f); return true
    }; b.tick = function () { if (this.currentFrame == -1 && this.spriteSheet.frameData) this.paused = true; this.paused || this.currentFrame++ }; b.gotoAndPlay = function (a) { this.paused = false; this._goto(a) };
    b.gotoAndStop = function (a) { this.paused = true; this._goto(a) }; b.clone = function () { var a = new BitmapSequence(this.spriteSheet); this.cloneProps(a); return a }; b.toString = function () { return "[BitmapSequence (name=" + this.name + ")]" }; b.DisplayObject_cloneProps = b.cloneProps; b.cloneProps = function (a) {
        this.DisplayObject_cloneProps(a); a.callback = this.callback; a.currentFrame = this.currentFrame; a.currentStartFrame = this.currentStartFrame; a.currentEndFrame = this.currentEndFrame; a.currentSequence = this.currentSequence; a.nextSequence =
this.nextSequence; a.paused = this.paused; a.frameData = this.frameData
    }; b._goto = function (a) {
        if (isNaN(a)) if (a == this.currentSequence) this.currentFrame = this.currentStartFrame; else {
            var c = this.spriteSheet.frameData[a]; if (c instanceof Array) {
                this.currentFrame = this.currentStartFrame = c[0]; this.currentSequence = a; this.currentEndFrame = c[1]; if (this.currentEndFrame == null) this.currentEndFrame = this.currentStartFrame; if (this.currentEndFrame == null) this.currentEndFrame = this.currentFrame; this.nextSequence = c[2]; if (this.nextSequence ==
null) this.nextSequence = this.currentSequence; else if (this.nextSequence == false) this.nextSequence = null
            } else { this.currentSequence = this.nextSequence = null; this.currentEndFrame = this.currentFrame = this.currentStartFrame = c } 
        } else { this.currentSequence = this.nextSequence = this.currentEndFrame = null; this.currentStartFrame = 0; this.currentFrame = a } 
    }; b._calculateBounds = function () { return this.spriteSheet ? new Rectangle(0, 0, this.spriteSheet.frameWidth, this.spriteSheet.frameHeight) : new Rectangle(0, 0, 0, 0) }; l.BitmapSequence =
BitmapSequence
})(window); (function (l) {
    Shape = function (a) { this.initialize(a) }; var b = Shape.prototype = new DisplayObject; b.graphics = null; b.DisplayObject_initialize = b.initialize; b.initialize = function (a) { this.DisplayObject_initialize(); this.graphics = a ? a : new Graphics }; b.isVisible = function () { return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.graphics }; b.DisplayObject_draw = b.draw; b.draw = function (a, c) { if (this.DisplayObject_draw(a, c)) return true; this.graphics.draw(a); return true }; b.clone = function (a) {
        a = new Shape(a &&
this.graphics ? this.graphics.clone() : this.graphics); this.cloneProps(a); return a
    }; b.toString = function () { return "[Shape (name=" + this.name + ")]" }; b._calculateBounds = function () { return this.graphics ? this.graphics.getBounds() : new Rectangle(0, 0, 0, 0) }; l.Shape = Shape
})(window); (function (l) {
    Text = function (a, c, d) { this.initialize(a, c, d) }; var b = Text.prototype = new DisplayObject; Text._workingContext = document.createElement("canvas").getContext("2d"); b.text = ""; b.font = null; b.color = null; b.textAlign = null; b.textBaseline = null; b.maxWidth = null; b.outline = false; b.lineHeight = null; b.lineWidth = null; b.DisplayObject_initialize = b.initialize; b.initialize = function (a, c, d) { this.DisplayObject_initialize(); this.text = a; this.font = c; this.color = d ? d : "#000" }; b.isVisible = function () {
        return Boolean(this.visible &&
this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.text != null && this.text != "")
    }; b.DisplayObject_draw = b.draw; b.draw = function (a, c) {
        if (this.DisplayObject_draw(a, c)) return true; if (this.outline) a.strokeStyle = this.color; else a.fillStyle = this.color; a.font = this.font; a.textAlign = this.textAlign ? this.textAlign : "start"; a.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic"; for (var d = String(this.text).split(/(?:\r\n|\r|\n)/), e = this.lineHeight == null ? this.getMeasuredLineHeight() : this.lineHeight, f = 0, g = 0,
h = d.length; g < h; g++) { var i = a.measureText(d[g]).width; if (this.lineWidth == null || i < this.lineWidth) this._drawTextLine(a, d[g], f); else { i = d[g].split(/(\s)/); for (var j = i[0], k = 1, m = i.length; k < m; k += 2) if (a.measureText(j + i[k] + i[k + 1]).width > this.lineWidth) { this._drawTextLine(a, j, f); f += e; j = i[k + 1] } else j += i[k] + i[k + 1]; this._drawTextLine(a, j, f) } f += e } return true
    }; b.getMeasuredWidth = function () { return this._getWorkingContext().measureText(this.text).width }; b.getMeasuredLineHeight = function () {
        return this._getWorkingContext().measureText("M").width *
1.2
    }; b.clone = function () { var a = new Text(this.text, this.font, this.color); this.cloneProps(a); return a }; b.toString = function () { return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]" }; b.DisplayObject_cloneProps = b.cloneProps; b.cloneProps = function (a) { this.DisplayObject_cloneProps(a); a.textAlign = this.textAlign; a.textBaseline = this.textBaseline; a.maxWidth = this.maxWidth; a.outline = this.outline; a.lineHeight = this.lineHeight; a.lineWidth = this.lineWidth }; b._getWorkingContext = function () {
        var a =
Text._workingContext; a.font = this.font; a.textAlign = this.textAlign ? this.textAlign : "start"; a.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic"; return a
    }; b._drawTextLine = function (a, c, d) { this.outline ? a.strokeText(c, 0, d, this.maxWidth) : a.fillText(c, 0, d, this.maxWidth) }; b._calculateBounds = function () { }; l.Text = Text
})(window); (function (l) {
    SpriteSheetUtils = function () { throw "SpriteSheetUtils cannot be instantiated"; }; SpriteSheetUtils._workingCanvas = document.createElement("canvas"); SpriteSheetUtils._workingContext = SpriteSheetUtils._workingCanvas.getContext("2d"); SpriteSheetUtils.flip = function (b, a) {
        var c = b.image, d = b.frameData, e = b.frameWidth, f = b.frameHeight, g = c.width / e | 0, h = c.height / f | 0, i = g * h, j = {}, k, m; for (m in d) { k = d[m]; if (k instanceof Array) k = k.slice(0); j[m] = k } var q = [], o = 0, n = 0; for (m in a) {
            k = a[m]; k = d[k[0]]; if (k != null) {
                if (k instanceof
Array) { var r = k[0], p = k[1]; if (p == null) p = r } else r = p = k; q[n] = m; q[n + 1] = r; q[n + 2] = p; o += p - r + 1; n += 4
            } 
        } d = SpriteSheetUtils._workingCanvas; d.width = c.width; d.height = Math.ceil(h + o / g) * f; o = SpriteSheetUtils._workingContext; o.drawImage(c, 0, 0, g * e, h * f, 0, 0, g * e, h * f); h = i - 1; for (n = 0; n < q.length; n += 4) {
            m = q[n]; r = q[n + 1]; p = q[n + 2]; k = a[m]; i = k[1] ? -1 : 1; for (var t = k[2] ? -1 : 1, u = i == -1 ? e : 0, v = t == -1 ? f : 0, s = r; s <= p; s++) { h++; o.save(); o.translate(h % g * e + u, (h / g | 0) * f + v); o.scale(i, t); o.drawImage(c, s % g * e, (s / g | 0) * f, e, f, 0, 0, e, f); o.restore() } j[m] = [h - (p -
r), h, k[3]]
        } c = new Image; c.src = d.toDataURL("image/png"); return new SpriteSheet(c.width > 0 ? c : d, e, f, j)
    }; SpriteSheetUtils.frameDataToString = function (b) { var a = "", c = 0, d = 0, e = 0, f, g; for (g in b) { e++; f = b[g]; if (f instanceof Array) { var h = f[0], i = f[1]; if (i == null) i = h; f = f[2]; if (f == null) f = g } else { h = i = f; f = g } a += "\n\t" + g + ", start=" + h + ", end=" + i + ", next=" + f; if (f == false) a += " (stop)"; else if (f == g) a += " (loop)"; if (i > c) c = i; if (h < d) d = h } return e + " sequences, min=" + d + ", max=" + c + a }; SpriteSheetUtils.extractFrame = function (b, a) {
        var c =
b.image, d = b.frameWidth, e = b.frameHeight, f = c.width / d | 0; if (isNaN(a)) { var g = b.frameData[a]; a = g instanceof Array ? g[0] : g } g = SpriteSheetUtils._workingCanvas; g.width = d; g.height = e; SpriteSheetUtils._workingContext.drawImage(c, a % f * d, (a / f | 0) * e, d, e, 0, 0, d, e); c = new Image; c.src = g.toDataURL("image/png"); return c
    }; l.SpriteSheetUtils = SpriteSheetUtils
})(window);