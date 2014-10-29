#POSConnector

JS Library for communication with the Wallmob POS

##Setup

To use the POSConnector in your own project, include the script file in your header.
```html
<script src="POSConnector.min.js"></script>
```

##API & Examples

Check if POS is present
````
POSConnector.isConnected();
````

Check if POS is present
````
POSConnector.payBasket(Order, Callback);
````

Check if POS is present
````
POSConnector.subscribeForPaymentStatus(Callback);
````

Check if POS is present
````
POSConnector.subscribeForBarcodeScan(Callback);
````

