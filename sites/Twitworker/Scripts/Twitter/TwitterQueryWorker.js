/// <reference path="../jquery-1.4.1.js" />
/// <reference path="../jquery-1.4.1-vsdoc.js" />
/// <reference path="WebRequest.js" />

function RequestTwitter(queryString) {
    
    var request = new XMLHttpRequest();
    request.open('GET', '../../proxy.php?mode=native&url=http://search.twitter.com/search.json?q=' + queryString + '&result_type=mixed&count=5', false);
   // request.open('GET', 'proxy.aspx?uri=http://search.twitter.com/search.json?q=' + queryString + '&result_type=mixed&count=5', false);
    request.onreadystatechange = function (aEvt) {
        if (request.readyState == 4) {
            if (request.status == 200) {
                ReadResponse(request.responseText);
            }
        }
    };

    request.send(null);
}

function ReadResponse(data) {
    postMessage(data);
}

onmessage = function (event) {
    var query = event.data;

    RequestTwitter(query);
}