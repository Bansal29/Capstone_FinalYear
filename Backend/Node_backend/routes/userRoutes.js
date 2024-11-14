const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { updateProfile, getProfile } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/update", updateProfile);

module.exports = router;
