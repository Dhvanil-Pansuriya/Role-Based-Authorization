import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/apiResponse.js";

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return errorResponse(res, "No token, authorization denied", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return errorResponse(res, "Token is not valid", 401);
  }
};

export { verifyToken };
