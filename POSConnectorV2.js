/**
 * Passed to POSConnector.on for EventType.Connected
 * @callback POSConnector~connectedListener
 */

/**
 * Passed to POSConnector.on for EventType.BarcodeScanned
 * @callback POSConnector~barcodeScannedListener
 * @param {string} barcode - The barcode that was scanned
 */

/**
 * Passed to the payBasket function
 * @callback POSConnector~payBasketCallback
 * @param {boolean} success - Whether or not the payment was completed
 * @param {string} [error] - Optional string describing what went wrong
 */

/**
 * The POSConnector allows for communication with the native POS application.
 */
var POSConnector = (function () {

    "use strict";

    var connector = {};

    var callbackIdIndex;
    var callbacksKeyedByIds = {};
    var listenerObjects = [];

    var MessageName = {
        PayBasket: "PayBasket",
        PayBasketCallback: "PayBasketCallback"
    };

    var Error = {
        NotConnected: "No connection is established from the native POS application"
    };

    function Listener(type, listenerCallback) {
        var listener = {};
        listener.type = type;
        listener.listenerCallback = listenerCallback;
        return listener;
    }

    function Message(name, callbackOrCallbackId, body) {
        if (typeof callbackOrCallbackId === "function") {
            if (callbackIdIndex === undefined) {
                callbackIdIndex = 0;
            } else {
                callbackIdIndex += 1;
            }
            callbacksKeyedByIds[callbackIdIndex] = callbackOrCallbackId;
            return new Message(name, callbackIdIndex, body);
        }
        var message = {};
        message.name = name;
        message.callbackId = callbackOrCallbackId;
        message.body = body;
        return message;
    }

    function sendMessage(message) {
        window.webkit.messageHandlers.POS.postMessage(message);
    }

    /**
     * Represents a line item
     * @param {string} name - Name of the line item
     * @param {number} quantity - Number of items, positive or negative, represented on the line (eg. 5)
     * @param {number} unitPrice - The price of each item on the line (eg. 9.95)
     * @param {number} vatPercentage - The VAT included in the unit price (eg. 0.25)
     * @param {number} salesTaxPercentage - The sales tax to apply to the unit price (eg. 0.05)
     * @param {string} [productId] - Id of the product represented on the line
     * @param {string} [imei] - IMEI of the product represented on the line
     * @param {Discount[]} [discounts] - Discounts on the line item
     */
    connector.LineItem = function (name, quantity, unitPrice, vatPercentage, salesTaxPercentage, productId, imei, discounts) {
        var lineItem = {};
        lineItem.name = name;
        lineItem.quantity = quantity;
        lineItem.unitPrice = unitPrice;
        lineItem.vatPercentage = vatPercentage;
        lineItem.salesTaxPercentage = salesTaxPercentage;
        lineItem.productId = productId;
        lineItem.imei = imei;
        lineItem.discounts = discounts;
        return lineItem;
    };

    /**
     * Enum of possible transaction types
     * @readonly
     * @enum {string}
     */
    connector.TransactionType = {
        Cash: "Cash",
        Debitor: "Debitor",
        Ecommerce: "Ecommerce",
        External: "External",
        ExternalCard: "ExternalCard",
        ExternalGiftCard: "ExternalGiftCard",
        GiftCardVoucher: "GiftCardVoucher",
        Installment: "Installment",
        MobilePay: "MobilePay",
        Point: "Point"
    };

    /**
     * Represents a payment transaction
     * @param {TransactionType} type - The type of payment transaction
     * @param {number} amount - Amount payed by the transaction
     */
    connector.Transaction = function (type, amount) {
        var transaction = {};
        transaction.type = type;
        transaction.amount = amount;
        return transaction;
    };

    /**
     * Represents a discount on either a basket or a line item
     * @param {number} amount - Amount that the discount applies (eg. 90.50)
     * @param {string} description - Reason for the discount to be given (shown on receipt)
     * @param {number} [percentage] - Just for information, it won't affect the amount (eg. 0.5)
     */
    connector.Discount = function (amount, description, percentage) {
        var discount = {};
        discount.amount = amount;
        discount.description = description;
        discount.percentage = percentage;
        return discount;
    };

    /**
     * Represents a shopping basket
     * @param {string} id - Id of the basket
     * @param {LineItem[]} lineItems - Line items contained in the basket
     * @param {Transaction[]} [transactions] - Transactions on the basket
     * @param {Discount[]} [discounts] - Discounts on the basket
     */
    connector.Basket = function (id, lineItems, transactions, discounts) {
        var basket = {};
        basket.id = id;
        basket.lineItems = lineItems;
        basket.transactions = transactions;
        basket.discounts = discounts;
        return basket;
    };

    /**
     * Enum of possible event types
     * @readonly
     * @enum {string}
     */
    connector.EventType = {
        Connected: "Connected",
        BarcodeScanned: "BarcodeScanned"
    };

    /**
     * Add an event listener
     * @param {EventType} type - The type of event to listen for
     * @param {connectedListener | barcodeScannedListener} listener - The listener function to add
     */
    connector.on = function (type, listener) {
        var params = [type, listener];
        console.log("on: " + params.join(", "));
        listenerObjects.push(new Listener(type, listener));
    };

    /**
     * Remove an event listener
     * @param {connectedListener | barcodeScannedListener} listener - The listener function to remove
     */
    connector.removeEventListener = function (listener) {
        console.log("removeEventListener: " + listener);
        listenerObjects.forEach(function (listenerObject, index) {
            if (listenerObject.listenerCallback === listener) {
                listenerObjects.splice(index, 1);
            }
        });
    };

    /**
    * Check for connection toward the POS
    * @return {boolean} The connection status
    */
    connector.isConnected = function () {
        return window.webkit.messageHandlers.POS !== undefined;
    };

    /**
     * Pass a basket to the POS for payment processing
     * @param {Basket} basket - Basket to pass on to the POS
     * @param {payBasketCallback} callback - Called when the operation concluded
     */
    connector.payBasket = function (basket, callback) {
        var params = [basket, callback];
        console.log("payBasket: " + params.join(", "));
        if (!connector.isConnected()) {
            callback(false, Error.NotConnected);
            return;
        }
        var message = new Message(MessageName.PayBasket, callback, basket);
        sendMessage(message);
    };

    /**
     * Receive a message from the POS application. Never call this function.
     * @param {string} name - Name of the message
     * @param {string} [callbackId] - Id of the related callback
     * @param {Object} [body] - Body of the message
     */
    connector.receiveMessage = function (name, callbackId, body) {
        var params = [name, callbackId, body];
        console.log("receiveMessage: " + params.join(", "));
    };

    return connector;

}());
