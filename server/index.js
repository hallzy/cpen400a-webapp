var express = require('express')
var app = express()

var MongoClient = require('mongodb').MongoClient
var db_url = "mongodb://localhost:27017/test"

var appHost = 'https://cpen400a-bookstore.herokuapp.com/';

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
        response.status(500).send("User Token not found");
      }
      else {
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

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
