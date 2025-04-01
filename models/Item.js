// models/Item.js
const mongoose = require('mongoose');

// Define the schema for the lost item
const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  image: { type: String }, // Optional for storing image URL or path
});

// Create a model for the item
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
