const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: [true, "Please add a Caption"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: "no-photo.jpg"
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
  }
});

module.exports = mongoose.model("Post", postSchema);
