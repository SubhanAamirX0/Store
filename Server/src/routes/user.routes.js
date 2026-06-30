import { Router } from "express";
import { getUser, listUsers, updateProfile, updateUser } from "../controllers/user.controller.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, requireAdmin, listUsers);
router.get("/:id", protect, requireAdmin, getUser);
router.patch("/me/profile", protect, updateProfile);
router.patch("/:id", protect, requireAdmin, updateUser);

export default router;
