import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken"; // ✅ Import JWT
import { verifyJWT } from "../middlewires/auth.middlewire.js";

const router = express.Router();

// 🔹 Google OAuth Login Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 🔹 Google OAuth Callback Route
router.get("/google/callback", 
  passport.authenticate("google", { session: false }), 
  (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Google authentication failed" });

    // ✅ Corrected Access Token Generation
    const accessToken = jwt.sign(
      { _id: req.user._id, email: req.user.email }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: "15m" } // Short-lived token (15 min)
    );

    // ✅ Send Token or Redirect
    res.json({ accessToken }); // OR


    
    // res.redirect(`${process.env.CLIENT_URL}/home?token=${accessToken}`); // Optional redirect
  }
);

export default router;
