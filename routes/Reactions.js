const express = require("express");
const { getReviews } = require("../controllers/Reactions");
const React = require("../models/Reaction");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

//router.route('/:id/photo').put(protect, authorize('User','Admin') userPhotoUpload);

router.get("/getReviews", getReviews);

module.exports = router;
