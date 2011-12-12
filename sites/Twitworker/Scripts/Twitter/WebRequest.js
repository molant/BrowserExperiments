var WebRequest = function () {
    return this;
};

WebRequest.prototype.create = function (uri) {
    var local = this;
    var request = new XMLHttpRequest();
    request.open('GET', uri + '&wait=500', false);
    request.onreadystatechange = function (aEvt) {
        if (request.readyState == 4) {
            if (request.status == 200) {
                local.complete(request.responseText);
            }
        }
    };

    request.send(null);
};

WebRequest.prototype.complete = function () { };