import "dotenv/config";
import jwt from "jsonwebtoken";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function adminProtect(req, res, next) {
  await protect(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin only",
      });
    }
    next();
  });
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      req.user = null;
      return next();
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      console.error(error);
      req.user = null;
      return next();
    }
  } catch (error) {
    console.error(error);
    req.user = null;
    next();
  }
}
