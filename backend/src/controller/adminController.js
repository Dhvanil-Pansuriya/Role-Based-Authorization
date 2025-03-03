import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const getTotalUsers = async (req, res) => {
  try {
    const userRole = await Role.findOne({ name: "user" });
    if (!userRole) {
      return errorResponse(res, "User role not found", 404);
    }

    const totalUsers = await User.countDocuments({ role: userRole._id });
    successResponse(res, { totalUsers });
  } catch (error) {
    errorResponse(res, "Error retrieving total users count", 500);
  }
};

const getTotalStaff = async (req, res) => {
  try {
    const staffRole = await Role.findOne({ name: "staff" });
    if (!staffRole) {
      return errorResponse(res, "Staff role not found", 404);
    }

    const totalStaff = await User.countDocuments({ role: staffRole._id });
    successResponse(res, { totalStaff });
  } catch (error) {
    errorResponse(res, "Error retrieving total staff count", 500);
  }
};

const getTotalAdmins = async (req, res) => {
  try {
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      return errorResponse(res, "Admin role not found", 404);
    }

    const totalAdmins = await User.countDocuments({ role: adminRole._id });
    successResponse(res, { totalAdmins });
  } catch (error) {
    errorResponse(res, "Error retrieving total admins count", 500);
  }
};

const getTotalRoles = async (req, res) => {
  try {
    const totalRoles = await Role.countDocuments();
    successResponse(res, { totalRoles });
  } catch (error) {
    errorResponse(res, "Error retrieving total roles count", 500);
  }
};

const getTotalPermissions = async (req, res) => {
  try {
    const totalPermissions = await Permission.countDocuments();
    successResponse(res, { totalPermissions });
  } catch (error) {
    errorResponse(res, "Error retrieving total permissions count", 500);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userRole = await Role.findOne({ name: "user" });
    if (!userRole) {
      return errorResponse(res, "User role not found", 404);
    }

    const users = await User.find({ role: userRole._id }).populate("role");
    successResponse(res, { users });
  } catch (error) {
    errorResponse(res, "Error retrieving users", 500);
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staffRole = await Role.findOne({ name: "staff" });
    if (!staffRole) {
      return errorResponse(res, "Staff role not found", 404);
    }

    const staff = await User.find({ role: staffRole._id }).populate("role");
    successResponse(res, { staff });
  } catch (error) {
    errorResponse(res, "Error retrieving staff", 500);
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      return errorResponse(res, "Admin role not found", 404);
    }

    const admins = await User.find({ role: adminRole._id }).populate("role");
    successResponse(res, { admins });
  } catch (error) {
    errorResponse(res, "Error retrieving admins", 500);
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    successResponse(res, { roles });
  } catch (error) {
    errorResponse(res, "Error retrieving roles", 500);
  }
};

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    successResponse(res, { permissions });
  } catch (error) {
    errorResponse(res, "Error retrieving permissions", 500);
  }
};

export {
  getTotalUsers,
  getTotalStaff,
  getTotalAdmins,
  getTotalRoles,
  getTotalPermissions,
  getAllUsers,
  getAllStaff,
  getAllAdmins,
  getAllRoles,
  getAllPermissions,
};
