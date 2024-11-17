// UserController.js
const { User, Report } = require("../models/User"); // Adjust the import based on your User model's location
const { cloudinary } = require("../config/CloudinaryConfig.js"); // Adjust the import based on your cloudinaryConfig's location

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, surname, mobileNumber, email, age, password } = req.body;

    // Initialize an update object
    const updateData = {};
    // Check if the user is uploading a new profile image
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.profileImage = result.secure_url; // Get the secure URL of the uploaded image
    }

    // Update fields if provided
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (email) updateData.email = email;
    if (age) updateData.age = age;
    if (password) updateData.password = password; // Note: Ensure to hash the password before saving

    // Find the user and update their profile
    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate data against the model schema
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Get the user ID from the token
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateProfile,
  getProfile,
};
