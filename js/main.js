var cart = [];
cart["Box1"]          = 0;
cart["Box2"]          = 0;
cart["Clothes1"]      = 0;
cart["Clothes2"]      = 0;
cart["Jeans"]         = 0;
cart["Keyboard"]      = 0;
cart["KeyboardCombo"] = 0;
cart["Mice"]          = 0;
cart["PC1"]           = 0;
cart["PC2"]           = 0;
cart["PC3"]           = 0;
cart["Tent"]          = 0;

var products = [];
products["Box1"]          = 10;
products["Box2"]          = 10;
products["Clothes1"]      = 10;
products["Clothes2"]      = 10;
products["Jeans"]         = 10;
products["Keyboard"]      = 10;
products["KeyboardCombo"] = 10;
products["Mice"]          = 10;
products["PC1"]           = 10;
products["PC2"]           = 10;
products["PC3"]           = 10;
products["Tent"]          = 10;

function setTimer(seconds) {
  timer = setTimeout(function() {
    return alert("Hey there! Are you still planning to buy something?");
  }, seconds*1000);
}

var timerLength = 30;
var timer = setTimer(timerLength);

function resetTimer(seconds) {
  clearTimeout(timer);
  timer = setTimer(seconds);
}

function addToCart(productName) {
  clearTimeout(timer);
  if (products[productName] > 0) {
    cart[productName]++;
    products[productName]--;
  }
  resetTimer(timerLength);
  console.log(cart)
  console.log(products)
}

function removeFromCart(productName) {
  clearTimeout(timer);
  if (cart[productName] > 0) {
    cart[productName]--;
    products[productName]++;
  }
  resetTimer(timerLength);
  console.log(cart)
  console.log(products)
}
