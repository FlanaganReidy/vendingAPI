const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/item.js');
const Transaction = require('./models/transaction.js')
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/vendingmachine');

let app = express();

app.use(bodyParser.json());

app.get('/api/customer/items', function(req,res){
  Item.find().then(function(results){
    res.json({status:'success', 'data':results});
  })
})

app.post('/api/vendor/items', function(req,res){

  console.log(req.body);

  const item = new Item({
    name: req.body.name,
    cost: req.body.cost,
    quantity: req.body.quantity
  })
  item.save().then(function(){
    res.json({'status':'success'})
  })
})

app.post('/api/customer/items/:itemId/purchases', function(req,res){
  let id = req.params.itemId;
  Item.findOneAndUpdate({_id: new ObjectId(id)}, {$inc:{quantity:-1}})
  .then(function(results){
    const transaction = new Transaction({
      item:results.name,
      moneyGiven:req.body.moneyGiven,
      changeRecieved:req.body.moneyGiven-results.cost,
      timeStamp:Date.now()
    })
    transaction.save().then(function(){
      res.json({'status':'success'})
    })
  })
})

app.get('/api/vendor/purchases', function(req,res){
  Transaction.find().then(function(results){
    res.json({'status':'success', 'data':results)
  })
})

app.post('/api/vendor/items/:itemId', function(req,res){
  let id = req.params.itemId;
  Item.findOneAndUpdate({_id:new ObjectId(id)}, $set:{name:req.body.name, cost:req.body.cost, quantity:req.body.quantity})
  .then(function(){
    res.json({'status':'success'})
  })
})

app.listen(3000, function() {
  console.log('successfully started Express Application');
})

process.on('SIGINT', function() {
  console.log("\nshutting down");
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});
