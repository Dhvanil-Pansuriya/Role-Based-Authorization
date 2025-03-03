// src/routes/userRoutes.js
import express from "express";
import { successResponse } from "../utils/apiResponse.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import authorizeRole from "../middlewares/roleMiddlewares.js";
import hasPermission from "../middlewares/permissionMiddleware.js";
import {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controller/userController.js";

const router = express.Router();

// Test APIs
router.get("/admin", verifyToken, authorizeRole("admin"), (req, res) => {
  successResponse(res, "Admin Approved", req.user);
});
router.get(
  "/staff",
  verifyToken,
  authorizeRole("admin", "staff"),
  (req, res) => {
    successResponse(res, "Staff Approved", req.user);
  }
);
router.get(
  "/user",
  verifyToken,
  authorizeRole("admin", "staff", "user"),
  (req, res) => {
    successResponse(res, "User Approved", req.user);
  }
);

// Updated routes with permission checks
router.post("/user", verifyToken, hasPermission("create_user"), createUser);
router.put("/user/:id", verifyToken, hasPermission("update_user"), updateUser);
router.get("/users", verifyToken, hasPermission("view_users"), getAllUsers);
router.get("/user/:id", verifyToken, hasPermission("view_self"), getUserById);
router.delete(
  "/user/:id",
  verifyToken,
  hasPermission("delete_user"),
  deleteUser
);

export default router;
