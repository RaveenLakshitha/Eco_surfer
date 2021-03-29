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
  rating: {
    type: Number,
    min: 1,
    max: 10
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

//Prevent user from add more than one react
reactSchema.index({ user: 1, post: 1 }, { unique: true });

//Method to get avg rating and save
reactSchema.statics.getAverageRating = async function(id) {
  console.log("Get over here!");
  const obj = await this.aggregate([
    {
      $match: { post: id }
    },
    {
      $group: {
        _id: "$post",
        averageRating: { $avg: "$rating" }
      }
    }
  ]);

  try {
    await this.model("Posts").findByIdAndUpdate(id, {
      averageRating: obj[0].averageRating
    });
  } catch (err) {
    console.error(err);
  }
  console.log(obj);
};

//  getAveragerating after save
reactSchema.post("save", function() {
  console.log("Straight in Here!");
  this.constructor.getAverageRating(this.post);
});

//  getAveragerating before remove
reactSchema.pre("remove", function() {
  console.log("Straight out Here!");
  this.constructor.getAverageRating(this.post);
});

module.exports = mongoose.model("React", reactSchema);
