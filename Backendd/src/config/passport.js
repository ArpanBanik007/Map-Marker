import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateAccessAndRefereshTokens } from "../controllers/user.controller.js";
dotenv.config();



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/api/v1/auth/google/callback",
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      let baseUsername = profile.displayName 
        ? profile.displayName.replace(/\s+/g, "").toLowerCase() 
        : profile.emails[0].value.split("@")[0]; 

      const generatedUsername = baseUsername + Math.floor(Math.random() * 10000);
    
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        fullName: profile.displayName,
        username: generatedUsername
      });
      await user.save();
    } else {
      // ✅ If user exists, update refresh token
      const tokens = generateAccessAndRefereshTokens(user._id);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return done(null, { user, token: tokens.accessToken });
    }

    const tokens = generateAccessAndRefereshTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return done(null, { user, token: tokens.accessToken });
  } catch (error) {
    return done(error, false);
  }
}));
