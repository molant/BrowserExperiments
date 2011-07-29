onmessage = function(event){
    var msg = event.data;
    postMessage("Hello, " + msg);
};