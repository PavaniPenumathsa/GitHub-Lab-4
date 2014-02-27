var urlfilter = "";
var numberofProducts = 2;
var walmartProducts;

function searchforProducts() {
    $.when(GetWalmartData()).done(function (data) {
        walmartProducts = data.items;
        GetEbayData();
    });
}

function GetEbayData() {
    var product = myproduct.value;
    var url = "http://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=1.0.0";
    url += "&SECURITY-APPNAME=pavanipe-8b86-4665-b415-df5538660cfd";
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    url += "&callback=_cb_findItemsByKeywords";
    url += "&REST-PAYLOAD";
    url += "&keywords=" + product;;
    url += "&paginationInput.entriesPerPage=" + numberofProducts;
    url += urlfilter;

    // Submit the request 
    s = document.createElement('script'); // create script element
    s.src = url;

    document.body.appendChild(s);
}

function GetWalmartData() {
    return $.ajax({
        type: 'GET',
        url: 'http://api.walmartlabs.com/v1/search?apiKey=cc8w66uejaan8ybpfqvr9a2f&lsPublisherId=pavanipenumathsa&query=' + myproduct.value + '&format=json',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp'
    });
}


function _cb_findItemsByKeywords(root) {
    var ebayProducts = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];

    //clear local storage
    if (localStorage.getItem("dbEbayProducts") != null) {
        localStorage.clear("dbEbayProducts");
    }
    if (localStorage.getItem("dbWalmartProducts") != null) {
        localStorage.clear("dbWalmartProducts");
    }

    localStorage.clear("dbEbayCart");
    localStorage.clear("dbWalmartCart");

    // save to local storage
    localStorage.setItem("dbEbayProducts", JSON.stringify(ebayProducts));
    localStorage.setItem("dbWalmartProducts", JSON.stringify(walmartProducts));

    var html = createEbayHTML(ebayProducts, 0);
    html.push(createWalmartHTML(walmartProducts, 0));
    //var newitems = JSON.parse(localStorage.getItem("dbebayProducts"));
    //var html = createEbayHTML(newitems);
    document.getElementById("results").innerHTML = html.join("");
}

function createEbayHTML(items, c) {
    var html = [];
    html.push('<table width="100%" border="1" cellspacing="0" cellpadding="3"><tbody>');
    for (var i = 0; i < items.length; ++i) {
        var item = items[i];
        var itemId = item.itemId;
        var title = item.title;
        var currentPrice = item.sellingStatus[0].currentPrice[0].__value__;
        var viewitem = item.viewItemURL;
        if (null != title && null != viewitem) {
            html.push('<tr><td><b>E</b></td>' +
                '<td><label id="' + viewitem + '">' + title + '</label></td>' +
                '<td><label>' + currentPrice + '</label></td>');
            if (c == 0) {
                html.push('<td><button onclick = "addToEbayCart(this.id)" id="b' + i + '">' + "Add" + '</button></td></tr>');
            } else {
                html.push('</tr>');
            }
        }
    }
    html.push('</tbody></table>');
    return html;
}

function createWalmartHTML(items, c) {
    var html = [];
    html.push('<table width="100%" border="1" cellspacing="0" cellpadding="3"><tbody>');

    var top = numberofProducts;
    if (items.length < 3) {
        top = items.length
    }

    for (var i = 0; i < top; i++) {
        var item = items[i];
        var itemId = item.itemId;
        var name = item.name;
        var salePrice = item.salePrice;
        var productUrl = item.productUrl;
        if (null != name && null != productUrl) {
            html.push('<tr><td><b>W</b></td>' +
                '<td><label id="' + productUrl + '">' + name + '</label></td>' +
                '<td><label>' + salePrice + '</label></td>');
            if (c == 0) {
                html.push('<td><button onclick = "addToWalmartCart(this.id)" id="b' + i + '">' + "Add" + '</button></td></tr>');
            } else {
                html.push('</tr>');
            }
        }
    }
    html.push('</tbody></table>');
    return html;
}

function addToEbayCart(thisID) {
    var varmycart = new Array();
    if (localStorage.getItem("dbEbayCart") != null) {
        varmycart = JSON.parse(localStorage.getItem("dbEbayCart"));
    }
    varmycart.push(thisID);
    localStorage.setItem("dbEbayCart", JSON.stringify(varmycart));
}

function addToWalmartCart(thisID) {
    var varmycart = new Array();
    if (localStorage.getItem("dbWalmartCart") != null) {
        varmycart = JSON.parse(localStorage.getItem("dbWalmartCart"));
    }
    varmycart.push(thisID);
    localStorage.setItem("dbWalmartCart", JSON.stringify(varmycart));
}

$('#Cart').bind('pageshow', function () {
    loadCart();
});

function loadCart() {
    var items = new Array();
    var varmycart = new Array();
    var cartitems = new Array();
    var html = [];
    if (localStorage.getItem("dbEbayProducts") != null && localStorage.getItem("dbEbayCart") != null) {
        items = JSON.parse(localStorage.getItem("dbEbayProducts"));
        varmycart = JSON.parse(localStorage.getItem("dbEbayCart"));
        for (var i = 0; i < varmycart.length; ++i) {
            var id = varmycart[i].substring(1);
            cartitems.push(items[id]);
        }
        html = createEbayHTML(cartitems, 1);
    }
    items = new Array();
    varmycart = new Array();
    cartitems = new Array();
    if (localStorage.getItem("dbWalmartProducts") != null && localStorage.getItem("dbWalmartCart") != null) {
        items = JSON.parse(localStorage.getItem("dbWalmartProducts"));
        varmycart = JSON.parse(localStorage.getItem("dbWalmartCart"));
        for (var i = 0; i < varmycart.length; ++i) {
            var id = varmycart[i].substring(1);
            cartitems.push(items[id]);
        }
        html.push(createWalmartHTML(cartitems, 1));
    }

    if (html.length == 0) {
        document.getElementById("cartresults").innerHTML = "No Items in Cart";
    } else {
        document.getElementById("cartresults").innerHTML = html.join("");
    }

}

function ClearCart() {
    localStorage.clear("dbEbayCart");
    localStorage.clear("dbWalmartCart");
    loadCart();
}


var echo = function(dataPass) {
    $.ajax({
        type: "POST",
        url: "/echo/json/",
        data: dataPass,
        cache: false,
                success: function(json) {
            alert("ProductID=" + json.ProductId + "\nProductName=" + json.ProductName);
        }
    });
};

$('.list').live('click', function() {
    $.get("http://localhost/Service1.svc/data/56780", function(data) {
        var json = {
            json: JSON.stringify(data),
            delay: 1
        };
        echo(json);
    });
});

$('.list').live('click', function() {
    $.get("http://localhost:51013/WebService.asmx", function(data) {
        var json = {
            json: JSON.stringify(data),
            delay: 1
        };
        echo(json);
    });
});


