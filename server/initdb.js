db.products.drop()
db.orders.drop()
db.users.drop()

db.products.insertMany([
  {
    name: "KeyboardCombo",
    price: 33,
    quantity: 0,
    filters: ["tech", "gifts"],
    imageUrl: "http://localhost:5000/images/KeyboardCombo.png"
  },
  {
    name: "Mice",
    price: 5,
    quantity: 9,
    filters: ["tech", "gifts"],
    imageUrl: "http://localhost:5000/images/Mice.png"
  },
  {
    name: "PC1",
    price: 341,
    quantity: 2,
    filters: ["tech"],
    imageUrl: "http://localhost:5000/images/PC1.png"
  },
  {
    name: "PC2",
    price: 362,
    quantity: 3,
    filters: ["tech"],
    imageUrl: "http://localhost:5000/images/PC2.png"
  },
  {
    name: "PC3",
    price: 379,
    quantity: 7,
    filters: ["tech"],
    imageUrl: "http://localhost:5000/images/PC3.png"
  },
  {
    name: "Tent",
    price: 34,
    quantity: 2,
    filters: ["supplies"],
    imageUrl: "http://localhost:5000/images/Tent.png"
  },
  {
    name: "Box1",
    price: 6,
    quantity: 5,
    filters: ["supplies", "stationary"],
    imageUrl: "http://localhost:5000/images/Box1.png"
  },
  {
    name: "Box2",
    price: 5,
    quantity: 2,
    filters: ["supplies", "stationary"],
    imageUrl: "http://localhost:5000/images/Box2.png"
  },
  {
    name: "Clothes1",
    price: 27,
    quantity: 0,
    filters: ["clothes", "gifts"],
    imageUrl: "http://localhost:5000/images/Clothes1.png"
  },
  {
    name: "Clothes2",
    price: 25,
    quantity: 8,
    filters: ["clothes", "gifts"],
    imageUrl: "http://localhost:5000/images/Clothes2.png"
  },
  {
    name: "Jeans",
    price: 33,
    quantity: 3,
    filters: ["clothes", "gifts"],
    imageUrl: "http://localhost:5000/images/Jeans.png"
  },
  {
    name: "Keyboard",
    price: 21,
    quantity: 6,
    filters: ["tech", "gifts"],
    imageUrl: "http://localhost:5000/images/Keyboard.png"
  }
])

db.orders.insertOne(
  {
    cart: "json string for cart object",
    total: 117
  }
)

db.users.insertMany([
  {
    token: "Xoe2inasd"
  },
  {
    token: "1"
  },
  {
    token: "2"
  },
  {
    token: "3"
  },
  {
    token: "13"
  },
  {
    token: "12"
  },
  {
    token: "23"
  },
  {
    token: "123"
  },
])
