// src/middlewares/permissionMiddleware.js
import Permission from "../models/permission.model.js";
import User from "../models/user.model.js";
import { errorResponse } from "../utils/apiResponse.js";

const hasPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      // Get the user with populated role and permissions
      const user = await User.findById(req.user.id).populate({
        path: "role",
        populate: { path: "permissions" },
      });

      if (!user) {
        return errorResponse(res, "User not found", 404);
      }

      // Check if user's role has the required permission
      const hasRequiredPermission = user.role.permissions.some(
        (permission) => permission.name === permissionName
      );

      if (!hasRequiredPermission) {
        return errorResponse(
          res,
          `Permission denied: ${permissionName} for 'role : ${user.role.name}'`,
          403
        );
      }

      next();
    } catch (err) {
      errorResponse(res, `Error: ${err.message}`, 500);
    }
  };
};

export default hasPermission;
