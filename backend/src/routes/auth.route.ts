import { Router } from "express";
import { authLimiter } from "../middlewares/security.middleware";
import {
  getCurrentUser,
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller";
import {
  authenticate,
  authorize,
  requireVerification,
} from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh-token", refreshToken);

// Protected routes
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logout);

// Admin-only routes
router.get(
  "/admin/users",
  authenticate,
  authorize("ADMIN"),
  async (req, res) => {
    // Admin user list logic here
    res.json({ success: true, data: [] });
  }
);

// Verified user routes example
router.get(
  "/protected-data",
  authenticate,
  requireVerification,
  async (req, res) => {
    res.json({
      success: true,
      data: "This is protected data for verified users",
    });
  }
);

export default router;
