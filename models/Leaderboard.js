const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a Name"],
    unique: true,
    trim: true,
    maxlength: [20, "Name cannot be more than 20 characters"]
  },

  leaderBoardPoints: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Post", leaderboardSchema);
