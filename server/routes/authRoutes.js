import express from "express";
import {
  createAccessToken,
  createRefreshToken,
  deleteUser,
  getMe,
  login,
  logout,
  refresh,
  register,
  sendRefreshToken,
  updateUserInfo,
} from "../controllers/authController.js";
import { adminProtect, protect } from "../middleware/protect.js";
import passport from "../middleware/passport.js";

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/refresh", refresh);
authRouter.delete("/logout", logout);
authRouter.get("/getMe", protect, getMe);
authRouter.delete("/deleteUser", adminProtect, deleteUser);
authRouter.patch("/:id", protect, updateUserInfo);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      sendRefreshToken(res, refreshToken);
      return res.redirect(`http://localhost:9000/oauth?token=${accessToken}`);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);
