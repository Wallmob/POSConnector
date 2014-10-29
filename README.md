#POSConnector

JS Library for communication with the Wallmob POS

##Setup

To use the POSConnector in your own project, include the script file in your header.
```html
<script src="POSConnector.min.js"></script>
```

##API & Examples

Check if the POS is present
```javascript
POSConnector.isConnected();
````
```javascript
// Example
var connected = POSConnector.isConnected(); // connected = true or false
````

Send Order to the POS
```javascript
POSConnector.payBasket(Order, CallbackFn);
````
```javascript
// Example
var Order = {
   "id":"OneScreenOrderId",
   "order_line_items":[
      {
         "quantity":2,
         "unit_price":110.50,
         "product_id":"OneScreenProductId1",
         "name":"OneScreenProductName1",
         "vat_percentage":0.2,
         "imei":"AA-BBBBBB-CCCCCC-D",
         "discounts":[
            {
               "amount":10.25,
               "percentage":null,
               "description":"Manual discount"
            }
         ]
      },
      {
         "quantity":1,
         "unit_price":200.00,
         "product_id":"OneScreenProductId2",
         "name":"OneScreenProductName2",
         "vat_percentage":0.25
      }
   ],
   "discounts":[
      {
         "amount":100.00,
         "percentage":0.25,
         "description":"Offer 25% on the basket"
      }
   ],
   "transactions":[
      {
         "type":"WM_TRANSACTION_TYPE_INSTALLMENT",
         "amount":600.00
      }
   ]
}
POSConnector.payBasket(Order, function(errors){
  console.log(errors); // Array of possible validation errors
});
````

Listen for paymentStatus events sent from the POS
```javascript
POSConnector.subscribeForPaymentStatus(CallbackFn);
````
```javascript
// Example
POSConnector.subscribeForPaymentStatus(function(status){
  console.log("Payment Status received from POS: ", status);
});
````

Check if POS is present
```javascript
POSConnector.subscribeForBarcodeScan(CallbackFn);
````
```javascript
// Example
POSConnector.subscribeForBarcodeScan(function(barcode){
  console.log("Product scanned on the POS with barcode: ", barcode);
});
````

