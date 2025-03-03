import jwt from "jsonwebtoken";
import { genSalt, hash, compare } from "bcryptjs";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const signup = async (req, res) => {
  const { name, email, password, gender, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return errorResponse(
        res,
        "User already exists, use different email",
        400
      );
    }

    const roleDoc = await Role.findOne({ name: role }).populate("permissions");
    if (!roleDoc) {
      return errorResponse(res, `Role '${role}' not found`, 404);
    }

    user = new User({ name, email, password, gender, role: roleDoc._id });
    const salt = await genSalt(10);
    user.password = await hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: roleDoc._id, // Use role ID instead of name
        permissions: roleDoc.permissions.map((p) => p._id),
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        successResponse(res, { token }, "User registered successfully");
      }
    );
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).populate({
      path: "role",
      populate: { path: "permissions" },
    });
    if (!user) {
      return errorResponse(res, "Invalid credentials", 400);
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid credentials", 400);
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role._id, // Use role ID instead of name
        permissions: user.role.permissions.map((p) => p._id),
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        successResponse(res, { user, token }, "User signed in successfully");
      }
    );
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

export { signin, signup };
