const express = require("express");
const { register, loginUser, getMe } = require("../controllers/auth");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
