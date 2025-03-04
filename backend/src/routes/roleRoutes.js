import express from "express";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import authorizeRole from "../middlewares/roleMiddlewares.js";
import {
  createRole,
  updateRole,
  addPermissionToRole,
  removePermissionFromRole,
  getAllRoles,
  getRoleById,
  deleteRole,
} from "../controller/roleController.js";
import hasPermission from "../middlewares/permissionMiddleware.js";

const router = express.Router();

// Admin-only routes to manage roles

router.post("/roles", verifyToken, hasPermission("create_role"), createRole);
router.put("/roles/:id", verifyToken, hasPermission("update_role"), updateRole);
router.get("/roles", verifyToken, hasPermission("view_roles"), getAllRoles);
router.delete("/roles/:id", verifyToken, hasPermission("delete_role"), deleteRole);

router.get("/roles/:id", verifyToken, authorizeRole("admin", "staff"), getRoleById);

router.post("/roles/remove-permission/:id", verifyToken, authorizeRole("admin"), removePermissionFromRole);
router.post("/roles/add-permission/:id", verifyToken, authorizeRole("admin"), addPermissionToRole);



// router.post("/roles", verifyToken, authorizeRole("admin"), createRole);
// router.put("/roles/:id", verifyToken, authorizeRole("admin"), updateRole);
// router.post("/roles/add-permission/:id", verifyToken, authorizeRole("admin"), addPermissionToRole);
// router.post("/roles/remove-permission/:id", verifyToken, authorizeRole("admin"), removePermissionFromRole);
// router.get("/roles", verifyToken, authorizeRole("admin"), getAllRoles);
// router.get("/roles/:id", verifyToken, authorizeRole("admin"), getRoleById);
// router.delete("/roles/:id", verifyToken, authorizeRole("admin"), deleteRole);


export default router;
