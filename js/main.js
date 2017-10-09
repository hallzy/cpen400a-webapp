// *****************************************************************************
// ***   Variable Declarations
// *****************************************************************************

// Set this to true to get some useful console outputs
const debug = true;

// Current user's cart (initially, empty).
var cart = [];

// Overall stock of all items
var products = [];
products.Box1          = 5;
products.Box2          = 5;
products.Clothes1      = 5;
products.Clothes2      = 5;
products.Jeans         = 5;
products.Keyboard      = 5;
products.KeyboardCombo = 5;
products.Mice          = 5;
products.PC1           = 5;
products.PC2           = 5;
products.PC3           = 5;
products.Tent          = 5;

var inactiveTime = 0;

// Timeout time is 30 seconds
var inactiveTimeLimit = 30;

// *****************************************************************************
// ***   Function Declarations
// *****************************************************************************

// My timer declaration
var customTimer = function(inactiveTimeLimit) {
  this.timer;

  // if a value was passed, use it, otherwise default to 30
  if (inactiveTimeLimit == undefined) {
    this.inactiveTimeLimit = 30;
  }
  else {
    this.inactiveTimeLimit = inactiveTimeLimit;
  }

  this.set = function() {
    var that = this;
    // Set an interval timer for 1 second intervals. Every 1 second, call the
    // checkInactivity Function
    var checkInactivity = function() {
      inactiveTime++;
      // If inactiveTimeLimit seconds has passed then give an alert and reset
      // the timer and the timer
      if (inactiveTime >= that.inactiveTimeLimit) {
        clearInterval(that.timer);
        alert("Hey there! Are you still planning to buy something?");
        that.reset();
      }
    }
    this.timer = setInterval(checkInactivity, 1000);
  }
  // Reset the inactivity Timer
  this.reset = function() {
    clearInterval(this.timer);
    this.set();
    inactiveTime = 0;
  }
};

// Add the item to the users cart.
function addToCart(productName) {
  // Clear the timeout because the user has made an action.
  clearInterval(timer);

  // Only add the item if we have stock left
  if (products[productName] > 0) {
    // If the item is not already in the cart, then add it and set the quantity
    // to 1
    if (cart[productName] == undefined) {
      cart[productName] = 1;
    }
    // Otherwise, it is already in the cart, so just increment the quantity of
    // the item.
    else {
      cart[productName]++;
    }
    // Now reduce the overall stock of the item because it is now in someones
    // cart.
    alert("Item added in your cart!");
    products[productName]--;
  }
  // Reset the Timer now that we are done.
  timer.reset();

  // output the current state of the product stock and cart if we are debugging.
  if (debug) {
    console.log(cart)
    console.log(products)
  }
}

// Remove item from the cart
function removeFromCart(productName) {
  // Clear the timeout because the user has made an action.
  clearInterval(timer);

  // Only remove the item from the cart, if that item actually exists in the
  // cart already.
  if (cart[productName] != undefined) {
    // Remove it from the cart.
    cart[productName]--;
    alert("Item removed from your cart!");
    // Add it to the total stock
    products[productName]++;
    // If the cart now has 0 of that item, then delete it from the cart
    // completely.
    if (cart[productName] == 0) {
      delete cart[productName];
    }
  }
  // If the item doesn't exist, then give an alert to the user
  else {
    alert("That item isn't in your cart!");
  }
  // Reset the Timer now that we are done.
  timer.reset();

  // output the current state of the product stock and cart if we are debugging.
  if (debug) {
    console.log(cart)
    console.log(products)
  }
}

// Show the contents of the cart
function showCart() {
  // This will be the message we will put into the alert
  var message = "";
  // Iterate through the cart
  for (var productName in cart) {
    // Form the message for each element in the cart
    message += productName + ": " + cart[productName] + "\n";
  }
  // If after all this, the message is emtpy then our cart must be empty.
  if (message == "") {
    alert("Your Cart is Empty!");
  }
  else {
    // Produce an alert.
    alert(message);
  }
}


// *****************************************************************************
// ***   Function Executions
// *****************************************************************************

// Set the timer to start running
var timer = new customTimer(inactiveTimeLimit);
timer.set();
