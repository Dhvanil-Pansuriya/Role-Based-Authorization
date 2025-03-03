"use client"

import { ChevronLeft, ChevronRight, Edit, Eye, Loader2, Trash2 } from "lucide-react"
import type React from "react"
import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import ConfirmationModal from "../../utils/ConfirmationModal"
import EditModal from "../../utils/EditModal"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast'
import ViewUserModal from "../../utils/ViewUserModal"
import { updateUser } from "../../../features/users/userSlice"
import { useDispatch } from "react-redux"

interface User {
  _id: string
  name: string
  gender: string
  email: string
  email_verified_at: string | null
  createdAt: string
  updatedAt: string
  role: number
  token: string
}

type SortKey = "name" | "email"

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "ascending" | "descending" } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [userToView, setUserToView] = useState<User | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("authToken")

    if (!token) {
      setError("No authentication token found. Please log in.")
      setLoading(false)
      return
    }

    axios
      .get(`${import.meta.env.VITE_SERVER_ADMIN_API}/adminsAndUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setUsers(response.data.data.users)
        } else {
          setError("Failed to fetch users: Invalid response format")
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error)
        setError("Failed to fetch users. Please check your permissions and try again.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const openEditModal = (user: User) => {
    setUserToEdit(user)
    setIsEditModalOpen(true)
  }

  const openViewModal = (user: User) => {
    setUserToView(user)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setUserToView(null)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setUserToEdit(null)
  }

  const handleDelete = (_id: string) => {
    const token = localStorage.getItem("authToken")

    if (!token) {
      setError("No authentication token found. Please log in.")
      return
    }

    axios
      .delete(`${import.meta.env.VITE_SERVER_ADMIN_API}/user/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const userToDelete = users.find((user) => user._id === _id)
        console.log(userToDelete)

        if (userToDelete) {
          setUsers(users.filter((user) => user._id !== _id))
          setIsDeleteModalOpen(false)
          toast.success(`User ${userToDelete.name} has been deleted.`, {
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
      .catch((error) => {
        console.error("Error deleting user:", error)
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

  const handleUpdate = async (updatedUser: Partial<User>) => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      setError("No authentication token found. Please log in.")
      return
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_ADMIN_API}/user/${userToEdit?._id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (currentUser?._id === userToEdit?._id) {
        dispatch(updateUser({ name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, gender: updatedUser.gender }));
      }

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userToEdit?._id ? { ...user, ...response.data.data.user } : user)),
        )
        toast.success(`User ${updatedUser.name} updated successfully!`, {
          style: {
            border: '1px solid gray',
            padding: '16px',
            color: 'gray',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '400px'
          },
          iconTheme: {
            primary: 'green',
            secondary: 'white',
          },
        })
        closeEditModal()
      }
    } catch (error) {
      console.error("Error updating user:", error)
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message, {
          style: {
            border: '1px solid gray',
            padding: '16px',
            color: 'gray',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '400px'
          },
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        })
      } else {
        toast.error("An unexpected error occurred.", {
          style: {
            border: '1px solid gray',
            padding: '16px',
            color: 'gray',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '400px'
          },
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        })
      }
    }
  }

  const openDeleteModal = (_id: string) => {
    setUserToDelete(_id)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  const handleSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const sortedUsers = useMemo(() => {
    const sortableUsers = [...users]
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1
        return 0
      })
    }
    return sortableUsers
  }, [users, sortConfig])

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(
      (user) =>
        user._id.includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [sortedUsers, searchTerm])

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

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

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 size={32} className="animate-spin mx-3 text-gray-600" />
        <div className="text-center py-6">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-6 text-gray-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">All Admins & Users</h1>
      </div>
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border border-gray-300 rounded-sm focus:ring-gray-500 focus:border-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 "
          onClick={() => navigate("/dashboard/adduser")}>
          Add User
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
                  { label: "Email", key: "email" },
                  { label: "Gender", key: null },
                  { label: "Role", key: null },
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
              {currentUsers.map((user, index) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 w-32 overflow-hidden text-ellipsis whitespace-nowrap" title={user.name}>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 w-40 overflow-hidden text-ellipsis whitespace-nowrap" title={user.email}>
                      {user.email}
                    </div>
                  </td>
                  {
                    user.gender === "male" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm text-blue-700 py-0.5 font-semibold bg-blue-200 text-center rounded-sm overflow-hidden text-ellipsis whitespace-nowrap inline-block px-2  "
                          title={user.gender}
                        >
                          Male
                        </div>
                      </td>
                    )
                  }
                  {
                    user.gender === "female" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-pink-700 py-0.5 font-semibold bg-pink-200 text-center rounded-sm overflow-hidden text-ellipsis whitespace-nowrap inline-block px-2" title={user.gender}>
                          Female
                        </div>
                      </td>
                    )
                  }
                  {
                    user.gender === "other" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800 py-0.5 font-semibold bg-gray-200 text-center rounded-sm overflow-hidden text-ellipsis whitespace-nowrap inline-block px-2" title={user.gender}>
                          {user.gender}
                        </div>
                      </td>
                    )
                  }
                  {user.role === 1 ? (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-semibold">Admin</div>
                    </td>
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">User</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <button className="text-gray-600 hover:text-gray-800 mx-1" onClick={() => openViewModal(user)}>
                      <Eye size={20} className="inline-block" />
                    </button>
                    <button
                      className={`text-gray-600 hover:text-gray-800 mx-1 ${user.role === 1 ? "cursor-not-allowed opacity-50" : ""}`}
                      onClick={() => user.role !== 1 && openDeleteModal(user._id)}
                      disabled={user.role === 1}
                    >
                      <Trash2 size={20} className="inline-block" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 mx-1" onClick={() => openEditModal(user)}>
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
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{" "}
                <span className="font-medium">{filteredUsers.length}</span> results
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
          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={() => userToDelete !== null && handleDelete(userToDelete)}
            title="Confirm Deletion"
            message="Are you sure you want to delete this user? This action cannot be undone."
          />

          {/* Edit modal */}
          <EditModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onSave={handleUpdate}
            user={userToEdit}
          />

          {/* View User Modal */}
          <ViewUserModal
            isOpen={isViewModalOpen}
            onClose={closeViewModal}
            user={userToView}
          />

          {/* <ToastContainer /> */}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
          />
        </div>
      </div>
    </div>
  )
}

export default AllUsers