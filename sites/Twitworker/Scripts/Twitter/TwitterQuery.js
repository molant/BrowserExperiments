/// <reference path="../jquery-1.4.1-vsdoc.js" />
/// <reference path="../WebWorkerManager.js" />
/// <reference path="../jquery-1.4.1.js" />
/// <reference path="WebRequest.js" />



var TwitterQuery = function () {
    this.twitterStatistics = new WebWorkerManager();
    var local = this;
    this.worker = this.twitterStatistics.QueueWorkItem('Scripts/Twitter/TwitterStatisticsEngine.js', function (data) {
        local.statistics(data);
    });
    this.data = undefined;

    return this;
}

TwitterQuery.prototype.Search = function (searchQuery, callback) {
    var work = new WebWorkerManager();
    work.errorMessage(this.handleError);

    var worker = work.QueueWorkItem('Scripts/Twitter/TwitterQueryWorker.js', workerData);
    worker.postMessage(searchQuery);
    var local = this;
    function workerData(data) {
        callback(data);

        var twitterResult = JSON.parse(data.data);
        local.data = twitterResult;
        processTwitterResponse(twitterResult);
        local.worker.postMessage(data.data);
    }


    function processTwitterResponse(data) {
        if (local.isEnabled) {

            setTimeout(updateNextPage, 1000 * local.nextPageTimeout);
            setTimeout(updateSelftContent, 1000 * local.updataePageTimeout);
        }
    }

    function updateNextPage() {

        var data = local.data.next_page;
        local.startQuery(local.data);
        var next_page = new WebRequest();
        next_page.complete = onNextPageCompleted;
        next_page.create('proxy.php?mode=native&url=http://search.twitter.com/search.json' + escape(data));
    }

    function updateSelftContent(data) {
        var data = local.data.refresh_url;

        var next_page = new WebRequest();
        next_page.complete = onSelftRefreshUpdate;
        next_page.create('proxy.php?mode=native&url=http://search.twitter.com/search.json' + escape(data));
    }

    function onNextPageCompleted(data) {
        var result = { data: data };
        local.worker.postMessage(data);
        callback(result);
        local.endQuery(data);
        if (local.isEnabled) {
            setTimeout(updateNextPage, 1000 * local.nextPageTimeout);
        }

    }

    function onSelftRefreshUpdate(data) {
        var result = { data: data };
        local.worker.postMessage(data);
        callback(result);

        if (local.isEnabled) {
            setTimeout(updateSelftContent, 1000 * local.updataePageTimeout);
        }
    }
}

TwitterQuery.prototype.nextPageTimeout = 2;
TwitterQuery.prototype.updataePageTimeout = 2;

TwitterQuery.prototype.startQuery = function () { }
TwitterQuery.prototype.endQuery = function () { }

TwitterQuery.prototype.isEnabled = true;


TwitterQuery.prototype.statistics = function (data) { }

TwitterQuery.prototype.handleError = function (data) {

}
