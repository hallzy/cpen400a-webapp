// *****************************************************************************
// ***   Variable Declarations
// *****************************************************************************

// Set this to true to get some useful console outputs
const debug = true;

var inactiveTime = 0;

// USE ONLY ONE OF THE BELOW 3 URLS
// **** Class heroku app ****
const urlForProducts = "https://cpen400a-bookstore.herokuapp.com/products";
// **** Our custom Servers, one on Heroku, one is local ****
// const urlForProducts = "https://secret-beyond-19352.herokuapp.com/products";
// const urlForProducts = "http://localhost:5000/products";

// Timeout time is 300 seconds
var inactiveTimeLimit = 300;

// Global Timer variable
var timer;

// *****************************************************************************
// ***   Object Declarations
// *****************************************************************************
// Remove the specified element.
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

// -------------------------------------
// CART OBJECT
// -------------------------------------
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

// Create a new Cart object
var cart = new Cart();

// -------------------------------------
// PRODUCT OBJECT
// -------------------------------------
var Product = function(name, price, imageUrl) {
  this.name     = name;
  this.price    = price;
  this.imageUrl = imageUrl;
}

// Prototype function for Product objects that computes the price of quantity
// number of that item
Product.prototype.computeNetPrice = function(quantity) {
  return this.price * quantity;
}

// List of Products containing Product objects
var products = {}

// *****************************************************************************
// ***   Function Declarations
// *****************************************************************************

// Do this once the window loads
window.onload = function() {
  // Make the initial ajax request
  ajaxGet(urlForProducts, ajaxSuccess, ajaxFail);

  // Set the timer to start running
  updateInactiveTimeFooter();
  timer = new customTimer(inactiveTimeLimit);
  timer.set();

  // Start with the modal as hidden
  var modal = document.getElementById('cartModal');
  modal.style.display = "none";
  // Dynamically generate the cart modal and get it read to use.
  setupCartModal();
}

// Get the numeric index of the input product
function products_getIndexOf(product) {
  var productName = product.product.name;
  var keys = Object.keys(products);
  for (var i = 0; i < keys.length; i++) {
    if (productName == keys[i]) {
      return i;
    }
  }
}

var failed_ajax_attempts = 0;
// Submit a ajax request to a given URL
function ajaxGet(url, successCallback, errorCallback) {
  var ajaxRequest = new XMLHttpRequest();
  ajaxRequest.open('GET', url, true);
  ajaxRequest.responseType = 'json';
  ajaxRequest.onreadystatechange = function() {
    var ajaxStatus = ajaxRequest.status;
    // if the readyState is 4 that means the operation is done
    if (this.readyState == 4) {
      if (this.status == 200) {
        successCallback(ajaxRequest.response);
        failed_ajax_attempts = 0;
      }
      else {
        failed_ajax_attempts++;
        errorCallback(ajaxRequest.response);
        // If we exceed 10 failed attempts, just kill the ajax request.
        if (failed_ajax_attempts >= 10) {
          alert("Failed to Fetch Products From Server... Retry")
        }
        else {
          // If we still haven't reached the 10 failed attempts, then go again
          ajaxGet(url, successCallback, errorCallback)
        }
      }
    }
  };
  ajaxRequest.send();

  // Set a request timeout
  setTimeout(function() { ajaxRequest.abort() }, 300)
}

function ajaxSuccess(response) {
  console.log("AJAX SUCCESS")

  console.log(response);
  var iteration = 0;
  // Iterate through all the response items so that I can add them to products
  for (item in response) {
    iteration++;
    // we will be using these to generate the html tags
    var name  = response[item].name;
    var image = response[item].imageUrl;
    var price = response[item].price;
    var quantity = response[item].quantity;
    var str = '{"' + name + '":{"product":{"name":"' + name + '","price":' +
              price + ',"imageUrl":"' + image + '"},"quantity":' + quantity +
              '}}'
    // Use the string created and parse it as JSON, then give it to products
    Object.assign(products, JSON.parse(str));
    // Make sure that the product portion of the string gets the Product
    // prototype
    Object.setPrototypeOf(products[name].product, Product.prototype);
  }
  // Generate the products in the DOM after we get all of the response items
  generateProducts();
  return true;
}

