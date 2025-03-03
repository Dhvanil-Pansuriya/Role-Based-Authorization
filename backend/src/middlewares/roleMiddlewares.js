// src/middlewares/roleMiddlewares.js
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { errorResponse } from "../utils/apiResponse.js";

const authorizeRole = (...roleNames) => {
  return async (req, res, next) => {
    try {
      // Get user with populated role
      const user = await User.findById(req.user.id).populate("role");
      
      if (!user) {
        return errorResponse(res, "User not found", 404);
      }
      
      // Check if user's role name is in the allowed roles
      if (!roleNames.includes(user.role.name)) {
        return errorResponse(res, `Access Denied: Role '${user.role.name}' not authorized`, 403);
      }
      
      next();
    } catch (err) {
      errorResponse(res, `Error: ${err.message}`, 500);
    }
  };
};

export default authorizeRole;