/**
 * Passed to POSConnector.addEventListener for EventType.BarcodeScanned
 * @callback POSConnector~barcodeScannedListener
 * @param {string} barcode - The barcode that was scanned
 */
/**
 * Passed to POSConnector.addEventListener for EventType.
 * @callback POSConnector~deeplinkActivatedListener
 * @param {string} link - The link
 */

/**
 * Passed to the payBasket function
 * @callback POSConnector~payBasketCallback
 * @param {boolean} result - Whether or not the payment was completed
 * @param {string} [error] - Optional string describing what went wrong
 */

/**
 * Passed to the getLoginInformation function
 * @callback POSConnector~getLoginInformationCallback
 * @param {POSConnector.LoginInformation} [result] - The requested login information if successful
 * @param {string} [error] - The error that occurred if unsuccessful
 */

/**
 * Passed to the openURL function
 * @callback POSConnector~openURLCallback
 * @param {string} [error] - The error that occurred if unsuccessful
 */

/**
 * Passed to the printDocumentAtURL and printDocumentData functions
 * @callback POSConnector~printDocumentCallback
 * @param {boolean} result - Whether or not the printing job was completed
 * @param {string} [error] - The error that occurred if printing wasn't just cancelled by the user
 */

/**
 * Passed to the sendPOSConnectorObjectPathToPOS function
 * @callback POSConnector~sendPOSConnectorObjectPathToPOSCallback
 * @param {string} [error] - The error that occurred if unsuccessful
 */

/**
 * @class POSConnector
 * Allows for communication with the native POS application.
 */
