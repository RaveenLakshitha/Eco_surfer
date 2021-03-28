const express = require("express");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  postPhotoUpload
} = require("../controllers/posts");

const Posts = require("../models/Posts");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

//Include resourse routers
const reactRouter = require("./Reactions");

const { protect, authorize } = require("../middleware/auth");

//router.route('/:id/photo').put(protect, authorize('User','Admin') userPhotoUpload);

router.get("/getPosts", protect, getPosts);
router.post("/create", protect, createPost);

//.get(getUser)
router.get("/getPost/:id", protect, getPost);
router.put("/updatePost/:id", protect, updatePost);
router.delete("/deletePost/:id", protect, deletePost);
router.put("/postPhotoUpload/:id", protect, postPhotoUpload);

router.use("/reacts/:id", reactRouter);

module.exports = router;
