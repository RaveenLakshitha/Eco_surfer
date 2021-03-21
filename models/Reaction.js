const mongoose = require("mongoose");

const reactSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  react_rating: {
    type: Number,
    min: [1],
    max: [3]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Posts",
    required: true
  }
});

module.exports = mongoose.model("React", reactSchema);
