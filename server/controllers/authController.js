import "dotenv/config";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { deleteCloudinaryImages } from "../middleware/multer.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export function createAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
}

export function createRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export function sendRefreshToken(res, token) {
  res.cookie("refreshToken", token, COOKIE_OPTIONS);
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const duplicate = await User.findOne({ email });
    if (duplicate)
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    const image =
      req.files?.length > 0
        ? req.files?.map((file) => file.secure_url || file.path)
        : [];

    const user = await User.create({ name, email, password, image });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User creation failed" });
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    sendRefreshToken(res, refreshToken);
    return res.status(201).json({
      accessToken,
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image,
      },
      message: "User created successfully",
    });
  } catch (error) {
    if (req.files?.length > 0) {
      await deleteCloudinaryImages(
        req.files?.map((file) => file.secure_url || file.path),
      );
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendRefreshToken(res, refreshToken);
    return res.status(200).json({
      accessToken,
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.headers.refreshToken;
    if (!token)
      return res.status(400).json({
        success: false,
        message: "No token found",
      });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Token",
      });
    }
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token)
      return res.status(400).json({
        success: false,
        message: "Refresh token reuse attempt detected",
      });

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(400).json({
        success: false,
        message: "No token found",
      });
    await User.findOneAndUpdate(
      { refreshToken: token },
      { refreshToken: null },
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "User logout successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user && req.user.role !== "admin")
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      success: true,
      message: "Successfully fetched user",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function updateUserInfo(req, res) {
  try {
    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = req.user.id === user._id;
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "User info update error",
      });
    const { name, email, password } = req.body;
    const currentImage = user.image;
    const newImage =
      req.files?.length > 0 ? req.files.map((f) => f.secure_url || f.path) : [];
    if (newImage.length > 0) {
      if (currentImage.length > 0) {
        await deleteCloudinaryImages(currentImage);
      }
      user.image = image;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save({ validateBeforeSave: true, new: true });
    return res.status(200).json({
      user,
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    if (req.files?.length > 0) {
      await deleteCloudinaryImages(
        req.files.map((f) => f.secure_url || f.path),
      );
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
