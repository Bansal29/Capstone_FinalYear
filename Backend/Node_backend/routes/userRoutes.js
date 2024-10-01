const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { updateProfile } = require("../controllers/userController");

const router = express.Router();

router.put("/update", updateProfile);

module.exports = router;
