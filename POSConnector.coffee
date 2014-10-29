class POSConnectorClass

	###*
	 * Class constructor invokes _connectWebViewJavascriptBridge
	 * and exposes the bridge to the class instance
	 * @return {}
	###
	constructor: () ->
		@_bridge = null
		_this = @

		@_connectWebViewJavascriptBridge (bridge) ->
			_this._bridge = bridge;
			_this._bridge.init (message, responseCallback) ->
	
	###*
	 * Checks if connection to POS is established
	 * @return {Boolean}
	###
	isConnected: () ->
		@_bridge?

	###*
	 * Sends order object to POS after validating
	 * Invokes callback function with possible errors
	 * @param  {Object}   order
	 * @param  {Function} callback
	 * @return {}
	###
	payBasket: (order, callback) ->
		@_callHandler('payBasket', order) if !@_validateOrder(order).length
		callback @_validateOrder(order) if callback

	###*
	 * Subscribes for all paymentStatus events
	 * @param  {Function} callback
	 * @return {}
	###
	subscribeForPaymentStatus: (callback) ->
		@_registerHandler 'paymentStatus', callback

	###*
	 * Subscribes for all barcodeScan events
	 * @param  {Function} callback
	 * @return {}
	###
	subscribeForBarcodeScan: (callback) ->
		@_registerHandler 'barcodeScan', callback

	###*
	 * Connects to POS and invokes a callback function with the bridge object
	 * @param  {Function} callback
	 * @return {}
	###
	_connectWebViewJavascriptBridge: (callback) ->
		if window.WebViewJavascriptBridge
			callback WebViewJavascriptBridge
		else
			document.addEventListener 'WebViewJavascriptBridgeReady', () ->
				callback WebViewJavascriptBridge
			, false

	###*
	 * Sends a message to POS
	 * @param  {Mixed} 	  message
	 * @param  {Function} responseCallback
	 * @return {}
	###
	_sendMessage: (message, responseCallback) ->
		if responseCallback
			@_bridge.send message, responseCallback
		else
			@_bridge.send message

	###*
	 * Registers event handler on the bridge
	 * @param  {String}   handlerName Name of the handler
	 * @param  {Function} callback    Function to execute on handler invoke
	 * @return {}
	###
	_registerHandler: (handlerName, callback) ->
		@_bridge.registerHandler handlerName, callback

	###*
	 * Calls handler method in POS
	 * @param  {String} handlerName
	 * @return {}
	###
	_callHandler: (handlerName, data) ->
		@_bridge.callHandler handlerName, data

	###*
	 * Validates Order object
	 * @param  {Object} order
	 * @return {Array}  Array of validationError objects
	###
	_validateOrder: (order) ->
		validationErrors = []
		_countDecimals = (number) ->
			match = (''+number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
			if (!match) 
				return 0;
			else
  				return Math.max(0, (if match[1] then match[1].length else 0) - (if match[2] then +match[2] else 0));
		_isNumber = (number) ->
			typeof number == "number" and _countDecimals(number) <= 2
		_addError = (errorCode, message) ->
			#if not (validationError for validationError in validationErrors when validationError.errorCode is errorCode)
			validationErrors.push {errorCode, message}

		if !order.id
			_addError 1, 'Order ID must be present'
		if !order.order_line_items or order.order_line_items.length < 1
			_addError 2, 'Order must containt at least 1 OrderLineItem'
		if order.order_line_items
			for order_line_item in order.order_line_items
				if !order_line_item.quantity or order_line_item.quantity == 0
					_addError 3, 'Each OrderLineItem must contain a quantity different than 0'
				if !order_line_item.unit_price or !_isNumber(order_line_item.unit_price)
					_addError 4, 'Each OrderLineItem must contain unit price with max 2 decimals'
				if !order_line_item.product_id or !(typeof order_line_item.product_id == "string" and order_line_item.product_id != "")
					_addError 5, 'Each OrderLineItem must contain a name'
				if !order_line_item.vat_percentage or !(order_line_item.vat_percentage >= 0 and order_line_item.vat_percentage <= 1)
					_addError 6, 'Each OrderLineItem must contain a vat rate from 0 to 1'
				if order_line_item.imei and !(typeof order_line_item.imei == "string" and order_line_item.imei != "")
					_addError 7, 'If imei is present on OrderLineItem, it must of type string and non empty'
				if order_line_item.discounts
					for discount in order_line_item.discounts
						if !discount.amount or !_isNumber(discount.amount)
							_addError 8, 'Each discount must contain amount with max 2 decimals'
						if discount.percentage and !(discount.percentage >= 0 and discount.percentage <= 1)
							_addError 9, 'If percentage is present on Discount, it must be from 0 to 1'
						if discount.description and !(typeof discount.description == "string" and discount.description != "")
							_addError 10, 'If description is present on Discount, it must be a non empty string'

		if order.discounts
			for discount in order.discounts
				if !discount.amount or !_isNumber(discount.amount)
					_addError 8, 'Each discount must contain amount with max 2 decimals'
				if discount.percentage and !(discount.percentage >= 0 and discount.percentage <= 1)
					_addError 9, 'If percentage is present on Discount, it must be from 0 to 1'
				if discount.description and !(typeof discount.description == "string" and discount.description != "")
					_addError 10, 'If description is present on Discount, it must be a non empty string'

		if order.transactions
			for transaction in order.transactions
				if !transaction.type or transaction.type != "WM_TRANSACTION_TYPE_INSTALLMENT"
					_addError 11, 'Each transaction must contain type matching "WM_TRANSACTION_TYPE_INSTALLMENT"'
				if !transaction.amount or !_isNumber(transaction.amount)
					_addError 12, 'Each transaction must contain amount with max 2 decimals'

		return validationErrors

	###*
	 * Abstraction of the script injected by Obj-C
	 * for testing in a browser only environment
	 * @return {}
	###
	simulatePos: () ->
		messagingIframe = undefined
		sendMessageQueue = []
		receiveMessageQueue = []
		messageHandlers = {}
		CUSTOM_PROTOCOL_SCHEME = "wvjbscheme"
		QUEUE_HAS_MESSAGE = "__WVJB_QUEUE_MESSAGE__"
		responseCallbacks = {}
		uniqueId = 1
		_createQueueReadyIframe = (doc) ->
	      messagingIframe = doc.createElement("iframe")
	      messagingIframe.style.display = "none"
	      messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + "://" + QUEUE_HAS_MESSAGE
	      doc.documentElement.appendChild messagingIframe
	    init = (messageHandler) ->
	      throw new Error("WebViewJavascriptBridge.init called twice")  if WebViewJavascriptBridge._messageHandler
	      WebViewJavascriptBridge._messageHandler = messageHandler
	      receivedMessages = receiveMessageQueue
	      receiveMessageQueue = null
	      i = 0

	      while i < receivedMessages.length
	        _dispatchMessageFromObjC receivedMessages[i]
	        i++
	    send = (data, responseCallback) ->
	      _doSend
	        data: data
	      , responseCallback
	    registerHandler = (handlerName, handler) ->
	      messageHandlers[handlerName] = handler
	    callHandler = (handlerName, data, responseCallback) ->
	      _doSend
	        handlerName: handlerName
	        data: data
	      , responseCallback
	    _doSend = (message, responseCallback) ->
	      if responseCallback
	        callbackId = "cb_" + (uniqueId++) + "_" + new Date().getTime()
	        responseCallbacks[callbackId] = responseCallback
	        message["callbackId"] = callbackId
	      sendMessageQueue.push message
	      messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + "://" + QUEUE_HAS_MESSAGE
	      if message.handlerName
	        console.log '[POS]: Received handler(' + message.handlerName + ')', message.data
	        console.log 'POS invoking paymentStatus event in 10 seconds.'
	        if messageHandlers['paymentStatus']
	        	setTimeout ->
	        		messageHandlers['paymentStatus']({status: 1, one_screen_order_id: message.data.id});
	        	, 10000
	      else
	        console.log "[POS]: Received message: ", message.data
	    _fetchQueue = ->
	      messageQueueString = JSON.stringify(sendMessageQueue)
	      sendMessageQueue = []
	      messageQueueString
	    _dispatchMessageFromObjC = (messageJSON) ->
	      setTimeout _timeoutDispatchMessageFromObjC = ->
	        message = JSON.parse(messageJSON)
	        messageHandler = undefined
	        if message.responseId
	          responseCallback = responseCallbacks[message.responseId]
	          return  unless responseCallback
	          responseCallback message.responseData
	          delete responseCallbacks[message.responseId]
	        else
	          responseCallback = undefined
	          if message.callbackId
	            callbackResponseId = message.callbackId
	            responseCallback = (responseData) ->
	              _doSend
	                responseId: callbackResponseId
	                responseData: responseData

	          handler = WebViewJavascriptBridge._messageHandler
	          handler = messageHandlers[message.handlerName]  if message.handlerName
	          try
	            handler message.data, responseCallback
	          catch exception
	            console.log "WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception  unless typeof console is "undefined"

	    _handleMessageFromObjC = (messageJSON) ->
	      if receiveMessageQueue
	        receiveMessageQueue.push messageJSON
	      else
	        _dispatchMessageFromObjC messageJSON
	    return  if window.WebViewJavascriptBridge
	    
	    window.WebViewJavascriptBridge =
	      init: init
	      send: send
	      registerHandler: registerHandler
	      callHandler: callHandler
	      _fetchQueue: _fetchQueue
	      _handleMessageFromObjC: _handleMessageFromObjC

	    doc = document
	    _createQueueReadyIframe doc
	    readyEvent = doc.createEvent("Events")
	    readyEvent.initEvent "WebViewJavascriptBridgeReady"
	    readyEvent.bridge = WebViewJavascriptBridge
	    doc.dispatchEvent readyEvent

POSConnector = new POSConnectorClass
	