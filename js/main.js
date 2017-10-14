// *****************************************************************************
// ***   Variable Declarations
// *****************************************************************************

// Set this to true to get some useful console outputs
const debug = true;

// Current user's cart (initially, empty).
var Cart = function() {
  this.price = 0;
  this.items = [];
}
var cart = new Cart();

var Product = function(name, price, imageUrl) {
  this.name     = name;
  this.price    = price;
  this.imageUrl = imageUrl;
}

// Overall stock of all items
var products = {
  'Box1' : {
    'product'  : new Product('Box1', 10, 'images/products/Box1_$10.png'),
    'quantity' : 5
  },
  'Box2' : {
    'product'  : new Product('Box2', 5, 'images/products/Box2_$5.png'),
    'quantity' : 5
  },
  'Clothes1' : {
    'product'  : new Product('Clothes1', 20, 'images/products/Clothes1_$20.png'),
    'quantity' : 5
  },
  'Clothes2' : {
    'product'  : new Product('Clothes2', 30, 'images/products/Clothes2_$30.png'),
    'quantity' : 5
  },
  'Jeans' : {
    'product'  : new Product('Jeans', 50, 'images/products/Jeans_$50.png'),
    'quantity' : 5
  },
  'Keyboard' : {
    'product'  : new Product('Keyboard', 20, 'images/products/Keyboard_$20.png'),
    'quantity' : 5
  },
  'KeyboardCombo' : {
    'product'  : new Product('KeyboardCombo', 40, 'images/products/KeyboardCombo_$40.png'),
    'quantity' : 5
  },
  'Mice' : {
    'product'  : new Product('Mice', 20, 'images/products/Mice_$20.png'),
    'quantity' : 5
  },
  'PC1' : {
    'product'  : new Product('PC1', 350, 'images/products/PC1_$350.png'),
    'quantity' : 5
  },
  'PC2' : {
    'product'  : new Product('PC2', 400, 'images/products/PC2_$400.png'),
    'quantity' : 5
  },
  'PC3' : {
    'product'  : new Product('PC3', 300, 'images/products/PC3_$300.png'),
    'quantity' : 5
  },
  'Tent' : {
    'product'  : new Product('Tent', 100, 'images/products/Tent_$100.png'),
    'quantity' : 5
  },
}

var inactiveTime = 0;

// Timeout time is 300 seconds
var inactiveTimeLimit = 300;

// Global Timer variable
var timer;

// *****************************************************************************
// ***   Function Declarations
// *****************************************************************************

window.onload = function() {
  // Set the timer to start running
  updateInactiveTimeFooter();
  timer = new customTimer(inactiveTimeLimit);
  timer.set();

  generateProducts();
}

// Prototype function for Product objects that computes the price of quantity
// number of that item
Product.prototype.computeNetPrice = function(quantity) {
  return this.price * quantity;
}

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
      updateInactiveTimeFooter();
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
    updateInactiveTimeFooter();
  }
};

// Add the item to the users cart.
function addToCart(productName) {
  // Clear the timeout because the user has made an action.
  clearInterval(timer);

  // Only add the item if we have stock left
  if (productName.quantity > 0) {
    // If the item is not already in the cart, then add it and set the quantity
    // to 1
    if (cart.items[productName.product.name] == undefined) {
      cart.items[productName.product.name] = 1;
    }
    // Otherwise, it is already in the cart, so just increment the quantity of
    // the item.
    else {
      cart.items[productName.product.name]++;
    }
    // Now reduce the overall stock of the item because it is now in someones
    // cart.
    alert("Item added in your cart!");
    productName.quantity--;
    updateCartPrice();
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
  if (cart.items[productName.product.name] != undefined) {
    // Remove it from the cart.
    cart.items[productName.product.name]--;
    alert("Item removed from your cart!");
    // Add it to the total stock
    productName.quantity++;
    // If the cart now has 0 of that item, then delete it from the cart
    // completely.
    if (cart.items[productName.product.name] == 0) {
      delete cart.items[productName.product.name];
    }
    updateCartPrice();
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
  for (var productName in cart.items) {
    // Form the message for each element in the cart
    message += productName + ": " + cart.items[productName] + "\n";
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

// Finds the current price of the cart, and redoes the button text
function updateCartPrice() {
  var price = 0;
  for (var item in cart.items) {
    price += products[item].product.computeNetPrice(cart.items[item]);
  }
  // Prices are fixed to 2 decimal places
  cart.price = price.toFixed(2);
  updateCartButton(cart.price);
}

// Just update the text of the show cart button
function updateCartButton(price) {
  var str = "Cart ($"
  str += price + ")";
  document.getElementById("show_cart").textContent = str;
}

function updateInactiveTimeFooter() {
  var str = "Inactivity Time: " + inactiveTime;
  document.getElementById("inactive_time").textContent = str;
}

function generateProducts() {
  // If templates work, use them... Otherwise, display an alert
  if ('content' in document.createElement('template')) {
    // Iterate through every product that we have and create an html block for
    // it so that it displays properly on the page.
    for (item in products) {
      // we will be using these to generate the html tags
      var name  = products[item].product.name;
      var image = products[item].product.imageUrl;
      var price = products[item].product.price;

      useTemplates(name, image, price);
    }
  }
  else {
    alert("Your browser does not appear to support <template> tags");
  }
}

// Create the products blocks in HTML using the template that exists in the html
// file already.
function useTemplates(name, image, price) {
  // Get the content of the template (ie, the actual stuff that has been
  // templated)
  var content = document.querySelector('#productTemplate').content;

  // Find an element in the template, and set attributes that need to change.
  // For example, the item image, item name, item price
  content.querySelector('.product_pic').src = image;
  content.querySelector('.title').textContent = name;
  content.querySelector('.price').textContent = "$" + price.toFixed(2);

  // Setup a special id for each button that contains the name of the item that
  // we are adding or removing. I will use this special id as reference for the
  // onclick event
  content.querySelector('.add_button').id = "add_" + name + "_id"
  content.querySelector('.remove_button').id = "remove_" + name + "_id"

  // Duplicate the contents of the template and append it to the productList
  document.querySelector('#productList').appendChild( document.importNode(
    content, true));

  // On Clicking the button, we are going to run the addToCart() function with
  // with the current item as an argument, so we know what we are adding.
  var addButton = document.getElementById("add_" + name + "_id");
  // NOTE: the closure is essential for this to work correctly.
  // I need to execute the outer function with the product name as an argument
  // so I can pass it to the function, but I don't want to add anything yet.
  addButton.onclick = function(name) {
    return function() {
      addToCart(name)
    }
  }(products[name]);

  // On Clicking the button, we are going to run the addToCart() function with
  // with the current item as an argument, so we know what we are adding.
  var removeButton = document.getElementById("remove_" + name + "_id");
  removeButton.onclick = function(name) {
    return function() {
      removeFromCart(name)
    }
  }(products[name]);
}
