const path = require("path");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const Post = require("../models/Posts");
const User = require("../models/User");
const react = require("../models/Reaction");

//@desc         Get all posts
//@route        Get /api/v1/posts
//@route        Get /api/v1/users/:userId/posts
//@access       public

exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate({
    path: "user",
    select: "name"
  });

  res.status(200).json({ success: true, count: posts.length, data: posts });

  //res.status(200).json(res.advancedResults);
});

exports.getPost = asyncHandler(async (req, res, next) => {
  const posts = await Post.findById(req.params.id).populate({
    path: "user",
    select: "name"
  });
  res.status(200).json({ success: true, data: posts });

  //res.status(200).json(res.advancedResults);
});

//@desc         Create a post
//@route        Post /api/v1/users/:userId/posts
//@access       private

exports.createPost = asyncHandler(async (req, res, next) => {
  //Add user to req.body
  req.body.user = req.user.id;

  //Check for created posts
  //const createdPosts = await Post.findOne({ user: req.user.id });

  const post = await Post.create(req.body);
  res.status(201).json({ success: true, data: post });
});

//@desc         Update a post
//@route        PUT /api/v1/:id/updatePost
//@access       private

exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new errorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure user is the owner of the post
  if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorResponse(
        ` User ${req.params.id} is not authorized to update this post`,
        401
      )
    );
  }

  post = await Post.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: post });
});
//@desc         Delete a post
//@route        Delete /api/v1/:id/deletePost
//@access       private

exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(
      new errorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  //post.remove();
  res.status(200).json({ success: true, data: {} });
});

//@desc         Upload the image
//@route        Delete /api/v1/:id/photo
//@access       private

exports.postPhotoUpload = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new errorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new errorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  //Make sure image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new errorResponse(`Please upload an image file`, 400));
  }

  //Check file size

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new errorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Create custom file Name
  file.name = `photo_${post._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new errorResponse(`Problem with file upload`, 500));
    }

    await Post.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });

  console.log(file.name);
});
