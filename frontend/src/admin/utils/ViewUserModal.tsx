"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export interface User {
  _id: string;
  name: string;
  gender: string;
  email: string;
  email_verified_at: string | null;
  createdAt: string;
  updatedAt: string;
  role: Role; // Updated to Role object
  token: string;
  password?: string; // Optional since it's not displayed
}

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
  };


  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-sm p-6 w-full max-w-md overflow-y-auto h-[65vh]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleModalClick}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center ">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold ml-2 flex items-center">{user?.role ? "Admin Details" : "User Details"}</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <section>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100 break-all">
                  {user?.name}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 overflow-hidden break-all bg-gray-100" title={user?.email}>
                  {user?.email}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100">
                  {user?.gender === "male" && "Male"}
                  {user?.gender === "female" && "Female"}
                  {user?.gender === "other" && "Other"}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100">
                  {user?.role.name === "admin" && "Admin"}
                  {user?.role.name === "staff" && "Staff"}
                  {user?.role.name === "user" && "User"}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                  
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100">
                  {user ? formatDate(user.createdAt) : "N/A"}
                  <span className="text-sm text-gray-500 ml-2">
                    ({user?.updatedAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : "N/A"})
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="updated_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Updated At
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100">
                  {user ? formatDate(user.updatedAt) : "N/A"}
                  <span className="text-sm text-gray-500 ml-2">
                    ({user?.updatedAt ? formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true }) : "N/A"})
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewUserModal;