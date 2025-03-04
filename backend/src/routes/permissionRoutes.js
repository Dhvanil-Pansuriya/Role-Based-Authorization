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
import hasPermission from "../middlewares/permissionMiddleware.js";


const router = express.Router();

// Admin-only routes to manage permissions
router.post("/permissions", verifyToken, hasPermission("create_permission"), createPermission); 
router.put("/permissions/:id", verifyToken, hasPermission("update_permission"), updatePermission);
router.delete("/permissions/:id", verifyToken, hasPermission("delete_permission"), deletePermission);
router.get("/permissions", verifyToken, hasPermission("view_permissions"), getAllPermissions);

router.get("/permissions/:id", verifyToken, authorizeRole("admin"), getPermissionById);
router.get("/permissions/name/:name", verifyToken, authorizeRole("admin"), getPermissionByName);



// router.post("/permissions", verifyToken, authorizeRole("admin"), createPermission); 
// router.put("/permissions/:id", verifyToken, authorizeRole("admin"), updatePermission);
// router.delete("/permissions/:id", verifyToken, authorizeRole("admin"), deletePermission);
// router.get("/permissions", verifyToken, hasPermission("view_permissions"), getAllPermissions);
// router.get("/permissions/:id", verifyToken, authorizeRole("admin"), getPermissionById);
// router.get("/permissions/name/:name", verifyToken, authorizeRole("admin"), getPermissionByName);

export default router;