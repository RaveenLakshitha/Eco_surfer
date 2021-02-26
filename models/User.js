//Create schema of fields
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requiered: [true, "Please add a Name"],
    trim: true,
    maxlength: [20, "Name cannot be more than 20 characters"]
  },
  slug: String,
  bio: {
    type: String,
    requiered: [true, "Please add a Name"],
    trim: true,
    maxlength: [20, "Name cannot be more than 20 characters"]
  },
  phone: {
    type: String,
    maxlength: [15, "Phone number can not be longer than 15 characters"]
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile_pic: {
    type: String,
    default: "no-photo.jpg"
  },
  gender: {
    type: String,
    requiered: [true, "Please choose your Gender"]
  },
  address: {
    type: String,
    requiered: [true, "Please add an Address"]
  },
  formattedAddress: String,
  city: String,
  country: String,
  leaderBoardPoints: {
    type: Number
  }
});

module.exports = mongoose.model("User", userSchema);
