import passport from "passport";
import { User } from "../models/userModel.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.googleId = profile.id;
            await user.save({ validateBeforeSave: false });
          } else {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails?.[0].value,
              googleId: profile.id,
              image: [profile.photos?.[0].value],
            });
          }
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

export default passport;
