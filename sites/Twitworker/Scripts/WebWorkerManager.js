/// <reference path="jquery-1.4.1.js" />
/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="modernizr.custom.27281.js" />


var WebWorkerManager = function () {
    return this;
}

WebWorkerManager.prototype.errorMessage = function (callback) {
    this.errorHandler = callback;
}

WebWorkerManager.prototype.errorHandler = '';

WebWorkerManager.prototype.QueueWorkItem = function (code, messageCallback) {
    if (Modernizr.webworkers) {
        var worker = new Worker(code);
        if (this.errorHandler !== '') {
            worker.onerror = this.errorHandler;
        }
        worker.onmessage = function (event) {
            messageCallback(event);
        }
        return worker;
    }
    else {
        if (this.errorHandler != '') {
            this.errorHandler("this browser doen't support web workers");
        }
    }
}

WebWorkerManager.prototype.QueueShareWorker = function (code) {
    if (Modernizr.webworkers) {
        var shared = new SharedWorker(code);

    }
}