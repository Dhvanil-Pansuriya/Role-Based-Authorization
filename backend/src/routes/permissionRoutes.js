// src/routes/permissionRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import authorizeRole from "../middlewares/roleMiddlewares.js";
import {
  createPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
  getPermissionById,
  getPermissionByName,
} from "../controller/permissionController.js";

const router = express.Router();

// Admin-only routes to manage permissions
router.post("/permissions", verifyToken, authorizeRole("admin"), createPermission); 
router.put("/permissions/:id", verifyToken, authorizeRole("admin"), updatePermission);
router.delete("/permissions/:id", verifyToken, authorizeRole("admin"), deletePermission);
router.get("/permissions", verifyToken, authorizeRole("admin"), getAllPermissions);
router.get("/permissions/:id", verifyToken, authorizeRole("admin"), getPermissionById);
router.get("/permissions/name/:name", verifyToken, authorizeRole("admin"), getPermissionByName);

export default router;