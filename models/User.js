const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const posts = require("./Posts");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a Name"],
      trim: true,
      maxlength: [20, "Name cannot be more than 20 characters"]
    },
    bio: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email"
      ]
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 6,
      select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    gender: {
      type: String,
      required: [true, "Please select the gender"],
      enum: ["Male", "Female"],
      default: "Male"
    },
    leaderBoardPoints: {
      type: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Posts",
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Encrypt password using bycrypt
userSchema.pre("save", async function(next) {
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

//Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

//MAtch user entered password to hashed password in db
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

// Cascade delete posts when a user is deleted
userSchema.pre("remove", async function(next) {
  console.log(`Posts being removed of the user ${this._id}`);
  await this.model(posts).deleteMany({ post: this._id });
  next();
});

//Reverse populate with virtuals
userSchema.virtual("posts", {
  ref: posts,
  localField: "_id",
  foreignField: "user",
  justOne: false
});

module.exports = mongoose.model("User", userSchema);
