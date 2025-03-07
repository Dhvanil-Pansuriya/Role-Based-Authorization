import express from "express";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import authorizeRole from "../middlewares/roleMiddlewares.js";
import { exportOrders, getOAuthToken } from "../controller/dispatchtrackController.js";
import hasPermission from "../middlewares/permissionMiddleware.js"

const router = express.Router();

router.post(
  "/export-orders",
  verifyToken,
  hasPermission('export_orders'),
  exportOrders
);

router.get(
  "/oauth2/token",
  verifyToken,
  authorizeRole("admin", "staff"),
  getOAuthToken
);

export default router;
