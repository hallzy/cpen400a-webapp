var express = require('express')
var app = express()

var MongoClient = require('mongodb').MongoClient
var db_url = "mongodb://localhost:27017/test"

var appHost = 'https://cpen400a-bookstore.herokuapp.com/'; //hard-coded host url (should really be defined in a separate config)

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// var products = {
//   'KeyboardCombo' : {
//   name: 'KeyboardCombo',
//     price : getRandomInt(25,35),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/KeyboardCombo.png'
//   },
//   'Mice' : {
//   name: 'Mice',
//     price : getRandomInt(5,7),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/Mice.png'
//   },
//   'PC1' : {
//   name: 'PC1',
//     price : getRandomInt(300,350),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/PC1.png'
//   },
//   'PC2' : {
//   name: 'PC2',
//     price : getRandomInt(350,400),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/PC2.png'
//   },
//   'PC3' : {
//   name: 'PC3',
//     price : getRandomInt(330,380),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/PC3.png'
//   },
//   'Tent' : {
//   name: 'Tent',
//     price : getRandomInt(30,40),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/Tent.png'
//   },
//   'Box1' : {
//   name: 'Box1',
//     price : getRandomInt(5,7),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/Box1.png'
//   },
//   'Box2' : {
//   name: 'Box2',
//     price : getRandomInt(5,7),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/Box2.png'
//   },
//   'Clothes1' : {
//   name: 'Clothes1',
//     price : getRandomInt(20,30),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/Clothes1.png'
//   },
//   'Clothes2' : {
//   name: 'Clothes2',
//     price : getRandomInt(20,30),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/Clothes2.png'
//   },
//   'Jeans' : {
//   name: 'Jeans',
//     price : getRandomInt(30,40),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/Jeans.png'
//   },
//   'Keyboard' : {
//   name: 'Keyboard',
//     price : getRandomInt(15,25),
//     quantity : getRandomInt(0,10),
//     imageUrl: appHost+'images/Keyboard.png'
//   }
// };

app.get('/products/:filter/:user_token', function(request, response) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var req_filter = request.params.filter
  var user_token = request.params.user_token

  var products_obj = "{"
  var added_at_least_one = false
  MongoClient.connect(db_url, function(err, db) {
    if (err) throw error;

    // Make sure the user token exists
    db.collection("users").find({ "token": user_token }).toArray(function(err, result) {
      if (err) throw error;
      if (!result) {
        response.status(500).send("No Matches");
      }
      else if (result.length > 1) {
        response.status(500).send("User Token Matches multiple times");
      }
      else if (result.length != 1) {
        console.log(JSON.stringify(result))
        response.status(500).send("User Token not found");
      }
      else {
        console.log(JSON.stringify(result))
        db.collection("products").find({}).toArray(function(err, result) {
          if (err) throw err
          for (var i in result) {
            var product_filters = result[i].filters
            if (product_filters.indexOf(req_filter) > -1 || req_filter == "all") {
              if (added_at_least_one == true) products_obj += ','
              var name = result[i].name
              var price = result[i].price
              var quantity = result[i].quantity
              var imageUrl = result[i].imageUrl
              products_obj += '"' + name + '":{"name":"' + name + '","price":'
              products_obj += price + ',"quantity":' + quantity + ',"imageUrl":"'
              products_obj += imageUrl + '"}'
              added_at_least_one = true
            }
          }
          products_obj += '}'
          response.json(JSON.parse(products_obj))
        })
      }
    })
  })
})

app.get('/products/:min/:max/:user_token', function(request, response) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var min = request.params.min
  var max = request.params.max
  var user_token = request.params.user_token

  if (isNaN(min) || isNaN(max)) {
    response.status(500).send("Bounds were not numbers");
  }

  min = Number(min)
  max = Number(max)

  if (min > max) {
    response.status(500).send("Min is Greater than the Max bound");
  }

  var products_obj = "{"
  var added_at_least_one = false
  MongoClient.connect(db_url, function(err, db) {
    if (err) throw error;

    // Make sure the user token exists
    db.collection("users").find({ "token": user_token }).toArray(function(err, result) {
      if (err) throw error;
      if (!result) {
        response.status(500).send("No Matches");
      }
      else if (result.length > 1) {
        response.status(500).send("User Token Matches multiple times");
      }
      else if (result.length != 1) {
        console.log(JSON.stringify(result))
        response.status(500).send("User Token not found");
      }
      else {
        db.collection("products").find({}).toArray(function(err, result) {
          if (err) throw err
          for (var i in result) {
            var price = result[i].price
            if (price < min || price > max) {
              // skip
              continue
            }
            if (added_at_least_one == true) products_obj += ','
            var name = result[i].name
            var quantity = result[i].quantity
            var imageUrl = result[i].imageUrl
            products_obj += '"' + name + '":{"name":"' + name + '","price":'
            products_obj += price + ',"quantity":' + quantity + ',"imageUrl":"'
            products_obj += imageUrl + '"}'
            added_at_least_one = true
          }
          products_obj += '}'
          response.json(JSON.parse(products_obj))
        })
      }
    })
  })
})

app.post('/checkout', function(request, response) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var cart = JSON.parse(request.body.cart);
  var req_filter = request.body.filter;
  var user_token = request.body.user_token;
  console.log("TOKEN " + user_token)

  // Send back the new database values
  var products_obj = "{"
  var added_at_least_one = false
  MongoClient.connect(db_url, function(err, db) {
    if (err) throw error;

    // Make sure the user token exists
    db.collection("users").find({ "token": user_token }).toArray(function(err, result) {
      if (err) throw error;
      if (!result) {
        response.status(500).send("No Matches");
      }
      else if (result.length > 1) {
        response.status(500).send("User Token Matches multiple times");
      }
      else if (result.length != 1) {
        console.log(JSON.stringify(result))
        response.status(500).send("User Token not found");
      }
      else {
        var myobj = { "cart": JSON.stringify(cart.items), "total": cart.price  };
        db.collection("orders").insertOne(myobj, function(err, result) {
          if (err) throw err
        })
        db.collection("products").find({}).toArray(function(err, result) {
          if (err) throw err
          for (var i in result) {
            var product_filters = result[i].filters
            var r_name = result[i].name
            var r_price = result[i].price
            var r_quantity = result[i].quantity
            var r_imageUrl = result[i].imageUrl
            if (cart.items[r_name]) {
              // it exists in the cart, so bring the quantity down
              r_quantity -= cart.items[r_name]
              var myquery = { "name": r_name };
              var newvalues = { $set : {"quantity": r_quantity} };
              db.collection("products").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
              });
            }
            if (product_filters.indexOf(req_filter) > -1 || req_filter == "all") {
              if (added_at_least_one == true) products_obj += ','
              products_obj += '"' + r_name + '":{"name":"' + r_name + '","price":'
              products_obj += r_price + ',"quantity":' + r_quantity + ',"imageUrl":"'
              products_obj += r_imageUrl + '"}'
              added_at_least_one = true
            }

          }
          products_obj += '}'
          response.json(JSON.parse(products_obj))
        })
      }
    })
  })
})

// app.get('/products/:productKey', function(request, response) {

//   response.header("Access-Control-Allow-Origin", "*");
//   response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   var option = getRandomInt(0,5);
//   if (option < 4) {
//     if (request.params.productKey in products){
//       response.json(products[request.params.productKey]);
//     }
//     else {
//       response.status(404).send("Product does not exist");
//     }
//   } else if (option == 4) {
//     response.status(500).send("An error occurred, please try again");
//   }
// })

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
