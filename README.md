<a name="POSConnector"></a>

## POSConnector
POSConnectorAllows for communication with the native POS application.

**Kind**: global class  

* [POSConnector](#POSConnector)
    * _static_
        * [.LineItem](#POSConnector.LineItem)
            * [new LineItem(name, quantity, unitPrice, vatPercentage, salesTaxPercentage, [productId], [imei], [discounts])](#new_POSConnector.LineItem_new)
        * [.Transaction](#POSConnector.Transaction)
            * [new Transaction(transactionType, amount)](#new_POSConnector.Transaction_new)
        * [.Discount](#POSConnector.Discount)
            * [new Discount(description, [amount], [percentage])](#new_POSConnector.Discount_new)
        * [.Basket](#POSConnector.Basket)
            * [new Basket(id, lineItems, [transactions], [discounts])](#new_POSConnector.Basket_new)
        * [.LoginInformation](#POSConnector.LoginInformation)
            * [new LoginInformation(shopId, shopName, registerId, registerName, userId, userName)](#new_POSConnector.LoginInformation_new)
        * [.TransactionType](#POSConnector.TransactionType) : <code>enum</code>
        * [.EventType](#POSConnector.EventType) : <code>enum</code>
        * [.addEventListener(type, listener)](#POSConnector.addEventListener)
        * [.removeEventListener(listener)](#POSConnector.removeEventListener)
        * [.isConnected()](#POSConnector.isConnected) ⇒ <code>boolean</code>
        * [.payBasket(basket, callback)](#POSConnector.payBasket)
        * [.getLoginInformation(callback)](#POSConnector.getLoginInformation)
        * [.openURL(url, callback)](#POSConnector.openURL)
        * [.printDocumentAtURL(url, callback)](#POSConnector.printDocumentAtURL)
        * [.printDocumentWithData(data, [callback])](#POSConnector.printDocumentWithData)
        * [.sendPOSConnectorObjectPathToPOS(objectPath, [callback])](#POSConnector.sendPOSConnectorObjectPathToPOS)
    * _inner_
        * [~barcodeScannedListener](#POSConnector..barcodeScannedListener) : <code>function</code>
        * [~deeplinkActivatedListener](#POSConnector..deeplinkActivatedListener) : <code>function</code>
        * [~payBasketCallback](#POSConnector..payBasketCallback) : <code>function</code>
        * [~getLoginInformationCallback](#POSConnector..getLoginInformationCallback) : <code>function</code>
        * [~openURLCallback](#POSConnector..openURLCallback) : <code>function</code>
        * [~printDocumentCallback](#POSConnector..printDocumentCallback) : <code>function</code>
        * [~sendPOSConnectorObjectPathToPOSCallback](#POSConnector..sendPOSConnectorObjectPathToPOSCallback) : <code>function</code>

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

#### new Transaction(transactionType, amount)
Represents a payment transaction


| Param | Type | Description |
| --- | --- | --- |
| transactionType | <code>[TransactionType](#POSConnector.TransactionType)</code> | The type of payment transaction |
| amount | <code>number</code> | Amount payed by the transaction |

<a name="POSConnector.Discount"></a>

### POSConnector.Discount
**Kind**: static class of <code>[POSConnector](#POSConnector)</code>  
<a name="new_POSConnector.Discount_new"></a>

#### new Discount(description, [amount], [percentage])
Represents a discount on either a basket or a line item


| Param | Type | Description |
| --- | --- | --- |
| description | <code>string</code> | Reason for the discount to be given (shown on receipt) |
| [amount] | <code>number</code> | Amount that the discount applies (eg. 90.50). Do not pass if passing percentage. |
| [percentage] | <code>number</code> | The percentage which will be calculated based on what it's applied to (eg. 0.5). Do not pass if passing amount. |

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

<a name="POSConnector.TransactionType"></a>

### POSConnector.TransactionType : <code>enum</code>
Enum of possible transaction types

**Kind**: static enum property of <code>[POSConnector](#POSConnector)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| Cash | <code>string</code> | <code>&quot;Cash&quot;</code> | 
| DebitorAccount | <code>string</code> | <code>&quot;DebitorAccount&quot;</code> | 
| Ecommerce | <code>string</code> | <code>&quot;Ecommerce&quot;</code> | 
| External | <code>string</code> | <code>&quot;External&quot;</code> | 
| ExternalCard | <code>string</code> | <code>&quot;ExternalCard&quot;</code> | 
| ExternalGiftCard | <code>string</code> | <code>&quot;ExternalGiftCard&quot;</code> | 
| GiftCardVoucher | <code>string</code> | <code>&quot;GiftCardVoucher&quot;</code> | 
| Installment | <code>string</code> | <code>&quot;Installment&quot;</code> | 
| MobilePay | <code>string</code> | <code>&quot;MobilePay&quot;</code> | 
| Point | <code>string</code> | <code>&quot;Point&quot;</code> | 

<a name="POSConnector.EventType"></a>

### POSConnector.EventType : <code>enum</code>
Enum of possible event types

**Kind**: static enum property of <code>[POSConnector](#POSConnector)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| BarcodeScanned | <code>string</code> | <code>&quot;BarcodeScanned&quot;</code> | 
| DeeplinkActivated | <code>string</code> | <code>&quot;DeeplinkActivated&quot;</code> | 

<a name="POSConnector.addEventListener"></a>

### POSConnector.addEventListener(type, listener)
Add an event listener

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>[EventType](#POSConnector.EventType)</code> | The type of event to listen for |
| listener |  | The listener function to add |

<a name="POSConnector.removeEventListener"></a>

### POSConnector.removeEventListener(listener)
Remove an event listener

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>[barcodeScannedListener](#POSConnector..barcodeScannedListener)</code> | The listener function to remove |

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

<a name="POSConnector.openURL"></a>

### POSConnector.openURL(url, callback)
Request opening of a URL from the native application. The URL will open in which ever application the device prefers, typically Safari.

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to open |
| callback | <code>[openURLCallback](#POSConnector..openURLCallback)</code> | Called when the native application opened or rejected opening the URL |

<a name="POSConnector.printDocumentAtURL"></a>

### POSConnector.printDocumentAtURL(url, callback)
Request printing of a document located at a URL

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL pointing toward the document to print |
| callback | <code>[printDocumentCallback](#POSConnector..printDocumentCallback)</code> | Called when the operation concludes |

<a name="POSConnector.printDocumentWithData"></a>

### POSConnector.printDocumentWithData(data, [callback])
Requests printing of a document with a data object

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Blob</code> &#124; <code>string</code> | The document data either contained in a Blob object or a base64 string |
| [callback] | <code>[printDocumentCallback](#POSConnector..printDocumentCallback)</code> | Called when the operation concludes |

<a name="POSConnector.sendPOSConnectorObjectPathToPOS"></a>

### POSConnector.sendPOSConnectorObjectPathToPOS(objectPath, [callback])
Send an object path for the POSConnector to the native POS application.You'd do this if you're utilizing modules or similar and you don't want to dependon having the POSConnector object with that specific variable name in the global scope.

**Kind**: static method of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| objectPath | <code>string</code> | Path the the POSConnector object (ie. "Vendor.Wallmob.POSLink") |
| [callback] | <code>[sendPOSConnectorObjectPathToPOSCallback](#POSConnector..sendPOSConnectorObjectPathToPOSCallback)</code> | Called when the operation concludes. |

<a name="POSConnector..barcodeScannedListener"></a>

### POSConnector~barcodeScannedListener : <code>function</code>
Passed to POSConnector.addEventListener for EventType.BarcodeScanned

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| barcode | <code>string</code> | The barcode that was scanned |

<a name="POSConnector..deeplinkActivatedListener"></a>

### POSConnector~deeplinkActivatedListener : <code>function</code>
Passed to POSConnector.addEventListener for EventType.

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| link | <code>string</code> | The link |

<a name="POSConnector..payBasketCallback"></a>

### POSConnector~payBasketCallback : <code>function</code>
Passed to the payBasket function

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>boolean</code> | Whether or not the payment was completed |
| [error] | <code>string</code> | Optional string describing what went wrong |

<a name="POSConnector..getLoginInformationCallback"></a>

### POSConnector~getLoginInformationCallback : <code>function</code>
Passed to the getLoginInformation function

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [result] | <code>[LoginInformation](#POSConnector.LoginInformation)</code> | The requested login information if successful |
| [error] | <code>string</code> | The error that occurred if unsuccessful |

<a name="POSConnector..openURLCallback"></a>

### POSConnector~openURLCallback : <code>function</code>
Passed to the openURL function

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [error] | <code>string</code> | The error that occurred if unsuccessful |

<a name="POSConnector..printDocumentCallback"></a>

### POSConnector~printDocumentCallback : <code>function</code>
Passed to the printDocumentAtURL and printDocumentData functions

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>boolean</code> | Whether or not the printing job was completed |
| [error] | <code>string</code> | The error that occurred if printing wasn't just cancelled by the user |

<a name="POSConnector..sendPOSConnectorObjectPathToPOSCallback"></a>

### POSConnector~sendPOSConnectorObjectPathToPOSCallback : <code>function</code>
Passed to the sendPOSConnectorObjectPathToPOS function

**Kind**: inner typedef of <code>[POSConnector](#POSConnector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [error] | <code>string</code> | The error that occurred if unsuccessful |

