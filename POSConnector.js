var POSConnector, POSConnectorClass;

POSConnectorClass = (function() {

  /**
  	 * Class constructor invokes _connectWebViewJavascriptBridge
  	 * and exposes the bridge to the class instance
  	 * @return {}
   */
  function POSConnectorClass() {
    var _this;
    this._bridge = null;
    _this = this;
    this._connectWebViewJavascriptBridge(function(bridge) {
      _this._bridge = bridge;
      return _this._bridge.init(function(message, responseCallback) {});
    });
  }


  /**
  	 * Checks if connection to POS is established
  	 * @return {Boolean}
   */

  POSConnectorClass.prototype.isConnected = function() {
    return this._bridge != null;
  };

  POSConnectorClass.prototype.getLoginInformation = function(callback) {
    return this._bridge.callHandler('getLoginInformation', {}, callback);
  };


  /**
  	 * Sends order object to POS after validating
  	 * Invokes callback function with possible errors
  	 * @param  {Object}   order
  	 * @param  {Function} callback
  	 * @return {}
   */

  POSConnectorClass.prototype.payBasket = function(order, callback) {
    if (!this._validateOrder(order).length) {
      this._callHandler('payBasket', order);
    }
    if (callback) {
      return callback(this._validateOrder(order));
    }
  };


  /**
  	 * Subscribes for all loginInformation events
  	 * @param  {Function} callback
  	 * @return {}
   */

  POSConnectorClass.prototype.subscribeForLoginInformation = function(callback) {
    return this._registerHandler('getLoginInformation', callback);
  };


  /**
  	 * Subscribes for all paymentStatus events
  	 * @param  {Function} callback
  	 * @return {}
   */

  POSConnectorClass.prototype.subscribeForPaymentStatus = function(callback) {
    return this._registerHandler('paymentStatus', callback);
  };


  /**
  	 * Subscribes for all barcodeScan events
  	 * @param  {Function} callback
  	 * @return {}
   */

  POSConnectorClass.prototype.subscribeForBarcodeScan = function(callback) {
    return this._registerHandler('barcodeScan', callback);
  };


  /**
  	 * Subscribes for home button click
  	 * @param  {Function} callback
  	 * @return {}
   */

  POSConnectorClass.prototype.subscribeForHomeButton = function(callback) {
    return this._registerHandler('goHome', callback);
  };


  /**
  	 * Event invoked on POS connect
  	 * @param  {Function} callback
  	 * @return {}
   */

  POSConnectorClass.prototype.onConnect = function(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback();
    } else {
      return document.addEventListener("WebViewJavascriptBridgeReady", function() {
        return callback();
      });
    }
  };


  /**
  	 * Connects to POS and invokes a callback function with the bridge object
  	 * @param  {Function} callback
  	 * @return {}
   */

  POSConnectorClass.prototype._connectWebViewJavascriptBridge = function(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    } else {
      return document.addEventListener('WebViewJavascriptBridgeReady', function() {
        return callback(WebViewJavascriptBridge);
      }, false);
    }
  };


  /**
  	 * Sends a message to POS
  	 * @param  {Mixed} 	  message
  	 * @param  {Function} responseCallback
  	 * @return {}
   */

  POSConnectorClass.prototype._sendMessage = function(message, responseCallback) {
    if (responseCallback) {
      return this._bridge.send(message, responseCallback);
    } else {
      return this._bridge.send(message);
    }
  };


  /**
  	 * Registers event handler on the bridge
  	 * @param  {String}   handlerName Name of the handler
  	 * @param  {Function} callback    Function to execute on handler invoke
  	 * @return {}
   */

  POSConnectorClass.prototype._registerHandler = function(handlerName, callback) {
    return this._bridge.registerHandler(handlerName, callback);
  };


  /**
  	 * Calls handler method in POS
  	 * @param  {String} handlerName
  	 * @return {}
   */

  POSConnectorClass.prototype._callHandler = function(handlerName, data, callback) {
    return this._bridge.callHandler(handlerName, data, callback);
  };

  POSConnectorClass.prototype._validateLoginInformation = function(login) {
    var _addError, validationErrors;
    validationErrors = [];
    _addError = function(errorCode, message) {
      return validationErrors.push({
        errorCode: errorCode,
        message: message
      });
    };
    if (!login.shop_id) {
      _addError(1, 'Shop id must be provided');
    }
    return validationErrors;
  };


  /**
  	 * Validates Order object
  	 * @param  {Object} order
  	 * @return {Array}  Array of validationError objects
   */

  POSConnectorClass.prototype._validateOrder = function(order) {
    var _addError, _countDecimals, _isNumber, _orderHasReturns, discount, j, k, l, len, len1, len2, len3, m, order_line_item, ref, ref1, ref2, ref3, transaction, validationErrors;
    validationErrors = [];
    _orderHasReturns = false;
    _countDecimals = function(number) {
      var match;
      match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) {
        return 0;
      } else {
        return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
      }
    };
    _isNumber = function(number) {
      return typeof number === "number" && _countDecimals(number) <= 2;
    };
    _addError = function(errorCode, message) {
      return validationErrors.push({
        errorCode: errorCode,
        message: message
      });
    };
    if (!order.id) {
      _addError(1, 'Order ID must be present');
    }
    if (!order.order_line_items || order.order_line_items.length < 1) {
      _addError(2, 'Order must containt at least 1 OrderLineItem');
    }
    if (order.order_line_items) {
      ref = order.order_line_items;
      for (j = 0, len = ref.length; j < len; j++) {
        order_line_item = ref[j];
        if (order_line_item.quantity && order_line_item.quantity < 0) {
          _orderHasReturns = true;
        }
        if (!order_line_item.quantity || order_line_item.quantity === 0) {
          _addError(3, 'Each OrderLineItem must contain a quantity different than 0');
        }
        if (!order_line_item.unit_price || !_isNumber(order_line_item.unit_price)) {
          _addError(4, 'Each OrderLineItem must contain unit price with a maximum of 2 decimals');
        }
        if (!order_line_item.product_id || !(typeof order_line_item.product_id === "string" && order_line_item.product_id !== "")) {
          _addError(5, 'Each OrderLineItem must contain a name');
        }
        if (!order_line_item.vat_percentage || !(_isNumber(order_line_item.vat_percentage) && order_line_item.vat_percentage >= 0 && order_line_item.vat_percentage <= 1)) {
          _addError(6, 'Each OrderLineItem must contain a vat rate from 0 to 1 with a maximum of 2 decimals');
        }
        if (order_line_item.imei && !(typeof order_line_item.imei === "string" && order_line_item.imei !== "")) {
          _addError(7, 'If imei is present on OrderLineItem, it must of type string and non empty');
        }
        if (order_line_item.unit_price && order_line_item.unit_price <= 0) {
          _addError(8, 'If UnitPrice is present on OrderLineItem, it cannot be negative');
        }
        if (order_line_item.discounts) {
          ref1 = order_line_item.discounts;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            discount = ref1[k];
            if (discount.amount && discount.percentage) {
              _addError(9, 'Both amount and percentage cannot be present on Discounts at the same time');
            }
            if (discount.amount && !_isNumber(discount.amount)) {
              _addError(10, 'If amount is present on discount, it must be a number with a maximum of 2 decimals');
            }
            if (discount.percentage && !(discount.percentage >= 0 && discount.percentage <= 1)) {
              _addError(11, 'If percentage is present on Discount, it must be from 0 to 1');
            }
            if (discount.description && !(typeof discount.description === "string" && discount.description !== "")) {
              _addError(12, 'If description is present on Discount, it must be a non empty string');
            }
          }
        }
      }
    }
    if (order.discounts) {
      ref2 = order.discounts;
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        discount = ref2[l];
        if (discount.amount && discount.percentage) {
          _addError(13, 'Both amount and percentage cannot be present on Discounts at the same time');
        }
        if (discount.amount && !_isNumber(discount.amount)) {
          _addError(14, 'If amount is present on discount, it must be a number with a maximum of 2 decimals');
        }
        if (discount.percentage && !(discount.percentage >= 0 && discount.percentage <= 1)) {
          _addError(15, 'If percentage is present on Discount, it must be from 0 to 1');
        }
        if (discount.description && !(typeof discount.description === "string" && discount.description !== "")) {
          _addError(16, 'If description is present on Discount, it must be a non empty string');
        }
      }
    }
    if (order.transactions) {
      ref3 = order.transactions;
      for (m = 0, len3 = ref3.length; m < len3; m++) {
        transaction = ref3[m];
        if (!transaction.type || transaction.type !== "WM_TRANSACTION_TYPE_INSTALLMENT") {
          _addError(17, 'Each transaction must contain type matching "WM_TRANSACTION_TYPE_INSTALLMENT"');
        }
        if (!transaction.amount || !_isNumber(transaction.amount)) {
          _addError(18, 'Each transaction must contain amount with max 2 decimals');
        }
      }
    }
    if (order.transactions && order.transactions.length && _orderHasReturns) {
      _addError(19, 'If order has returns, transactions cannot exist on the order');
    }
    return validationErrors;
  };


  /**
  	 * Abstraction of the script injected by Obj-C
  	 * for testing in a browser only environment
  	 * @return {}
   */

  POSConnectorClass.prototype.simulatePos = function() {
    var CUSTOM_PROTOCOL_SCHEME, QUEUE_HAS_MESSAGE, _createQueueReadyIframe, _dispatchMessageFromObjC, _doSend, _fetchQueue, _handleMessageFromObjC, callHandler, doc, init, messageHandlers, messagingIframe, readyEvent, receiveMessageQueue, registerHandler, responseCallbacks, send, sendMessageQueue, uniqueId;
    messagingIframe = void 0;
    sendMessageQueue = [];
    receiveMessageQueue = [];
    messageHandlers = {};
    CUSTOM_PROTOCOL_SCHEME = "wvjbscheme";
    QUEUE_HAS_MESSAGE = "__WVJB_QUEUE_MESSAGE__";
    responseCallbacks = {};
    uniqueId = 1;
    _createQueueReadyIframe = function(doc) {
      messagingIframe = doc.createElement("iframe");
      messagingIframe.style.display = "none";
      messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + "://" + QUEUE_HAS_MESSAGE;
      return doc.documentElement.appendChild(messagingIframe);
    };
    init = function(messageHandler) {
      var i, receivedMessages, results;
      console.info("[POS Simulator]: Started running...");
      console.info("[POS Simulator]: Will echo Orders received from the payBasket() method, and send back Payment Status after 10 seconds of receiving and Order.");
      console.info("[POS Simulator]: Will also simulate Barcode Scans every 30 seconds.");
      console.info("[POS Simulator]: Remember to subscribe for Barcodes and Payment Status's with the methods provided.");
      if (WebViewJavascriptBridge._messageHandler) {
        throw new Error("WebViewJavascriptBridge.init called twice");
      }
      WebViewJavascriptBridge._messageHandler = messageHandler;
      receivedMessages = receiveMessageQueue;
      receiveMessageQueue = null;
      i = 0;
      setInterval(function() {
        if (messageHandlers['barcodeScan']) {
          return messageHandlers['barcodeScan']({
            barcode: '1234567890123'
          });
        }
      }, 30000);
      results = [];
      while (i < receivedMessages.length) {
        _dispatchMessageFromObjC(receivedMessages[i]);
        results.push(i++);
      }
      return results;
    };
    send = function(data, responseCallback) {
      return _doSend({
        data: data
      }, responseCallback);
    };
    registerHandler = function(handlerName, handler) {
      return messageHandlers[handlerName] = handler;
    };
    callHandler = function(handlerName, data, responseCallback) {
      return _doSend({
        handlerName: handlerName,
        data: data
      }, responseCallback);
    };
    _doSend = function(message, responseCallback) {
      var callbackId;
      if (responseCallback) {
        callbackId = "cb_" + (uniqueId++) + "_" + new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        message["callbackId"] = callbackId;
      }
      sendMessageQueue.push(message);
      messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + "://" + QUEUE_HAS_MESSAGE;
      if (message.handlerName) {
        console.log('[POS Simulator]: Received handler(' + message.handlerName + ') with data: ', message.data);
        console.log('[POS Simulator]: Invoking ' + message.handlerName + ' event in 10 seconds.');
        if (messageHandlers[message.handlerName]) {
          return setTimeout(function() {
            return messageHandlers[message.handlerName](message.data);
          }, 100);
        }
      } else {
        return console.log("[POS Simulator]: Received message: ", message.data);
      }
    };
    _fetchQueue = function() {
      var messageQueueString;
      messageQueueString = JSON.stringify(sendMessageQueue);
      sendMessageQueue = [];
      return messageQueueString;
    };
    _dispatchMessageFromObjC = function(messageJSON) {
      var _timeoutDispatchMessageFromObjC;
      return setTimeout(_timeoutDispatchMessageFromObjC = function() {
        var callbackResponseId, error, exception, handler, message, messageHandler, responseCallback;
        message = JSON.parse(messageJSON);
        messageHandler = void 0;
        if (message.responseId) {
          responseCallback = responseCallbacks[message.responseId];
          if (!responseCallback) {
            return;
          }
          responseCallback(message.responseData);
          return delete responseCallbacks[message.responseId];
        } else {
          responseCallback = void 0;
          if (message.callbackId) {
            callbackResponseId = message.callbackId;
            responseCallback = function(responseData) {
              return _doSend({
                responseId: callbackResponseId,
                responseData: responseData
              });
            };
          }
          handler = WebViewJavascriptBridge._messageHandler;
          if (message.handlerName) {
            handler = messageHandlers[message.handlerName];
          }
          try {
            return handler(message.data, responseCallback);
          } catch (error) {
            exception = error;
            if (typeof console !== "undefined") {
              return console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
            }
          }
        }
      });
    };
    _handleMessageFromObjC = function(messageJSON) {
      if (receiveMessageQueue) {
        return receiveMessageQueue.push(messageJSON);
      } else {
        return _dispatchMessageFromObjC(messageJSON);
      }
    };
    if (window.WebViewJavascriptBridge) {
      return;
    }
    window.WebViewJavascriptBridge = {
      init: init,
      send: send,
      registerHandler: registerHandler,
      callHandler: callHandler,
      _fetchQueue: _fetchQueue,
      _handleMessageFromObjC: _handleMessageFromObjC
    };
    doc = document;
    _createQueueReadyIframe(doc);
    readyEvent = doc.createEvent("Events");
    readyEvent.initEvent("WebViewJavascriptBridgeReady", true, false);
    readyEvent.bridge = WebViewJavascriptBridge;
    return doc.dispatchEvent(readyEvent);
  };

  return POSConnectorClass;

})();

POSConnector = new POSConnectorClass;