function ajaxFail(error) {
  console.log("AJAX ERROR")
  console.log(error);
  return false;
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

  // Set and start the timer
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
function addToCart(product) {
  // Clear the timeout because the user has made an action.
  clearInterval(timer);

  // Reset the Modal so that all the items are removed from the show cart view
  // and then do our add action
  resetCartUsingTemplates();
  // Only add the item if we have stock left
  if (product.quantity > 0) {
    // If the item is not already in the cart, then add it and set the quantity
    // to 1
    if (cart.items[product.product.name] == undefined) {
      cart.items[product.product.name] = 1;
    }
    // Otherwise, it is already in the cart, so just increment the quantity of
    // the item.
    else {
      cart.items[product.product.name]++;
    }
    // Now reduce the overall stock of the item because it is now in someones
    // cart.
    product.quantity--;
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

  // Now figure out what buttons need to be displayed and which don't
  updateAddRemoveButtons(product);
}

// Remove item from the cart
function removeFromCart(product) {
  // Clear the timeout because the user has made an action.
  clearInterval(timer);

  // Reset the Modal so that all the items are removed from the show cart view
  // and then do our remove action
  resetCartUsingTemplates();
  // Only remove the item from the cart, if that item actually exists in the
  // cart already.
  if (cart.items[product.product.name] != undefined) {
    // Remove it from the cart.
    cart.items[product.product.name]--;
    // Add it to the total stock
    product.quantity++;
    // If the cart now has 0 of that item, then delete it from the cart
    // completely.
    if (cart.items[product.product.name] == 0) {
      delete cart.items[product.product.name];
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

  // Now figure out what buttons need to be displayed and which don't
  updateAddRemoveButtons(product);
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

// Generate the HTML to display the products on the webpage
function generateProducts() {
  // If templates work, use them... Otherwise, display an alert
  if ('content' in document.createElement('template')) {
    var domProducts = document.getElementsByClassName('product')
    // Need to get the size now, because everytime we delete an object, the
    // indicies get reset as well... For the same reason, we will only be
    // deleting index 0.
    var size = domProducts.length
    for (var i = 0; i < size; i++) {
      domProducts[0].remove();
    }

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

  // Now figure out what buttons need to be displayed and which don't
  updateAddRemoveButtons(products[name]);
}

// Setup the cart modal and get it ready to be used.
function setupCartModal() {
  var modal = document.getElementById('cartModal');
  var btn = document.getElementById("show_cart");
  var span = document.getElementsByClassName("close")[0];
  var checkoutBtn = document.getElementById("checkout");

  // Closures to hide and show the modal, while also resetting the timer.
  function hideModal() {
    // Only hide if the modal is actually showing right now.
    if (modal.style.display == "block") {
      modal.style.display = "none";
      // Reset the Timer now that we are done.
      timer.reset();
    }
  }
  function showModal() {
    // Only show if the modal is actually hidden right now.
    if (modal.style.display == "none") {
      modal.style.display = "block";
      // Reset the Timer now that we are done.
      timer.reset();
    }
  }

  // If the show cart button is pressed, then display the modal
  btn.onclick = function() {
    showModal();
  }

  // If the X button is pressed, then  hide the modal.
  span.onclick = function() {
    hideModal();
  }

  // If any part of the page outside of the modal is clicked, then  hide the
  // modal.
  window.onclick = function(event) {
    if (event.target == modal) {
      hideModal();
    }
  }

  // Checkout button
  checkoutBtn.onclick = function(name) {
    return function() {
      // When we click the checkout button, then perform an AJAX request and if
      // we succeed, then do the checkout
      ajaxGet(urlForProducts, doCheckout, ajaxFail);
    }
  }();

  // If the escape key is pressed, then hide the modal.
  document.onkeydown = function(key) {
    const ESCAPE_KEYCODE = 27;
    if (key.keyCode == ESCAPE_KEYCODE) {
      hideModal();
    }
  }
}

// Look at the cart, and use it to populate the cart Modal
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

// Remove all items from the Modal. We will do this everytime the state of the
// cart changes so that we can redraw the contents of the modal.
function resetCartUsingTemplates() {
  // Go through all the items in the cart
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
  // Try it to remove the subtotal entry as well, but if it doesn' work, I don't
  // care, because the item doesn't exist anymore anyways.
  try {
    document.getElementById("subtotal").remove();
  } catch (e) { }
}

// Update the state of the Add and Remove Buttons.
// Based on the product stock or cart state, the buttons will need to be hidden
// or moved. That is what this function does.
function updateAddRemoveButtons(product) {
  // Gets an array of ALL remove and add buttons
  var removeButtons =  document.getElementsByClassName("remove_button");
  var addButtons =  document.getElementsByClassName("add_button");

  // Get the index of the product we are currently looking at
  var productname_index = products_getIndexOf(product);

  // set the buttons to the specific product that we are looking at
  var removeButton =  removeButtons[productname_index];
  var addButton =  addButtons[productname_index];

  // If the cart has more than 0 items, display the remove button
  if (cart.items[product.product.name] > 0) {
    removeButton.style.display = "block";
    // Move the button off centre to make room for the remove button
    addButton.style.left = "5px";
  }
  // If there are 0 (or less somehow) items in the cart, remove the "remove"
  // button
  else {
    removeButton.style.display = "none";
    // Move the button to centre
    addButton.style.left = "55px";
  }

  // If there are no products left, then remove the add button, and display "out
  // of stock"
  if (product.quantity <= 0) {
    addButton.style.display = "none";
    // Move the button to centre
    removeButton.style.left = "55px";

    // Also, display out of stock
    var outOfStock =  document.getElementsByClassName("out-of-stock");
    outOfStock[productname_index].style.visibility = "visible";
  }
  // otherwise, if we do have stock left, then display the add button
  else {
    addButton.style.display = "block";
    // Move the button off centre to make room for the remove button
    removeButton.style.left = "105px";

    // Also, now we aren't out of stock
    var outOfStock =  document.getElementsByClassName("out-of-stock");
    outOfStock[productname_index].style.visibility = "hidden";
  }
}

// Do this when the checkout button is pressed
function doCheckout(response) {
  // Temporarily save the products list so that I can cross reference to see if
  // the quantities or prices have changed
  var tempProducts = JSON.parse(JSON.stringify(products));

  // Do all the normal stuff when successful like update the product lists
  ajaxSuccess(response);

  // This will check to see if something has changed that we need to tell the
  // user
  var somethingChanged = false;

  // Message to send to the user which will be populated here
  var alertMessage = ""

  // If the prices changed, alert the user for each product in which the price
  // has changed
  for (var item in cart.items) {
    var new_item_price = products[item].product.price;
    var previous_item_price = tempProducts[item].product.price;

    if (new_item_price > previous_item_price) {
      somethingChanged = true;
      alertMessage += "\"" + item + "\" has increased from $" +
                   previous_item_price.toFixed(2) + " to $" +
                   new_item_price.toFixed(2) + "\n"
      console.log("The price for \"" + item + "\" has increased from $" +
                   previous_item_price.toFixed(2) + " to $" +
                   new_item_price.toFixed(2))
    }
    if (new_item_price < previous_item_price) {
      somethingChanged = true;
      alertMessage += "\"" + item + "\" has decreased from $" +
                   previous_item_price.toFixed(2) + " to $" +
                  new_item_price.toFixed(2) + "\n"
      console.log("The price for \"" + item + "\" has decreased from $" +
                   previous_item_price.toFixed(2) + " to $" +
                  new_item_price.toFixed(2))
    }
    // Update the button visuals
    updateAddRemoveButtons(products[item])
  }

  // Place a newline in the alert message so that we can separate the quantity
  // updates from the price updates
  alertMessage += "\n"

  // If the quantity is no longer available then change the number of that
  // product in the cart to the now available quantity and alert the user
  for (var item in cart.items) {
    var new_item_quantity = products[item].quantity;
    var previous_item_quantity = cart.items[item] + tempProducts[item].quantity;
    var previous_cart_quantity = cart.items[item]

    // The cart will now have either the number of items that was in the cart
    // previously, or whatever the current total products are. whichever is
    // lower.
    cart.items[item] = Math.min(cart.items[item], products[item].quantity)

    // Update the number of total products by taking away what was in the cart.
    products[item].quantity -= cart.items[item]

    if (new_item_quantity > previous_item_quantity) {
      console.log("The stock of \"" + item + "\" has increased from " +
                   previous_item_quantity + " to " +
                   new_item_quantity)
    }
    if (new_item_quantity < previous_item_quantity) {
      // If I had to reduce the number of of this item in the cart let the user
      // know
      if (cart.items[item] < previous_cart_quantity) {
        somethingChanged = true;
        alertMessage += "\"" + item + "\" stock has been reduced from " +
          previous_item_quantity + " to " + new_item_quantity + "\n"
          cart.items[item]
      }
      console.log("The stock of \"" + item + "\" has decreased from " +
                   previous_item_quantity + " to " +
                  new_item_quantity)
    }
    updateAddRemoveButtons(products[item])
  }

  // Reset the cart Modal so that it is empty
  resetCartUsingTemplates();

  // Remove the items that have 0 quantity
  for (var item in cart.items) {
    if (cart.items[item] <= 0) {
      delete cart.items[item]
    }
  }

  // Update the cart
  updateCartPrice()
  populateCartModal();

  // Create the message if nothing changed
  if (!somethingChanged) {
    alertMessage = "Confirming the Total Price and Availability:\n\n\n"
    alertMessage += "Total is $" + cart.price + "\n\n"
    for (var item in cart.items) {
      alertMessage += "\"" + item + "\" has quantity of " +
                       cart.items[item] + "\n"
    }
  }
  // Make the alerts
  alert(alertMessage)
  alert("Total due is $" + cart.price)

  // if we press the checkout button reset the timer
  timer.reset()
}
