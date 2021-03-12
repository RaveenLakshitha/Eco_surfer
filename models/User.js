//Create schema of fields
const mongoose = require("mongoose");
const slugify = require("slugify");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a Name"],
      trim: true,
      maxlength: [20, "Name cannot be more than 20 characters"]
    },
    slug: String,
    bio: {
      type: String,
      required: [true, "Please add a Name"],
      trim: true,
      maxlength: [20, "Name cannot be more than 20 characters"]
    },
    phone: {
      type: String,
      maxlength: [15, "Phone number can not be longer than 15 characters"]
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 6,
      select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

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
      required: [true, "Please choose your Gender"]
    },
    address: {
      type: String,
      required: [true, "Please add an Address"]
    },
    formattedAddress: String,
    city: String,
    country: String,
    leaderBoardPoints: {
      type: Number
    }

    /* ,
    posts: {
      type: mongoose.Schema.ObjectId,
      ref: "Posts",
      required: true
    } */
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Crate user slug from name
userSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Encrypt password using bycrypt
userSchema.pre("save", async function(next) {
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

//MAtch user entered password to hashed password in db
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

//Sign JWT and return
userSchema.methods.getSignedJWTtoken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

/* //Cascade delete when a user is deleted
userSchema.pre("remove", async function(next) {
  console.log(`Posts beign removed from user ${this.id}`);
  await this.model("Posts").deleteMany({ user: this._id });
  next();
}); */

/* //Reverse populate with virtuals
userSchema.virtual("posts", {
  ref: "Posts",
  localField: "_id",
  foreignField: "user",
  justOne: false
}); */

module.exports = mongoose.model("User", userSchema);
