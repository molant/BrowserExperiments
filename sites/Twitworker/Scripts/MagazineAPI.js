/// <reference path="../Scripts/jquery-1.4.1.js" />
/// <reference path="../Scripts/jquery-1.4.1-vsdoc.js" />


var MagazineAPI = function () {
    this.setupAjax();
    var host = this.getAbsolutePath();
    if (host != 'http://gamesbuild.plainconcepts.com:6106/') {
        this.baseAddress = 'http://gamesbuild.plainconcepts.com/Magazine/Services/Service.svc';
    }
    else {
        this.baseAddress = host + 'Services/Service.svc';
    }
    return this;
}

MagazineAPI.prototype.getAbsolutePath = function () {
    var loc = window.location;
    var result = loc.protocol + '//' + loc.host + '/';
    return result;
}

MagazineAPI.prototype.getUrl = function (service, operation) {
    return this.baseAddress + '/' + service + '/' + operation;
}

MagazineAPI.prototype.baseAddress = 'http://gamesbuild.plainconcepts.com:6106/Services/Service.svc';
MagazineAPI.prototype.authorizationToken = '';
MagazineAPI.prototype.setupAjax = function () {
    $.ajaxSetup({
        type: 'GET',
        dataType: 'json',
        local: this,
        beforeSend: function (xhr) {
            this.loading = true;
            if (this.local.authorizationToken) {
                xhr.setRequestHeader("authorization", this.local.authorizationToken);
            }
        },
        complete: function (event, XMLHttpRequest, ajaxOptions) {
            this.loading = false;
        },
        error: function (event, jqXHR, ajaxSettings, thrownError) {
            jQuery.error('Error requesting page' + ajaxSettings.url + ': ' + thrownError);
        }
    });
    //    jQuery.ajaxPrefilter(function (options, originalOptions) {
    //        if (options.crossDomain) {
    //            if (document.location.href.indexOf('cheezburger.loc') == -1) {
    //                options.url = 'http://webtest.plainconcepts.com/Cheezburger/app2/XmlProxy.aspx?uri=' + options.url;
    //            }
    //            else {
    //                options.url = './cheezburger_proxy.php?url=' + encodeURIComponent(options.url);
    //            }
    //            options.crossDomain = false;
    //        }
    //    });
};

MagazineAPI.prototype.processRequest = function (url, callback) {
    var xdr = this.getCrossDomainRequest();
    var local = this;
    if (!xdr) {
        jQuery.get(
            url,
            null,
            function (data, textStatus, jqXHR) {
                if (jqXHR) {
                    local.processLoginResponse(data, jqXHR);
                    callback(data);
                }
                else {
                    jQuery.error('getPhotos error: ' + textStatus);
                }
            }
            , 'json'
        );
    }
    else {
        xdr = new XDomainRequest();
        if (xdr) {
            xdr.onload = function () {
                var data = eval(xdr.responseText);
                local.processLoginResponse(data);
                callback(data);
            };
            xdr.
            xdr.open("get", url);
            xdr.send();
        }
    }
};

MagazineAPI.prototype.getUserFeeds = function (callback) {
    var url = this.getUrl('FeedService', 'GetFeedFromUser');
    this.processRequest(url, callback);
};

MagazineAPI.prototype.login = function (user, password, callback) {
    //mock up the login process
    this.authorizationToken = 'HSdN1Xhz32ZY6AhrwLkf41n6DMstO39VctzqqqZ0jr9bUZe6kKlVgVloYoe3uOPjJhAsAOdOohAoPURUtYf0yFRp9KvdbSuVCXeVvWhFDkU1jJEddKqLxhFkizrtyviZ0jItCamrD66N8CSGk7PpIB/xY+yupBLn';
//    this.authorizationToken = 'HSdN1Xhz32ZY6AhrwLkf41n6DMstO39VctzqqqZ0jr9bUZe6kKlVgVloYoe3uOPjJhAsAOdOohAoPURUtYf0yFRp9KvdbSuVCXeVvWhFDkU1jJEddKqLxhFkizrtyviZ0jItCamrD66N8CSGk7PpIB / xY + yupBLn';
    callback({});

//    var url = this.getUrl('UserService', 'LoginUser');
//    url += '?userName=' + user + '&password=' + password;
//    this.processRequest(url, callback);

}

MagazineAPI.prototype.getUserFeedItems = function (itemId, itemType, callback) {
    //public List<Item> GetItems(int sourceId, ItemType itemType)

    var url = this.getUrl('FeedService', 'GetItems');
    url += '?sourceId=' + itemId + '&itemType=' + itemType;
    this.processRequest(url, callback);
};

MagazineAPI.prototype.processLoginResponse = function (data, xhr) {
    if (data.Authorization) {
        this.authorizationToken = data.Authorization;
    }
    else {
        this.authorizationToken = xhr.getResponseHeader('Authorization');
    }
};

MagazineAPI.prototype.getCrossDomainRequest = function () {
    return false;
//    return jQuery.browser.msie && jQuery.browser.version >= 8;
};