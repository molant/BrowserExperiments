
function Init() {

    GetDataAsync();

}

function GetDataAsync() {

    $.ajax({
        type: "GET",
        url: "data/data.xml",
        dataType: "xml",
        success: function (data) {
            ParseData($(data));
        }
    });
}

function ParseData(xmlData) {

    //Create empty object
    var tempItem = new Object();

    //loop through xml		
    xmlData.find('item').each(function () {

        var temp = $(this);
        tempItem.id = temp.attr('id');
        tempItem.name = temp.find('name').text();
        tempItem.category = temp.find('category').text();
        tempItem.url = temp.find('url').text();
        tempItem.placeHolder = "images/loader.gif";
        tempItem.isLoaded = false;
        BuildDomItem(tempItem);

        return true;
    });

    ContentLoader.Init($("#list"));
}

function BuildDomItem(dataItem) {

    var domItem = $('<div id="item_' + dataItem.id + '" class="listItem"></div>').appendTo("#list");
    var imgContainer = $('<div class="imgContainer" />').appendTo(domItem);    
    $('<image class="placeholder" originalUrl="' + dataItem.url + '" />').attr('src', dataItem.placeHolder).appendTo(imgContainer);
    $('<h2 />').html(dataItem.name).appendTo(domItem);
    $('<h3  />').html(dataItem.category).appendTo(domItem);


}

