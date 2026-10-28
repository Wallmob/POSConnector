// Self-checking script. Run `node example/node_test.js`: it exits with a non-zero status when a check fails.
var assert = require("node:assert/strict");
var util = require("node:util");
var POSConnector = require("../POSConnector.js");

var failureCount = 0;

function test(name, body) {
    try {
        body();
        console.log("ok   - " + name);
    } catch (error) {
        failureCount += 1;
        console.log("FAIL - " + name);
        console.log("       " + String(error.message).replace(/\n/g, "\n       "));
    }
}

function insuranceLineItem() {
    return new POSConnector.LineItem("Insurance 2 years", 1, 899, 0.25, null, "p-insurance-2y", null, null, false, null, null, "v-2y");
}

function expectedInsuranceLineItem() {
    return {
        name: "Insurance 2 years",
        quantity: 1,
        unitPrice: 899,
        vatPercentage: 0.25,
        salesTaxPercentage: null,
        productId: "p-insurance-2y",
        imei: null,
        discounts: null,
        isExternalProduct: false,
        userId: null,
        contributingUsers: null,
        productVariantId: "v-2y",
        addons: null
    };
}

function cameraLineItem(addons) {
    return new POSConnector.LineItem("Camera X100", 1, 12000, 0.25, null, "p-camera", null, null, false, null, null, "v-black", addons);
}

// Stands in for the POS: collects the messages the library posts to `window.webkit.messageHandlers.POS`
function messagesPostedToPOS(action) {
    var postedMessages = [];
    global.window = {
        webkit: {
            messageHandlers: {
                POS: {
                    postMessage: function (message) {
                        postedMessages.push(message);
                    }
                }
            }
        },
        // The library only sends once its object path resolves to an object that can receive messages
        POSConnector: {
            receiveMessage: function () {}
        }
    };
    try {
        action();
    } finally {
        delete global.window;
    }
    return postedMessages;
}

test("LineItem without addons is unchanged apart from addons being null", function () {
    assert.deepEqual(cameraLineItem(), {
        name: "Camera X100",
        quantity: 1,
        unitPrice: 12000,
        vatPercentage: 0.25,
        salesTaxPercentage: null,
        productId: "p-camera",
        imei: null,
        discounts: null,
        isExternalProduct: false,
        userId: null,
        contributingUsers: null,
        productVariantId: "v-black",
        addons: null
    });
});

test("LineItem returns its addons, each one a complete line item", function () {
    assert.deepEqual(cameraLineItem([insuranceLineItem()]).addons, [expectedInsuranceLineItem()]);
});

test("LineItem keeps its addons in the order they were given", function () {
    var theftCover = new POSConnector.LineItem("Theft cover", 1, 499);
    var addonNames = cameraLineItem([insuranceLineItem(), theftCover]).addons.map(function (addon) {
        return addon.name;
    });
    assert.deepEqual(addonNames, ["Insurance 2 years", "Theft cover"]);
});

test("LineItem turns an empty addons array or a value that is not an array into null", function () {
    [[], undefined, null, "Insurance", 5, true, {}].forEach(function (addons) {
        assert.strictEqual(cameraLineItem(addons).addons, null, "addons " + util.inspect(addons) + " should become null");
    });
});

test("LineItem rejects an addon that has addons of its own", function () {
    var extendedInsurance = new POSConnector.LineItem("Extended insurance", 1, 199);
    var insuranceWithAddon = new POSConnector.LineItem("Insurance 2 years", 1, 899, null, null, null, null, null, false, null, null, null, [extendedInsurance]);
    assert.throws(function () {
        cameraLineItem([insuranceWithAddon]);
    }, {name: "Error", message: /Insurance 2 years/});
});

test("LineItem accepts an addon whose own addons array is empty", function () {
    var insurance = Object.assign(insuranceLineItem(), {addons: []});
    assert.strictEqual(cameraLineItem([insurance]).addons.length, 1);
});

test("payBasket sends the addons of a line item to the POS", function () {
    var basket = new POSConnector.Basket("basket-1", [cameraLineItem([insuranceLineItem()]), cameraLineItem()]);

    var messages = messagesPostedToPOS(function () {
        POSConnector.payBasket(basket, function () {});
    });

    assert.strictEqual(messages.length, 1);
    assert.strictEqual(messages[0].name, "PayBasket");
    // The serialised form is what the POS decodes
    var lineItems = JSON.parse(JSON.stringify(messages[0].body.basket.lineItems));
    assert.deepEqual(lineItems[0].addons, [expectedInsuranceLineItem()]);
    assert.strictEqual(lineItems[1].addons, null);
});

if (failureCount > 0) {
    console.log("\n" + failureCount + " check(s) failed");
    process.exitCode = 1;
} else {
    console.log("\nAll checks passed");
}
