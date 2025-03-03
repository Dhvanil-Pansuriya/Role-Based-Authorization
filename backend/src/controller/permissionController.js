import Permission from "../models/permission.model.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// Create a new permission
export const createPermission = async (req, res) => {
  const { name, description } = req.body;
  try {
    let permission = await Permission.findOne({ name });
    if (permission) {
      return errorResponse(res, "Permission already exists", 400);
    }
    permission = new Permission({ name, description });
    await permission.save();
    successResponse(res, permission, "Permission created successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

// Update an existing permission
export const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    let permission = await Permission.findById(id);
    if (!permission) {
      return errorResponse(res, "Permission not found", 404);
    }

    // Check if the new name already exists (and isn’t the current permission)
    if (name && name !== permission.name) {
      const existingPermission = await Permission.findOne({ name });
      if (existingPermission) {
        return errorResponse(res, "Permission name already exists", 400);
      }
    }

    permission.name = name || permission.name;
    permission.description = description || permission.description;
    await permission.save();
    successResponse(res, permission, "Permission updated successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

// Delete a permission
export const deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findByIdAndDelete(id);
    if (!permission) {
      return errorResponse(res, "Permission not found", 404);
    }
    successResponse(res, permission, "Permission deleted successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

// Get all permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    successResponse(res, permissions, "Permissions fetched successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

// Get a permission by ID
export const getPermissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findById(id);
    if (!permission) {
      return errorResponse(res, "Permission not found", 404);
    }
    successResponse(res, permission, "Permission fetched successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

// Get a permission by name (optional utility function)
export const getPermissionByName = async (req, res) => {
  const { name } = req.params;
  try {
    const permission = await Permission.findOne({ name });
    if (!permission) {
      return errorResponse(res, `Permission '${name}' not found`, 404);
    }
    successResponse(res, permission, "Permission fetched successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};