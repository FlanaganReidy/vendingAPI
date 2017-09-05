const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name:{type:String, unique:true, required:true},
  cost:Number,
  quantity:Number
})


const anItem = mongoose.model('anItem', itemSchema)

module.exports = anItem;
