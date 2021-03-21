const express = require("express");
const {
  register,
  loginUser,
  getMe,
  updateDetails,
  updatePassword,
  deleteHimself
} = require("../controllers/auth");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/register", register);
router.delete("/deleteHimself", protect, deleteHimself);
router.post("/login", loginUser);
router.put("/updateDetails", protect, updateDetails);
router.put("/updatePassword", protect, updatePassword);
router.get("/me", protect, getMe);

module.exports = router;
