const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const Post = require("../models/Posts");
const User = require("../models/User");

//@desc         Get all posts
//@route        Get /api/v1/posts
//@route        Get /api/v1/users/:userId/posts
//@access       public

exports.getPosts = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.userId) {
    query = Post.find({ user: req.params.userId });
  } else {
    query = Post.find().populate({
      path: "user",
      select: "name bio"
    });
  }

  const posts = await query;
  res.status(200).json({ success: true, count: posts.length, data: posts });
});

//@desc         Create a post
//@route        Post /api/v1/users/:userId/posts
//@access       private

exports.createPost = asyncHandler(async (req, res, next) => {
  //Add user to req.body
  req.body.user = req.params.userId;

  //Check for created posts
  const createdPosts = await Post.findOne({ user: req.user.id });

  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(
      new errorResponse(`No user with the id of ${req.params.userId}`),
      404
    );
  }

  const post = await Post.create(req.body);

  res.status(200).json({ success: true, data: post });
});
