var POSConnectorTests = (function () {

    var tests = {};

    if (POSConnector === undefined) {
        console.log("POSConnector is required for the example to run");
        return;
    }

    tests.TestPayBasketCallback = function (success, error) {
        var params = [success, error];
        console.log("TestPayBasketCallback: " + params.join(", "));
    };

    tests.TestPayBasket = function () {
        var lineItem1 = new POSConnector.LineItem("Apple Lightning Cable", 2, 99.95, 0.25, 0);
        var lineItem2Discount = new POSConnector.Discount(499.5, "VIP Discount", 0.1);
        var lineItem2 = new POSConnector.LineItem("Apple iPad Pro", 1, 4995, 0.25, 0, null, null, [lineItem2Discount]);
        var discount = new POSConnector.Discount(100, "Member Campaign Discount");
        var transaction = new POSConnector.Transaction(POSConnector.TransactionType.Installment, 4000);
        var dummyId = Math.random().toString();
        var basket = new POSConnector.Basket(dummyId, [lineItem1, lineItem2], [transaction], [discount]);
        POSConnector.payBasket(basket, example.TestPayBasketCallback);
    };

    return tests;

})();
