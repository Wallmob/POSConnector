#POSConnector

JS Library for communication with the Wallmob POS

##Setup

To use the POSConnector in your own project, include the script file in your header.
```html
<script src="POSConnector.min.js"></script>
```

##API & Examples

Check if POS is present
```javascript
POSConnector.isConnected();
````
```javascript
var connected = POSConnector.isConnected();
````

Check if POS is present
```javascript
POSConnector.payBasket(Order, CallbackFn);
````

Check if POS is present
```javascript
POSConnector.subscribeForPaymentStatus(CallbackFn);
````

Check if POS is present
```javascript
POSConnector.subscribeForBarcodeScan(CallbackFn);
````

