const express = require("express");
const { getPosts } = require("../controllers/posts");

const router = express.Router({ mergeParams: true });

router.route("/").get(getPosts);

module.exports = router;
