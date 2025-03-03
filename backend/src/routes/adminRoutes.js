import express from "express";
import {
  getTotalAdmins,
  getTotalUsers,
  getTotalStaff,
  getTotalRoles,
  getTotalPermissions,
  getAllAdmins,
  getAllUsers,
  getAllStaff,
  getAllRoles,
  getAllPermissions,
} from "../controller/adminController.js";
import authorizeRole from "../middlewares/roleMiddlewares.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/total-users", verifyToken, authorizeRole("admin", "staff"), getTotalUsers);
router.get("/total-staff", verifyToken, authorizeRole("admin", "staff"), getTotalStaff);
router.get("/total-admins", verifyToken, authorizeRole("admin", "staff"), getTotalAdmins);

router.get("/total-roles", verifyToken, authorizeRole("admin", "staff"), getTotalRoles);
router.get("/total-permissions", verifyToken, authorizeRole("admin", "staff"), getTotalPermissions);

router.get("/get-all-admins", verifyToken, authorizeRole("admin", "staff"), getAllAdmins);
router.get("/get-all-staff", verifyToken, authorizeRole("admin", "staff"), getAllStaff);
router.get("/get-all-users", verifyToken, authorizeRole("admin", "staff"), getAllUsers);

router.get("/get-all-roles", verifyToken, authorizeRole("admin", "staff"), getAllRoles);
router.get("/get-all-permissions", verifyToken, authorizeRole("admin", "staff"), getAllPermissions);

export default router;
