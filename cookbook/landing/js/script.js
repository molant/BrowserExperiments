function Init() {
    GetDataAsync();
    $('#pop1').hide();
    $('#pop2').hide();
    $('#pop3').hide();
    $('#pop4').hide();
    $('#pop5').hide();
    $('#pop6').hide();
    $('#pop7').hide();
    $('#pop8').hide();
    $('#icon1').mouseover(function () {
        var p = event.clientX;
        $('#pop1').css({
            left: p - 115
        }).delay(100).show();
    });
    $('#icon1').mouseout(function () {
        $('#pop1').hide();
    });
    $('#icon2').mouseover(function () {
        var p = event.clientX;
        $('#pop2').css({
            left: p - 115
        }).delay(100).show();
    });
    $('#icon2').mouseout(function () {
        $('#pop2').hide();
    });
    $('#icon3').mouseover(function () {
        var p = event.clientX;
        $('#pop3').css({
            left: p - 115
        }).delay(100).show();
    });
    $('#icon3').mouseout(function () {
        $('#pop3').hide();
    });
    $('#icon4').mouseover(function () {
        var p = event.clientX;
        $('#pop4').css({
            left: p - 115
        }).delay(100).show();
    });
    $('#icon4').mouseout(function () {
        $('#pop4').hide();
    });
    $('#icon5').mouseover(function () {
        var p = event.clientX;
        $('#pop5').css({
            left: p - 115
        }).delay(100).show();
    });
    $('#icon5').mouseout(function () {
        $('#pop5').hide();
    });
    $('#icon6').mouseover(function () {
        var p = event.clientX;
        $('#pop6').css({
            left: p - 115
        }).delay(100).show();
    });
    $('#icon6').mouseout(function () {
        $('#pop6').hide();
    });
    $('#icon7').mouseover(function () {
        var p = event.clientX;
        $('#pop7').css({
            left: p - 115
        }).delay(100).show();
    });
    $('#icon7').mouseout(function () {
        $('#pop7').hide();
    });
    $('#icon8').mouseover(function () {
        var p = event.clientX;
        $('#pop8').css({
            left: p - 115
        }).delay(100).show();
    });
    $('#icon8').mouseout(function () {
        $('#pop8').hide();
    });
}


function GetDataAsync() {
    $.ajax({
        type: "GET",
        url: "js/example.xml",
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
        tempItem.description = temp.find('description').text();
        tempItem.url = temp.find('url').text();
        tempItem.placeHolder = "images/loader.png";
        tempItem.isLoaded = false;
        tempItem.features = temp.find('feature');
        tempItem.links = temp.find('links').text();
        BuildDomItem(tempItem);
        return true;
    });
}

function BuildDomItem(dataItem) {
    var domItem = $('<div id="item_' + dataItem.id + '" class="listItem"></div>').appendTo("#list");
    var a = $('<a/>').attr('href', dataItem.links).css('text-decoration', 'none');
    $('<div class="example_id"/>').html(dataItem.name).appendTo(domItem).wrap(a);
    var imgContainer = $('<div class="imgContainer" />').appendTo(domItem);
    var imgFeature = $('<div class="imgFeature"/>').appendTo(domItem);
   
    $('<image class="imgContainer" />').attr('src', dataItem.url).appendTo(imgContainer).wrap(a);
    $('<div class="example_desc"/>').html(dataItem.description).appendTo(domItem);
    dataItem.features.each(function () {
   
   
        $('<image class="imgFeature"/>').attr('src', $(this).text()).appendTo(imgFeature);
    });
   
}