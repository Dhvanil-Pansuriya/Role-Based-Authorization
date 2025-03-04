"use client"

import { ChevronLeft, ChevronRight, Edit, Eye, Loader2, Trash2 } from "lucide-react"
import type React from "react"
import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import ConfirmationModal from "../../utils/ConfirmationModal"
import EditPermissionModal from "../../utils/EditPermissionModal"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast'
import ViewPermissionModal from "../../utils/ViewPermissionModal"

interface Permission {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

type SortKey = "name" | "description"

const AllPermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "ascending" | "descending" } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [permissionsPerPage] = useState(20)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [permissionToEdit, setPermissionToEdit] = useState<Permission | null>(null)
  const [permissionToView, setPermissionToView] = useState<Permission | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const navigate = useNavigate()

  const fetchPermission = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_SERVER_API}/api/v1/permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setPermissions(response.data.data);
        } else {
          setError("Failed to fetch permissions: Invalid response format");
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.message);
        } else {
          setError("An unexpected error occurred");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchPermission()
  }, []);

  const openEditModal = (permission: Permission) => {
    setPermissionToEdit(permission)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setPermissionToEdit(null)
  }

 
  const handleUpdate = async (updatedPermission: Partial<Permission>) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_API}/api/v1/permissions/${permissionToEdit?._id}`,
        updatedPermission,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPermissions((prevPermissions) =>
          prevPermissions.map((permission) =>
            permission._id === permissionToEdit?._id
              ? { ...permission, ...response.data.data.permission }
              : permission
          )
        );
        toast.success(`Permission ${updatedPermission.name} updated successfully!`, {
          style: {
            border: "1px solid gray",
            padding: "16px",
            color: "gray",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "400px",
          },
          iconTheme: {
            primary: "green",
            secondary: "white",
          },
        });
        fetchPermission()
        closeEditModal();
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message, {
          style: {
            border: "1px solid gray",
            padding: "16px",
            color: "gray",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "400px",
          },
          iconTheme: {
            primary: "red",
            secondary: "white",
          },
        });
      } else {
        toast.error("An unexpected error occurred.", {
          style: {
            border: "1px solid gray",
            padding: "16px",
            color: "gray",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            maxWidth: "400px",
          },
          iconTheme: {
            primary: "red",
            secondary: "white",
          },
        });
      }
    }
  };


  const openDeleteModal = (id: string) => {
    setPermissionToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setPermissionToDelete(null)
  }

  const handleDelete = (id: string) => {
    const token = localStorage.getItem("authToken")

    if (!token) {
      setError("No authentication token found. Please log in.")
      return
    }

    axios
      .delete(`${import.meta.env.VITE_SERVER_API}/api/v1/permissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const permissionToDelete = permissions.find((permission) => permission._id === id)
        if (permissionToDelete) {
          toast.success(`Permission ${permissionToDelete.name} has been deleted.`, {
            style: {
              border: '1px solid gray',
              padding: '16px',
              color: 'gray',
            },
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          })
          setIsDeleteModalOpen(false)
          setPermissions((prevPermissions) => prevPermissions.filter((permission) => permission._id !== id))
        }
      })
      .catch((error) => {
        console.error("Error deleting permission:", error)
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
          })
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
          })
        }
      })
  }

  const handleSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const sortedPermissions = useMemo(() => {
    const sortablePermissions = [...permissions]
    if (sortConfig !== null) {
      sortablePermissions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1
        return 0
      })
    }
    return sortablePermissions
  }, [permissions, sortConfig])

  const filteredPermissions = useMemo(() => {
    return sortedPermissions.filter(
      (permission) =>
        permission._id.includes(searchTerm.toLowerCase()) ||
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [sortedPermissions, searchTerm])

  const indexOfLastPermission = currentPage * permissionsPerPage
  const indexOfFirstPermission = indexOfLastPermission - permissionsPerPage
  const currentPermissions = filteredPermissions.slice(indexOfFirstPermission, indexOfLastPermission)
  const totalPages = Math.ceil(filteredPermissions.length / permissionsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const openViewModal = (permission: Permission) => {
    setPermissionToView(permission)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setPermissionToView(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 size={32} className="animate-spin mx-3 text-gray-600" />
        <div className="text-center py-6">Loading permissions...</div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">All Permissions</h1>
      </div>
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search permissions..."
          className="px-4 py-2 border border-gray-300 rounded-sm focus:ring-gray-500 focus:border-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={() => navigate("/dashboard/allpermissions/addpermissions")}
        >
          Add Permission
        </button>
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
              {currentPermissions.map((permission, index) => (
                <tr key={permission._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 w-32 overflow-hidden text-ellipsis whitespace-nowrap" title={permission.name}>
                      {permission.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 w-48 overflow-hidden text-ellipsis whitespace-nowrap" title={permission.description}>
                      {permission.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(permission.createdAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(permission.updatedAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button className="text-gray-600 hover:text-gray-800 mx-1" onClick={() => openViewModal(permission)}>
                      <Eye size={20} className="inline-block" />
                    </button>
                    <button
                      className={`text-gray-600 hover:text-gray-800 mx-1 ${["create_user", "update_user", "delete_user", "view_users", "view_self"].includes(permission.name) ? "cursor-not-allowed opacity-50" : ""
                        }`}
                      onClick={() => !["create_user", "update_user", "delete_user", "view_users", "view_self"].includes(permission.name) && openDeleteModal(permission._id)}
                      disabled={["create_user", "update_user", "delete_user", "view_users", "view_self"].includes(permission.name)}
                    >
                      <Trash2 size={20} className="inline-block" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 mx-1" onClick={() => openEditModal(permission)}>
                      <Edit size={20} className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstPermission + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastPermission, filteredPermissions.length)}</span> of{" "}
                <span className="font-medium">{filteredPermissions.length}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const shouldShow = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                  return shouldShow
                })
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return [
                      <span key={`ellipsis-${page}`} className="px-3 py-2">
                        ...
                      </span>,
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm ${currentPage === page
                          ? "z-10 bg-gray-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {page}
                      </button>,
                    ]
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm ${currentPage === page ? "z-10 bg-gray-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  )
                })}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => permissionToDelete !== null && handleDelete(permissionToDelete)}
          title="Confirm Deletion"
          message="Are you sure you want to delete this permission? This action cannot be undone."
        />
        {/* Edit modal */}
        <EditPermissionModal isOpen={isEditModalOpen} onClose={closeEditModal} onSave={handleUpdate} permission={permissionToEdit} />
        <ViewPermissionModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          permission={permissionToView}
        />
      </div>

      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  )
}

export default AllPermissions