import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const createRole = async (req, res) => {
  const { name, description, permissions } = req.body; // Changed permissionIds to permissions
  try {
    let role = await Role.findOne({ name });
    if (role) {
      return errorResponse(res, "Role already exists", 400);
    }

    // Find permissions by their names
    const permissionDocs = await Permission.find({ name: { $in: permissions } });
    if (permissionDocs.length !== permissions.length) {
      const foundPermissionNames = permissionDocs.map(p => p.name);
      const missingPermissions = permissions.filter(p => !foundPermissionNames.includes(p));
      return errorResponse(res, `Permissions not found: ${missingPermissions.join(", ")}`, 404);
    }

    // Extract permission IDs from the found documents
    const permissionIds = permissionDocs.map(p => p._id);

    role = new Role({ name, description, permissions: permissionIds });
    await role.save();
    successResponse(res, role, "Role created successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description, permissions } = req.body; 
  try {
    let role = await Role.findById(id);
    if (!role) {
      return errorResponse(res, "Role not found", 404);
    }

    if (permissions) {
      // Find permissions by their names
      const permissionDocs = await Permission.find({ name: { $in: permissions } });
      if (permissionDocs.length !== permissions.length) {
        const foundPermissionNames = permissionDocs.map(p => p.name);
        const missingPermissions = permissions.filter(p => !foundPermissionNames.includes(p));
        return errorResponse(res, `Permissions not found: ${missingPermissions.join(", ")}`, 404);
      }
      role.permissions = permissionDocs.map(p => p._id);
    }

    role.name = name || role.name;
    role.description = description || role.description;
    await role.save();
    successResponse(res, role, "Role updated successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

export const addPermissionToRole = async (req, res) => {
  const { id } = req.params;
  const { permission } = req.body; // Changed permissionId to permission
  try {
    const role = await Role.findById(id);
    if (!role) {
      return errorResponse(res, "Role not found", 404);
    }

    const permissionDoc = await Permission.findOne({ name: permission });
    if (!permissionDoc) {
      return errorResponse(res, `Permission '${permission}' not found`, 404);
    }

    if (role.permissions.includes(permissionDoc._id)) {
      return errorResponse(res, "Permission already assigned to this role", 400);
    }

    role.permissions.push(permissionDoc._id);
    await role.save();
    successResponse(res, role, "Permission added to role successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

export const removePermissionFromRole = async (req, res) => {
  const { id } = req.params;
  const { permission } = req.body; // Changed permissionId to permission
  try {
    const role = await Role.findById(id);
    if (!role) {
      return errorResponse(res, "Role not found", 404);
    }

    const permissionDoc = await Permission.findOne({ name: permission });
    if (!permissionDoc) {
      return errorResponse(res, `Permission '${permission}' not found`, 404);
    }

    if (!role.permissions.includes(permissionDoc._id)) {
      return errorResponse(res, "Permission not assigned to this role", 400);
    }

    role.permissions = role.permissions.filter(p => p.toString() !== permissionDoc._id.toString());
    await role.save();
    successResponse(res, role, "Permission removed from role successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    successResponse(res, roles, "Roles fetched successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

export const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findById(id).populate("permissions");
    if (!role) {
      return errorResponse(res, "Role not found", 404);
    }
    successResponse(res, role, "Role fetched successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return errorResponse(res, "Role not found", 404);
    }
    successResponse(res, role, "Role deleted successfully");
  } catch (err) {
    errorResponse(res, `Error: ${err.message}`, 500);
  }
};