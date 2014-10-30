#POSConnector
JS Library for communication with the Wallmob POS
<br>
##Setup

To use the POSConnector in your own project, include the script file in your header.
```html
<script src="POSConnector.min.js"></script>
```
<br>
##API & Examples

#####Check if the POS is present
```javascript
POSConnector.isConnected();
````
```javascript
// Example
var connected = POSConnector.isConnected(); // connected = true or false
````
<br>
#####Send Order to the POS
```javascript
POSConnector.payBasket(Order, CallbackFn);
````
```javascript
// Example
// JSON-style double quotes around attribute names are optional in JavaScript objects
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
<br>
#####Listen for paymentStatus events sent from the POS
```javascript
POSConnector.subscribeForPaymentStatus(CallbackFn);
````
```javascript
// Example
POSConnector.subscribeForPaymentStatus(function(status){
  console.log("Payment Status received from POS: ", status);
});
````
<br>
#####Listen for barcodeScan events sent from the POS
```javascript
POSConnector.subscribeForBarcodeScan(CallbackFn);
````
```javascript
// Example
POSConnector.subscribeForBarcodeScan(function(barcode){
  console.log("Product scanned on the POS with barcode: ", barcode);
});
````
<br>
##Testing in a browser-only environment

#####Simulate presence of the POS
```javascript
POSConnector.simulatePos();
````
```javascript
// Full example
POSConnector.simulatePos();
// Check browser console for more information after executing this method

// Subscribe for status messages from POS
POSConnector.subscribeForPaymentStatus(function(status){
   console.log(status);
});

// Subscribe for barcode scans from POS
POSConnector.subscribeForBarcodeScan(function(barcode){
   console.log(barcode);
});

// Create dummy Order object
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

// Send Order to the POS
POSConnector.payBasket(Order, function(errors){
   if(errors.length){
      // Order was not sent due to errors
      console.log(errors);
   }else{
      // Order was sent succesfully
   }
});
````
<br>