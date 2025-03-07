"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast'
import { ListRestart, Loader2 } from "lucide-react"

interface Permission {
  _id: string;
  name: string;
  description: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const EditRolePage: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null)
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [originalPermissions, setOriginalPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allSelected, setAllSelected] = useState(false)
  const [isPermissionsChanged, setIsPermissionsChanged] = useState(false)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const fetchRole = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/roles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setRole(response.data.data);
        const permissions = response.data.data.permissions.map((p: Permission) => p.name);
        setSelectedPermissions(permissions);
        setOriginalPermissions(permissions);
      } else {
        setError("Failed to fetch role: Invalid response format");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
    setLoading(false);
  };

  const fetchPermissions = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/get-all-permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAllPermissions(response.data.data);
      } else {
        setError("Failed to fetch permissions: Invalid response format");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    fetchRole();
    fetchPermissions();
  }, [id]);

  const handlePermissionChange = (permissionName: string, isChecked: boolean) => {
    setSelectedPermissions((prev) =>
      isChecked ? [...prev, permissionName] : prev.filter((name) => name !== permissionName)
    );
  };

  const handleMarkAllChange = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedPermissions(allPermissions.map((p) => p.name));
      setAllSelected(true);
    } else {
      setSelectedPermissions([]);
      setAllSelected(false);
    }
  };

  const handleUndo = () => {
    setSelectedPermissions([...originalPermissions]); // Revert to original permissions
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    if (!role) return;

    try {
      const updatedRole = {
        name: role.name,
        description: role.description,
        permissions: selectedPermissions
      };

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_API}/roles/${id}`,
        updatedRole,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Role ${role.name} updated successfully!`, {
          style: { border: "1px solid gray", padding: "16px", color: "gray" },
          iconTheme: { primary: "green", secondary: "white" },
        });
        setOriginalPermissions(selectedPermissions);
        setIsPermissionsChanged(false);
        navigate("/dashboard/allroles");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message, {
          style: { border: "1px solid gray", padding: "16px", color: "gray" },
          iconTheme: { primary: "red", secondary: "white" },
        });
      } else {
        toast.error("Failed to update role. Please try again.", {
          style: { border: "1px solid gray", padding: "16px", color: "gray" },
          iconTheme: { primary: "red", secondary: "white" },
        });
      }
    }
  };

  const groupPermissionsByCategory = (permissions: Permission[]) => {
    const groupedPermissions: { [key: string]: Permission[] } = {};

    permissions.forEach((permission) => {
      const category = permission.name.split('_')[0];
      if (!groupedPermissions[category]) {
        groupedPermissions[category] = [];
      }
      groupedPermissions[category].push(permission);
    });

    const otherPermissions: Permission[] = [];
    Object.keys(groupedPermissions).forEach((category) => {
      if (groupedPermissions[category].length === 1) {
        otherPermissions.push(...groupedPermissions[category]);
        delete groupedPermissions[category];
      }
    });

    if (otherPermissions.length > 0) {
      groupedPermissions["Other"] = otherPermissions;
    }

    return groupedPermissions;
  };

  const groupedPermissions = groupPermissionsByCategory(allPermissions);

  useEffect(() => {
    const hasChanged = !(
      selectedPermissions.length === originalPermissions.length &&
      selectedPermissions.every((perm) => originalPermissions.includes(perm))
    );
    setIsPermissionsChanged(hasChanged);

    if (selectedPermissions.length === allPermissions.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [selectedPermissions, originalPermissions, allPermissions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 size={32} className="animate-spin mx-3 text-gray-600" />
        <div className="text-center py-6">Loading role...</div>
      </div>
    );
  }

  if (error || !role) {
    return <div className="text-center py-6 text-red-500">{error || "Role not found"}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Role: {role.name}</h1>

      <div className="bg-white shadow rounded-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={role.name}
            onChange={(e) => setRole({ ...role, name: e.target.value })}
            className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 p-2"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={role.description}
            onChange={(e) => setRole({ ...role, description: e.target.value })}
            className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 p-2"
            rows={3}
          />
        </div>

        <div className={`mb-6 border px-4 rounded-sm ${isPermissionsChanged ? "border-red-500" : "border-gray-300"}`}>
          <div className="flex items-center justify-between py-3 flex-wrap gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              Permissions {isPermissionsChanged && <span className="text-red-500 text-sm font-normal">* Unsaved changes</span>}
            </h3>
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              {/* Mark All Checkbox */}
              <div className="flex items-center ">
                <input
                  type="checkbox"
                  id="mark-all"
                  checked={allSelected}
                  onChange={(e) => handleMarkAllChange(e.target.checked)}
                  className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <label htmlFor="mark-all" className="ml-2 text-sm text-gray-700">
                  Mark All
                </label>
              </div>
              {/* Undo Button */}
              <button
                onClick={handleUndo}
                disabled={!isPermissionsChanged} // Disable if no changes
                className={`text-sm font-medium px-2 py-1 rounded-sm ${isPermissionsChanged
                  ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed"
                  } flex items-center justify-center gap-2`}
              >
                <ListRestart className="h-6 w-6" />
                Undo Changes
              </button>
            </div>
          </div>
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category} className={`pb-3 mb-3 ${category !== Object.keys(groupedPermissions).pop() ? 'border-b' : ''}`}>
              <h4 className="text-md font-medium text-gray-900 mb-2 ">
                {category.replace(/^\w/, (c) => c.toUpperCase())}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {permissions.map((permission) => (
                  <div key={permission._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`permission-${permission.name}`}
                      checked={selectedPermissions.includes(permission.name)}
                      onChange={(e) => handlePermissionChange(permission.name, e.target.checked)}
                      className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                    />
                    <label
                      htmlFor={`permission-${permission.name}`}
                      className="ml-2 text-sm text-gray-700"
                      title={permission.description}
                    >
                      {permission.name.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 items-center">
          <button
            onClick={() => navigate("/dashboard/allroles")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-gray-600 hover:bg-gray-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default EditRolePage;