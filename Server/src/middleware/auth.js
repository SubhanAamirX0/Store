import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/user.model.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User account is unavailable" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}
