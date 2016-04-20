var POSConnectorTests = (function () {

    "use_strict";

    if (POSConnector === undefined) {
        console.log("POSConnector is required for the example to run");
        return;
    }

    if (POSConnector.isConnected()) {
        console.log("Already connected");
    } else {
        POSConnector.addEventListener(POSConnector.EventType.ConnectionEstablished, function () {
            console.log("Connected By Event");
        });
    }

    var tests = {};

    tests.TestPayBasket = function () {
        var lineItem1 = new POSConnector.LineItem("Apple Lightning Cable", 2, 99.95, 0.25, 0);
        var lineItem2Discount = new POSConnector.Discount("VIP Discount", null, 0.1);
        var lineItem2 = new POSConnector.LineItem("Apple iPad Pro", 1, 4995, 0.25, 0, null, null, [lineItem2Discount]);
        var discount = new POSConnector.Discount("Member Campaign Discount", 100);
        var transaction = new POSConnector.Transaction(POSConnector.TransactionType.Installment, 4000);
        var dummyId = Math.random().toString();
        var basket = new POSConnector.Basket(dummyId, [lineItem1, lineItem2], [transaction], [discount]);
        POSConnector.payBasket(basket, function (result, error) {
            console.log("PayBasketCallback: " + result);
            console.log("ID: " + dummyId);
            if (error) {
                console.log("Error: " + error);
            }
        });
    };

    tests.TestGetLoginInformation = function () {
        POSConnector.getLoginInformation(function (result, error) {
            console.log("GetLoginInformationCallback");
            if (result) {
                console.log("Shop id: " + result.shopId);
                console.log("Shop name: " + result.shopName);
                console.log("Register id: " + result.registerId);
                console.log("Register name: " + result.registerName);
                console.log("User id: " + result.userId);
                console.log("User name: " + result.userName);
            }
            if (error) {
                console.log("Error: " + error);
            }
        });
    };

    tests.TestOpenURL = function (url) {
        POSConnector.openURL(url, function (error) {
            console.log("OpenURLCallback");
            if (error) {
                console.log("Error: " + error);
            }
        });
    };

    tests.TestPrintDocumentAtURL = function (url) {
        POSConnector.printDocumentAtURL(url, function (result, error) {
            console.log("PrintDocumentAtURLCallback: " + result);
            if (error) {
                console.log("Error: " + error);
            }
        });
    };

    tests.TestPrintDocumentWithData = function () {
        var request = new XMLHttpRequest();
        request.open("GET", "sample.pdf", true);
        request.responseType = "blob";
        request.onload = function () {
            var data = request.response;
            POSConnector.printDocumentWithData(data, function (result, error) {
                console.log("PrintDocumentWithDataCallback: " + result);
                if (error) {
                    console.log("Error: " + error);
                }
            });
        };
        request.send();
    };

    POSConnector.addEventListener(POSConnector.EventType.BarcodeScanned, function (barcode) {
        console.log("Barcode scanned: " + barcode);
    });

    POSConnector.addEventListener(POSConnector.EventType.ConnectionEstablished, function () {
        console.log("Connection established");
    });

    return tests;

}());
