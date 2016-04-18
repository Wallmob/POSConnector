<a name="POSConnector"></a>

## POSConnector
POSConnector
Allows for communication with the native POS application.

**Kind**: global class  

* [POSConnector](#POSConnector)
    * _static_
        * [.LineItem](#POSConnector.LineItem)
            * [new LineItem(name, quantity, unitPrice, vatPercentage, salesTaxPercentage, [productId], [imei], [discounts])](#new_POSConnector.LineItem_new)
        * [.Transaction](#POSConnector.Transaction)
            * [new Transaction(type, amount)](#new_POSConnector.Transaction_new)
        * [.Discount](#POSConnector.Discount)
            * [new Discount(amount, description, [percentage])](#new_POSConnector.Discount_new)
        * [.Basket](#POSConnector.Basket)
            * [new Basket(id, lineItems, [transactions], [discounts])](#new_POSConnector.Basket_new)
        * [.LoginInformation](#POSConnector.LoginInformation)
            * [new LoginInformation(shopId, shopName, registerId, registerName, userId, userName)](#new_POSConnector.LoginInformation_new)
        * [.addEventListener(type, listener)](#POSConnector.addEventListener)
        * [.removeEventListener(listener)](#POSConnector.removeEventListener)
        * [.isConnected()](#POSConnector.isConnected) ⇒ <code>boolean</code>
        * [.payBasket(basket, callback)](#POSConnector.payBasket)
        * [.getLoginInformation(callback)](#POSConnector.getLoginInformation)
    * _inner_
        * [~connectionEstablishedListener](#POSConnector..connectionEstablishedListener) : <code>function</code>
        * [~barcodeScannedListener](#POSConnector..barcodeScannedListener) : <code>function</code>
        * [~payBasketCallback](#POSConnector..payBasketCallback) : <code>function</code>
        * [~getLoginInformationCallback](#POSConnector..getLoginInformationCallback) : <code>function</code>

<a name="POSConnector.LineItem"></a>

### POSConnector.LineItem
**Kind**: static class of <code>[POSConnector](#POSConnector)</code>  
<a name="new_POSConnector.LineItem_new"></a>

#### new LineItem(name, quantity, unitPrice, vatPercentage, salesTaxPercentage, [productId], [imei], [discounts])
Represents a line item


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the line item |
| quantity | <code>number</code> | Number of items, positive or negative, represented on the line (eg. 5) |
| unitPrice | <code>number</code> | The price of each item on the line (eg. 9.95) |
| vatPercentage | <code>number</code> | The VAT included in the unit price (eg. 0.25) |
| salesTaxPercentage | <code>number</code> | The sales tax to apply to the unit price (eg. 0.05) |
| [productId] | <code>string</code> | Id of the product represented on the line |
| [imei] | <code>string</code> | IMEI of the product represented on the line |
| [discounts] | <code>Array.&lt;Discount&gt;</code> | Discounts on the line item |

<a name="POSConnector.Transaction"></a>

### POSConnector.Transaction
**Kind**: static class of <code>[POSConnector](#POSConnector)</code>  
<a name="new_POSConnector.Transaction_new"></a>

#### new Transaction(type, amount)
Represents a payment transaction


| Param | Type | Description |
| --- | --- | --- |
| type | <code>POSConnector.TransactionType</code> | The type of payment transaction |
| amount | <code>number</code> | Amount payed by the transaction |

<a name="POSConnector.Discount"></a>

### POSConnector.Discount
**Kind**: static class of <code>[POSConnector](#POSConnector)</code>  
<a name="new_POSConnector.Discount_new"></a>

#### new Discount(amount, description, [percentage])
Represents a discount on either a basket or a line item


| Param | Type | Description |
| --- | --- | --- |
| amount | <code>number</code> | Amount that the discount applies (eg. 90.50) |
| description | <code>string</code> | Reason for the discount to be given (shown on receipt) |
| [percentage] | <code>number</code> | Just for information, it won't affect the amount (eg. 0.5) |

<a name="POSConnector.Basket"></a>

### POSConnector.Basket
**Kind**: static class of <code>[POSConnector](#POSConnector)</code>  
<a name="new_POSConnector.Basket_new"></a>

#### new Basket(id, lineItems, [transactions], [discounts])
Represents a shopping basket


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of the basket |
| lineItems | <code>Array.&lt;LineItem&gt;</code> | Line items contained in the basket |
| [transactions] | <code>Array.&lt;Transaction&gt;</code> | Transactions on the basket |
| [discounts] | <code>Array.&lt;Discount&gt;</code> | Discounts on the basket |

<a name="POSConnector.LoginInformation"></a>

### POSConnector.LoginInformation
**Kind**: static class of <code>[POSConnector](#POSConnector)</code>  
<a name="new_POSConnector.LoginInformation_new"></a>

#### new LoginInformation(shopId, shopName, registerId, registerName, userId, userName)

| Param | Type | Description |
| --- | --- | --- |
| shopId | <code>string</code> | Shop's id |
| shopName | <code>string</code> | Shop's name |
| registerId | <code>string</code> | Register's id |
| registerName | <code>string</code> | Register's name |
| userId | <code>string</code> | User's id |
| userName | <code>string</code> | User's name |

<a name="POSConnector.addEventListener"></a>

### POSConnector.addEventListener(type, listener)
Add an event listener

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>EventType</code> | The type of event to listen for |
| listener | <code>connectedListener</code> &#124; <code>barcodeScannedListener</code> | The listener function to add |

<a name="POSConnector.removeEventListener"></a>

### POSConnector.removeEventListener(listener)
Remove an event listener

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>connectedListener</code> &#124; <code>barcodeScannedListener</code> | The listener function to remove |

<a name="POSConnector.isConnected"></a>

### POSConnector.isConnected() ⇒ <code>boolean</code>
Check for connection toward the POS

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  
**Returns**: <code>boolean</code> - The connection status  
<a name="POSConnector.payBasket"></a>

### POSConnector.payBasket(basket, callback)
Pass a basket to the POS for payment processing

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| basket | <code>[Basket](#POSConnector.Basket)</code> | Basket to pass on to the POS |
| callback | <code>[payBasketCallback](#POSConnector..payBasketCallback)</code> | Called when the operation concludes |

<a name="POSConnector.getLoginInformation"></a>

### POSConnector.getLoginInformation(callback)
Get current login information from the native POS

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>[getLoginInformationCallback](#POSConnector..getLoginInformationCallback)</code> | Called when the operation concludes |

<a name="POSConnector..connectionEstablishedListener"></a>

### POSConnector~connectionEstablishedListener : <code>function</code>
Passed to POSConnector.on for EventType.Connected

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  
<a name="POSConnector..barcodeScannedListener"></a>

### POSConnector~barcodeScannedListener : <code>function</code>
Passed to POSConnector.on for EventType.BarcodeScanned

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| barcode | <code>string</code> | The barcode that was scanned |

<a name="POSConnector..payBasketCallback"></a>

### POSConnector~payBasketCallback : <code>function</code>
Passed to the payBasket function

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| success | <code>boolean</code> | Whether or not the payment was completed |
| [error] | <code>string</code> | Optional string describing what went wrong |

<a name="POSConnector..getLoginInformationCallback"></a>

### POSConnector~getLoginInformationCallback : <code>function</code>
Passed to the getLoginInformation function

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [result] | <code>[LoginInformation](#POSConnector.LoginInformation)</code> | The requested login information if successful |
| [error] | <code>string</code> | The error that occured if unsuccessful |

