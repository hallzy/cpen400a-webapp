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

// Get the total amount of items that are in the cart altogether
Cart.prototype.getTotalQuantity = function() {
  total = 0;
  for (var item in this.items) {
    total += cart.items[item];
  }
  return total;
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

  setupCartModal();
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

  // Reset the Modal so that all the items are removed from the show cart view
  // and then do our add action
  resetCartUsingTemplates();
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
  // Now populate our Modal
  populateCartModal();
}

// Remove item from the cart
function removeFromCart(productName) {
  // Clear the timeout because the user has made an action.
  clearInterval(timer);

  // Reset the Modal so that all the items are removed from the show cart view
  // and then do our remove action
  resetCartUsingTemplates();
  // Only remove the item from the cart, if that item actually exists in the
  // cart already.
  if (cart.items[productName.product.name] != undefined) {
    // Remove it from the cart.
    cart.items[productName.product.name]--;
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
  // Now populate our Modal
  populateCartModal();
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

      generateProductsUsingTemplates(name, image, price);
    }
  }
  else {
    alert("Your browser does not appear to support <template> tags");
  }
}

// Create the products blocks in HTML using the template that exists in the html
// file already.
function generateProductsUsingTemplates(name, image, price) {
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

function setupCartModal() {
  var modal = document.getElementById('cartModal');
  var btn = document.getElementById("show_cart");
  var span = document.getElementsByClassName("close")[0];

  // If the show cart button is pressed, then populate the modal and display it
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // If the X button is pressed, then unpopulate the cart modal and hide it.
  span.onclick = function() {
    modal.style.display = "none";
  }

  // If any part of the page outside of the modal is clicked, then unpopulate
  // the cart modal and hide it.
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  // If the escape key is pressed, then unpopulate the cart modal and hide it.
  document.onkeydown = function(key) {
    // 27 is the key for the escape button
    if (key.keyCode == 27) {
      modal.style.display = "none";
    }
  }
}

function populateCartModal() {
  // If templates work, use them... Otherwise, display an alert
  if ('content' in document.createElement('template')) {
    // Iterate through every product that we have in the cart and create an html
    // block for them so relevant info is available in the cart.
    for (item in cart.items) {
      // we will be using these to generate the html tags
      var name  = products[item].product.name;
      var quantity = cart.items[item];
      var unit_price = products[item].product.price;

      populateCartUsingTemplates(name, quantity, unit_price);
    }
    // After iterating through all of the products in the cart, add in the last
    // line which is the subtotal.
    var content = document.querySelector('#cartTemplate').content;
    content.querySelector('.temp').id = "subtotal";
    content.querySelector('.cart-item-title').textContent = "";
    // content.querySelector('.cart-inc-dec').textContent = "";
    content.querySelector('.cart-item-quantity').textContent = "";
    content.querySelector('.cart-item-unit-price').textContent = "Sub Total:";
    content.querySelector('.cart-item-total-price').textContent = "$" +
      cart.price;
    document.querySelector('#cart_items').appendChild( document.importNode(
      content, true));
  }
  else {
    alert("Your browser does not appear to support <template> tags");
  }
}

// Create blocks of HTML for the cart modal using the template that exists in
// the html file already.
function populateCartUsingTemplates(name, quantity, unit_price) {
  // Get the content of the template (ie, the actual stuff that has been
  // templated)
  var content = document.querySelector('#cartTemplate').content;

  // Find an element in the template, and set attributes that need to change.
  content.querySelector('.temp').id = name + "_row";
  content.querySelector('.cart-item-title').textContent = name;
  content.querySelector('.cart-item-quantity').textContent = quantity;
  content.querySelector('.cart-item-unit-price').textContent = "$" +
    unit_price.toFixed(2);
  var price = products[item].product.computeNetPrice(cart.items[item]);
  content.querySelector('.cart-item-total-price').textContent = "$" +
    price.toFixed(2);

  // Setup a special id for each button that contains the name of the item that
  // we are incrementing or decrementing. I will use this special id as
  // reference for the onclick event
  content.querySelector('.inc_button').id = "inc_" + name + "_id"
  content.querySelector('.dec_button').id = "dec_" + name + "_id"

  // Duplicate the contents of the template and append it to the productList
  document.querySelector('#cart_items').appendChild( document.importNode(
    content, true));

  // On Clicking the button, we are going to run the addToCart() function with
  // with the current item as an argument, so we know what we are adding.
  var incButton = document.getElementById("inc_" + name + "_id");
  // NOTE: the closure is essential for this to work correctly.
  // I need to execute the outer function with the product name as an argument
  // so I can pass it to the function, but I don't want to add anything yet.
  incButton.onclick = function(name) {
    return function() {
      addToCart(name)
      setupCartModal();
    }
  }(products[name]);

  // On Clicking the button, we are going to run the addToCart() function with
  // with the current item as an argument, so we know what we are adding.
  var decButton = document.getElementById("dec_" + name + "_id");
  decButton.onclick = function(name) {
    return function() {
      removeFromCart(name)
      setupCartModal();
    }
  }(products[name]);
}

function resetCartUsingTemplates() {
  // Remove the specified element.
  Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
  }

  for (item in cart.items) {
    // we will be using these to generate the html tags
    var name  = products[item].product.name;
    // Find an element in the template, and set attributes that need to change.
    // Try it, but if it doesn' work, I don't care, because the item doesn't
    // exist anymore anyways.
    try {
      document.getElementById(name + '_row').remove();
    } catch (e) { }
  }
  // Try it, but if it doesn' work, I don't care, because the item doesn't
  // exist anymore anyways.
  try {
    document.getElementById("subtotal").remove();
  } catch (e) { }
}
