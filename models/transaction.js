const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  item:String,
  moneyGiven:Number,
  changeRecieved:Number,
  timeStamp:Date
})

const transaction = mongoose.model('transaction', transactionSchema)

module.exports = transaction;
