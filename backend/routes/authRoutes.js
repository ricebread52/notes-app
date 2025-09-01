import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOtp, verifyStoredOtp, sendOtpEmail } from "../services/otpService.js";

const router = express.Router();

// Send OTP (for both signup and login)
router.post("/send-otp", async (req, res) => {
  try {
    console.log("📩 Raw request body:", req.body);       // Debug log
    console.log("📩 req.body.email:", req.body.email);   // Debug log

    const { email } = req.body;

    // Handle case where frontend sends { email: { email: "user@example.com" } }
    const recipient = typeof email === "string" ? email : email?.email;

    if (!recipient) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const otp = generateOtp(recipient);
    await sendOtpEmail(recipient, otp);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error in /send-otp:", err.message);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// Verify OTP for Signup
router.post("/verify-otp", async (req, res) => {
  try {
    const { name, email, dob, otp } = req.body;
    if (!verifyStoredOtp(email, otp)) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // If user already exists, return error
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    // Create new user
    user = new User({ name, email, dob });
    await user.save();

    res.json({ success: true, message: "Signup successful" });
  } catch (err) {
    console.error("❌ Error in /verify-otp:", err.message);
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
});

// Verify OTP for Login
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!verifyStoredOtp(email, otp)) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token, message: "Login successful" });
  } catch (err) {
    console.error("❌ Error in /verify-login-otp:", err.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// Profile Route (Protected)
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-__v"); // return name, email, dob
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error in /profile:", err.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
});

export default router;
