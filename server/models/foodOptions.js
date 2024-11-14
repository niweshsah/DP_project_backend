const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  EndTime: {
    type: Date,
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
