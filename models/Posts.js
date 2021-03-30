const mongoose = require("mongoose");
const Reaction = require("./Reaction");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: [true, "Please add a Caption"],
    trim: true,
    maxlength: [100, "Name cannot be more than 50 characters"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String,
    default: "no-photo.jpg"
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  slug: String
});

//Method to get avg rating and save
postSchema.statics.getAverageRating = async function(id) {
  const obj = await this.aggregate([
    {
      $match: { user: id }
    },
    {
      $group: {
        _id: "$user",
        leaderBoardPoints: { $avg: "$averageRating" }
      }
    }
  ]);

   try {
    await this.model("User").findByIdAndUpdate(id, {
      leaderBoardPoints: obj[0].leaderBoardPoints
      // leaderBoardPoints: 8
    });
  } catch (err) {
    console.error(err);
  } 
  console.log(obj);
  console.log("raveen ooka hari");
};

//  getAveragerating after save
postSchema.post("save", function() {
  this.constructor.getAverageRating(this.user);
});

//  getAveragerating before remove
postSchema.pre("remove", function() {
  this.constructor.getAverageRating(this.user);
});

module.exports = mongoose.model("Posts", postSchema);
