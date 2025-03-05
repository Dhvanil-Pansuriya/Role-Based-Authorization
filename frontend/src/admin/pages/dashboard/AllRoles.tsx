"use client"

import { ChevronLeft, ChevronRight, Edit, Eye, Loader2, Trash2 } from "lucide-react"
import type React from "react"
import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import ConfirmationModal from "../../utils/ConfirmationModal"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast'
import ViewRoleModal from "../../utils/ViewRoleModal"
import { useHasPermission } from "../../utils/permissions"

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

type SortKey = "name" | "description"

const AllRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "ascending" | "descending" } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rolesPerPage] = useState(10)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [roleToView, setRoleToView] = useState<Role | null>(null)
  const navigate = useNavigate()


  const canCreateRole = useHasPermission("create_role");
  const canUpdateRole = useHasPermission("update_role");
  const canDeleteRole = useHasPermission("delete_role");



  const fetchRoles = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setRoles(response.data.data);
      } else {
        setError("Failed to fetch roles: Invalid response format");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openDeleteModal = (id: string) => {
    setRoleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  const handleDelete = (id: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    axios
      .delete(`${import.meta.env.VITE_SERVER_API}/api/v1/roles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const roleToDelete = roles.find((role) => role._id === id);
        if (roleToDelete) {
          toast.success(`Role ${roleToDelete.name} has been deleted.`, {
            style: {
              border: '1px solid gray',
              padding: '16px',
              color: 'gray',
            },
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          });
          setIsDeleteModalOpen(false);
          setRoles((prevRoles) => prevRoles.filter((role) => role._id !== id));
        }
      })
      .catch((error) => {
        console.error("Error deleting role:", error);
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message, {
            style: {
              border: '1px solid gray',
              padding: '16px',
              color: 'gray',
            },
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          });
        } else {
          toast.error(`An unexpected error occurred`, {
            style: {
              border: '1px solid gray',
              padding: '16px',
              color: 'gray',
            },
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          });
        }
      });
  };

  const handleSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedRoles = useMemo(() => {
    const sortableRoles = [...roles];
    if (sortConfig !== null) {
      sortableRoles.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableRoles;
  }, [roles, sortConfig]);

  const filteredRoles = useMemo(() => {
    return sortedRoles.filter(
      (role) =>
        role._id.includes(searchTerm.toLowerCase()) ||
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sortedRoles, searchTerm]);

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const openViewModal = (role: Role) => {
    setRoleToView(role);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setRoleToView(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 size={32} className="animate-spin mx-3 text-gray-600" />
        <div className="text-center py-6">Loading roles...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">All Roles</h1>
      </div>
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search roles..."
          className="px-4 py-2 border border-gray-300 rounded-sm focus:ring-gray-500 focus:border-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {
          canCreateRole && (
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => navigate("/dashboard/allroles/addrole")}
            >
              Add Role
            </button>
          )
        }
      </div>
      <div className="bg-white shadow rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: "Index", key: null },
                  { label: "Name", key: "name" },
                  { label: "Description", key: "description" },
                  { label: "Permissions Count", key: null },
                  { label: "Created", key: "createdAt" },
                  { label: "Updated", key: "updatedAt" },
                  { label: "Actions", key: null },
                ].map((column) => (
                  <th
                    key={column.label}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => column.key && handleSort(column.key as SortKey)}
                  >
                    <div className="flex items-center gap-3">
                      {column.label}
                      {column.key && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRoles.map((role, index) => (
                <tr key={role._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{index + 1 + indexOfFirstRole}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 w-32 overflow-hidden text-ellipsis whitespace-nowrap" title={role.name}>
                      {role.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 w-48 overflow-hidden text-ellipsis whitespace-nowrap" title={role.description}>
                      {role.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm text-gray-700 py-0.5 font-semibold text-center rounded-sm overflow-hidden text-ellipsis whitespace-nowrap inline-block px-2 ${role.permissions.length > 5 ? "bg-red-200"
                        : role.permissions.length === 5 ? "bg-orange-200"
                          : role.permissions.length === 4 ? "bg-yellow-200"
                            : role.permissions.length === 3 ? "bg-green-200"
                              : role.permissions.length === 2 ? "bg-teal-200"
                                : "bg-blue-200"
                        }`}
                      title={`${role.permissions.length} permissions`}
                    >
                      {role.permissions.length} - Permissions
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(role.createdAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(role.updatedAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button className="text-gray-600 hover:text-gray-800 mx-1" onClick={() => openViewModal(role)}>
                      <Eye size={20} className="inline-block" />
                    </button>
                    {
                      canDeleteRole && (

                        <button
                          className={`text-gray-600 hover:text-gray-800 mx-1 ${["admin", "staff", "user"].includes(role.name) ? "cursor-not-allowed opacity-50" : ""}`}
                          onClick={() => !["admin", "staff", "user"].includes(role.name) && openDeleteModal(role._id)}
                          disabled={["admin", "staff", "user"].includes(role.name)}
                        >
                          <Trash2 size={20} className="inline-block" />
                        </button>
                      )
                    }
                    {
                      canUpdateRole && (
                        <button
                          className="text-gray-600 hover:text-gray-800 mx-1"
                          onClick={() => navigate(`/dashboard/allroles/editrole/${role._id}`)}
                        >
                          <Edit size={20} className="inline-block" />
                        </button>
                      )
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstRole + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastRole, filteredRoles.length)}</span> of{" "}
                <span className="font-medium">{filteredRoles.length}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const shouldShow = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  return shouldShow;
                })
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return [
                      <span key={`ellipsis-${page}`} className="px-3 py-2">...</span>,
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm ${currentPage === page ? "z-10 bg-gray-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                      >
                        {page}
                      </button>,
                    ];
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm ${currentPage === page ? "z-10 bg-gray-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    >
                      {page}
                    </button>
                  );
                })}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center m-6 text-lg font-semibold">
          Permission Count Indicator
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 m-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-700">0-1 Permissions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-teal-200 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-700">2 Permissions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-200 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-700">3 Permissions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-200 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-700">4 Permissions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-200 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-700">5 Permissions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-700 whitespace-nowrap">More than 5 Permissions</span>
          </div>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => roleToDelete !== null && handleDelete(roleToDelete)}
          title="Confirm Deletion"
          message="Are you sure you want to delete this role? This action cannot be undone."
        />
        <ViewRoleModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          role={roleToView}
        />
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default AllRoles;