var POSConnector = (function () {

    "use strict";

    var connector = {};
    var connectorObjectPath = "POSConnector";
    var callbackIdIndex = 0;
    var callbacksKeyedByIds = {};
    var listenerObjects = [];

    /**
     * Enum of possible message names
     * @private
     * @enum {string} MessageName
     */
    var MessageName = {
        GetLoginInformation: "GetLoginInformation",
        GetLoginInformationCallback: "GetLoginInformationCallback",
        PayBasket: "PayBasket",
        PayBasketCallback: "PayBasketCallback",
        BarcodeScanned: "BarcodeScanned",
        DeeplinkActivated: "DeeplinkActivated",
        OpenURL: "OpenURL",
        OpenURLCallback: "OpenURLCallback",
        PrintDocumentAtURL: "PrintDocumentAtURL",
        PrintDocumentWithData: "PrintDocumentWithData",
        PrintDocumentCallback: "PrintDocumentCallback",
        SendPOSConnectorObjectPathToPOS: "SendPOSConnectorObjectPathToPOS",
        SendPOSConnectorObjectPathToPOSCallback: "SendPOSConnectorObjectPathToPOSCallback"
    };

    /**
     * Enum of possible message body keys
     * @private
     * @enum {string} MessageBodyKey
     */
    var MessageBodyKey = {
        Result: "result",
        Error: "error",
        Basket: "basket",
        URL: "url",
        Data: "data",
        ObjectPath: "objectPath"
    };

    /**
     * A listener object with limited event types and callbacks
     * @private
     * @class POSConnector~Listener
     * @param {POSConnector~EventType} type - The event that the listener observes
     * @param listenerCallback - The callback function
     */
    function Listener(type, listenerCallback) {
        var listener = {};
        listener.type = type;
        listener.listenerCallback = listenerCallback;
        return listener;
    }

    /**
     * A message that can be passed back and forth between the POS and Javascript
     * @private
     * @class POSConnector~Message
     * @param {MessageName} name - Name of the message, identifying its type
     * @param {function | number} [callbackOrCallbackId] - The callback function or callback id
     * @param {Object} [body] - Message body
     */
    function Message(name, callbackOrCallbackId, body) {
        if (typeof callbackOrCallbackId === "function") {
            var callbackIdIndexForMessage = callbackIdIndex;
            callbacksKeyedByIds[callbackIdIndexForMessage] = callbackOrCallbackId;
            callbackIdIndex += 1;
            return new Message(name, callbackIdIndexForMessage, body);
        }
        var message = {};
        message.name = name;
        message.callbackId = callbackOrCallbackId;
        message.body = body;
        return message;
    }

    /**
     * Safely call callback function
     * @private
     * @function safelyCallCallback
     * @param {function} [callback] - The callback to (maybe) call
     * @param {Array} [callbackArguments] - The arguments for the callback
     */
    function safelyCallCallback(callback, callbackArguments) {
        if (typeof callback === "function") {
            callback.apply(undefined, callbackArguments);
        }
    }

    /**
     * Validate object path to POSConnector
     * @private
     * @function validatePOSConnectorObjectPath
     * @param {string} objectPath - Object path
     * @return {string | undefined} - Undefined if the provided object path is valid or a string with the error that occurred while validating
     */
    function validatePOSConnectorObjectPath(objectPath) {
        var objectPathComponents = objectPath.split(".");
        var nextComponent = window;
        var invalidComponentInPath = objectPathComponents.some(function (element) {
            if (!nextComponent.hasOwnProperty(element) || typeof nextComponent[element] !== "object") {
                return true;
            }
            nextComponent = nextComponent[element];
        });
        if (invalidComponentInPath) {
            return "Invalid component(s) in object path: " + objectPath;
        }
        if (typeof nextComponent.receiveMessage !== "function") {
            return "Invalid POSConnector object at the end of object path: " + objectPath;
        }
    }

    /**
     * Validate native connectivity and object path
     * @private
     * @function validateConnectivityAndPOSConnectorObjectPath
     * @param {string} objectPath - Object path
     * @return {string | undefined} - Undefined if all okay or a string with the error that occurred while validating
     */
    function validateConnectivityAndPOSConnectorObjectPath(objectPath) {
        if (!connector.isConnected()) {
            return "No connection is established from the native POS application";
        }

        var validationError = validatePOSConnectorObjectPath(objectPath);

        if (typeof validationError === "string") {
            return validationError;
        }
    }

    /**
     * Retrieves a callback by its id, deleting it from the callback array
     * @private
     * @function POSConnector~callbackByDeletingCallbackWithId
     * @param {number} callbackId - Callback Id
     * @return {POSConnector~getLoginInformationCallback | POSConnector~payBasketCallback | undefined} The callback
     */
    function callbackByDeletingCallbackWithId(callbackId) {
        if (typeof callbackId !== "number") {
            return;
        }
        var callback = callbacksKeyedByIds[callbackId];

        delete callbacksKeyedByIds[callbackId];

        return callback;
    }

    /**
     * Send a message to the POS application
     * @private
     * @function POSConnector~sendMessage
     * @param {Message} message - The message to send
     */
    function sendMessage(message) {
        window.webkit.messageHandlers.POS.postMessage(message);
    }

    /**
     * Common message reception handler for callbacks with {boolean} success and {string} [error] parameters
     * @private
     * @function POSConnector~handleCallbackMessageWithParametersSuccessAndOptionalError
     * @param {Message} message - The message in question
     */
    function handleCallbackMessageWithParametersResultAndError(message) {
        var callback = callbackByDeletingCallbackWithId(message.callbackId);
        var result = message.body.result;
        var error = message.body.error;

        safelyCallCallback(callback, [result, error]);
    }

    /**
     * Common message reception handler for callbacks with {string} [error] parameter
     * @private
     * @function POSConnector~handleCallbackMessageWithParameterOptionalError
     * @param {Message} message - The message in question
     */
    function handleCallbackMessageWithParameterError(message) {
        var callback = callbackByDeletingCallbackWithId(message.callbackId);
        var error = message.body.error;

        safelyCallCallback(callback, [error]);
    }

    /**
     * Handle reception of a message named BarcodeScanned
     * @private
     * @function POSConnector~handleBarcodeScannedMessage
     * @param {Message} message - The message in question
     */
    function handleBarcodeScannedMessage(message) {
        var barcode = message.body;

        listenerObjects.forEach(function (listenerObject) {
            if (listenerObject.type === connector.EventType.BarcodeScanned) {
                listenerObject.listenerCallback(barcode);
            }
        });
    }

    /**
     * Handle reception of a message named DeeplinkActivated
     * @private
     * @function POSConnector~handleBarcodeScannedMessage
     * @param {Message} message - The message in question
     */
     function handleDeeplinkActivatedMessage(message) {
          var data = message.body;

          listenerObjects.forEach(function (listenerObject) {
               if (listenerObject.type === connector.EventType.DeeplinkActivated) {
                    listenerObject.listenerCallback(data);
               }
          });
     }

    /**
     * Receive a message from the POS application. Never call this function.
     * @private
     * @function POSConnector.receiveMessage
     * @param {Message} message - The received message
     */
    connector.receiveMessage = function (message) {
        switch (message.name) {
        case MessageName.BarcodeScanned:
            handleBarcodeScannedMessage(message);
            break;
        case MessageName.DeeplinkActivated:
            handleDeeplinkActivatedMessage(message);
        break;
        case MessageName.GetLoginInformationCallback:
            handleCallbackMessageWithParametersResultAndError(message);
            break;
        case MessageName.PayBasketCallback:
            handleCallbackMessageWithParametersResultAndError(message);
            break;
        case MessageName.OpenURLCallback:
            handleCallbackMessageWithParameterError(message);
            break;
        case MessageName.PrintDocumentCallback:
            handleCallbackMessageWithParametersResultAndError(message);
            break;
        case MessageName.SendPOSConnectorObjectPathToPOSCallback:
            handleCallbackMessageWithParameterError(message);
            break;
        }
    };

    /**
     * Represents a line item
     * @class POSConnector.LineItem
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
     * @enum {string} TransactionType
     * @memberOf POSConnector
     */
    var TransactionType = {
        Cash: "Cash",
        DebitorAccount: "DebitorAccount",
        Ecommerce: "Ecommerce",
        External: "External",
        ExternalCard: "ExternalCard",
        ExternalGiftCard: "ExternalGiftCard",
        GiftCardVoucher: "GiftCardVoucher",
        Installment: "Installment",
        MobilePay: "MobilePay",
        Point: "Point"
    };
    connector.TransactionType = TransactionType;// Intentionally assign it to connector after variable initialization, to work around bug in jsdoc-to-markdown

    /**
     * Represents a payment transaction
     * @class POSConnector.Transaction
     * @param {POSConnector.TransactionType} transactionType - The type of payment transaction
     * @param {number} amount - Amount payed by the transaction
     */
    connector.Transaction = function (transactionType, amount) {
        var transaction = {};
        transaction.transactionType = transactionType;
        transaction.amount = amount;
        return transaction;
    };

    /**
     * Represents a discount on either a basket or a line item
     * @class POSConnector.Discount
     * @param {string} description - Reason for the discount to be given (shown on receipt)
     * @param {number} [amount] - Amount that the discount applies (eg. 90.50). Do not pass if passing percentage.
     * @param {number} [percentage] - The percentage which will be calculated based on what it's applied to (eg. 0.5). Do not pass if passing amount.
     */
    connector.Discount = function (description, amount, percentage) {
        var discount = {};
        discount.description = description;
        discount.amount = amount;
        discount.percentage = percentage;
        return discount;
    };

    /**
     * Represents a shopping basket
     * @class POSConnector.Basket
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
     * @class POSConnector.LoginInformation
     * @param {string} shopId - Shop's id
     * @param {string} shopName - Shop's name
     * @param {string} registerId - Register's id
     * @param {string} registerName - Register's name
     * @param {string} userId - User's id
     * @param {string} userName - User's name
     */
    connector.LoginInformation = function (shopId, shopName, registerId, registerName, userId, userName) {
        var loginInformation = {};
        loginInformation.shopId = shopId;
        loginInformation.shopName = shopName;
        loginInformation.registerId = registerId;
        loginInformation.registerName = registerName;
        loginInformation.userId = userId;
        loginInformation.userName = userName;
        return loginInformation;
    };

    /**
     * Enum of possible event types
     * @enum {string} POSConnector.EventType
     * @memberOf POSConnector
     */
    var EventType = {
        BarcodeScanned: "BarcodeScanned",
        DeeplinkActivated: "DeeplinkActivated"
    };

    connector.EventType = EventType; // Intentionally assign it to connector after variable initialization, to work around bug in jsdoc-to-markdown

    /**
     * Add an event listener
     * @function POSConnector.addEventListener
     * @param {POSConnector.EventType} type - The type of event to listen for
     * @param listener - The listener function to add
     */
    connector.addEventListener = function (type, listener) {
        listenerObjects.push(new Listener(type, listener));
    };

    /**
     * Remove an event listener
     * @function POSConnector.removeEventListener
     * @param {POSConnector~barcodeScannedListener} listener - The listener function to remove
     */
    connector.removeEventListener = function (listener) {
        listenerObjects.forEach(function (listenerObject, index) {
            if (listenerObject.listenerCallback === listener) {
                listenerObjects.splice(index, 1);
            }
        });
    };

    /**
    * Check for connection toward the POS
    * @function POSConnector.isConnected
    * @return {boolean} The connection status
    */
    connector.isConnected = function () {
        return typeof window.webkit === "object" && typeof window.webkit.messageHandlers === "object" && typeof window.webkit.messageHandlers.POS === "object";
    };

    /**
     * Pass a basket to the POS for payment processing
     * @function POSConnector.payBasket
     * @param {POSConnector.Basket} basket - Basket to pass on to the POS
     * @param {POSConnector~payBasketCallback} callback - Called when the operation concludes
     */
    connector.payBasket = function (basket, callback) {
        var validationError = validateConnectivityAndPOSConnectorObjectPath(connectorObjectPath);
        if (typeof validationError === "string") {
            safelyCallCallback(callback, [false, validationError]);
            return;
        }
        var messageBody = {};
        messageBody[MessageBodyKey.Basket] = basket;
        var message = new Message(MessageName.PayBasket, callback, messageBody);
        sendMessage(message);
    };

    /**
     * Get current login information from the native POS
     * @function POSConnector.getLoginInformation
     * @param {POSConnector~getLoginInformationCallback} callback - Called when the operation concludes
     */
    connector.getLoginInformation = function (callback) {
        var validationError = validateConnectivityAndPOSConnectorObjectPath(connectorObjectPath);
        if (typeof validationError === "string") {
            safelyCallCallback(callback, [null, validationError]);
            return;
        }
        var message = new Message(MessageName.GetLoginInformation, callback);
        sendMessage(message);
    };

    /**
     * Request opening of a URL from the native application. The URL will open in which ever application the device prefers, typically Safari.
     * @function POSConnector.openURL
     * @param {string} url - The URL to open
     * @param {POSConnector~openURLCallback} callback - Called when the native application opened or rejected opening the URL
     */
    connector.openURL = function (url, callback) {
        var validationError = validateConnectivityAndPOSConnectorObjectPath(connectorObjectPath);
        if (typeof validationError === "string") {
            safelyCallCallback(callback, [validationError]);
            return;
        }
        var messageBody = {};
        messageBody[MessageBodyKey.URL] = url;
        var message = new Message(MessageName.OpenURL, callback, messageBody);
        sendMessage(message);
    };

    /**
     * Request printing of a document located at a URL
     * @function POSConnector.printDocumentAtURL
     * @param {string} url - The URL pointing toward the document to print
     * @param {POSConnector~printDocumentCallback} callback - Called when the operation concludes
     */
    connector.printDocumentAtURL = function (url, callback) {
        var validationError = validateConnectivityAndPOSConnectorObjectPath(connectorObjectPath);
        if (typeof validationError === "string") {
            safelyCallCallback(callback, [false, validationError]);
            return;
        }
        var messageBody = {};
        messageBody[MessageBodyKey.URL] = url;
        var message = new Message(MessageName.PrintDocumentAtURL, callback, messageBody);
        sendMessage(message);
    };

    /**
     * Requests printing of a document with a data object
     * @function POSConnector.printDocumentWithData
     * @param {Blob|string} data - The document data either contained in a Blob object or a base64 string
     * @param {POSConnector~printDocumentCallback} [callback] - Called when the operation concludes
     */
    connector.printDocumentWithData = function (data, callback) {
        var validationError = validateConnectivityAndPOSConnectorObjectPath(connectorObjectPath);
        if (typeof validationError === "string") {
            safelyCallCallback(callback, [validationError]);
            return;
        }
        var sendData = function (base64String) {
            var messageBody = {};
            messageBody[MessageBodyKey.Data] = base64String;
            var message = new Message(MessageName.PrintDocumentWithData, callback, messageBody);
            sendMessage(message);
        };
        var dataType = typeof data;
        if (dataType !== "string" && dataType !== "object") {
            safelyCallCallback(callback, [false, "Data argument of invalid type: " + dataType]);
        }
        if (dataType === "string") {
            sendData(data);
            return;
        }
        var fileReader = new FileReader();
        fileReader.onload = function () {
            var dataAsURL = fileReader.result;
            var base64String = dataAsURL.substr(dataAsURL.indexOf(',') + 1);
            sendData(base64String);
        };
        fileReader.readAsDataURL(data);
    };

    /**
     * Send an object path for the POSConnector to the native POS application.
     * You'd do this if you're utilizing modules or similar and you don't want to depend
     * on having the POSConnector object with that specific variable name in the global scope.
     * @function POSConnector.sendPOSConnectorObjectPathToPOS
     * @param {string} objectPath - Path the the POSConnector object (ie. "Vendor.Wallmob.POSLink")
     * @param {POSConnector~sendPOSConnectorObjectPathToPOSCallback} [callback] - Called when the operation concludes.
     */
    connector.sendPOSConnectorObjectPathToPOS = function (objectPath, callback) {
        var validationError = validateConnectivityAndPOSConnectorObjectPath(objectPath);
        if (typeof validationError === "string") {
            safelyCallCallback(callback, [validationError]);
            return;
        }
        var outerCallback = function (error) {
            if (typeof error === "string") {
                safelyCallCallback(callback, [error]);
            }
            connectorObjectPath = objectPath;
            safelyCallCallback(callback);
        };
        var messageBody = {};

        messageBody[MessageBodyKey.ObjectPath] = objectPath;
        var message = new Message(MessageName.SendPOSConnectorObjectPathToPOS, outerCallback, messageBody);
        sendMessage(message);
    };

    return connector;

}());

if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = POSConnector;
}
