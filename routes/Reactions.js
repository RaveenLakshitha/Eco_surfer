const express = require("express");
const {
  getReviews,
  getReview,
  addReview
} = require("../controllers/Reactions");
const React = require("../models/Reaction");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

//router.route('/:id/photo').put(protect, authorize('User','Admin') userPhotoUpload);

router.get("/getReviews", protect, getReviews);
router.get("/getReview/:id", protect, getReview);
router.post("/addReview/:id", protect, addReview);

module.exports = router;
