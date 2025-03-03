"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

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

interface ViewRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

const ViewRoleModal: React.FC<ViewRoleModalProps> = ({ isOpen, onClose, role }) => {
  if (!isOpen || !role) return null;

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
            className="bg-white rounded-sm p-6 w-full max-w-md overflow-y-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleModalClick}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold ml-2 flex items-center">Role Details</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <section>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100 break-all">
                  {role.name}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100 break-all">
                  {role.description}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="permissions" className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-sm bg-gray-100 max-h-96 overflow-y-auto grid grid-cols-2 gap-2">
                  {role.permissions.length > 0 ? (
                    role.permissions.map((permission) => (
                      <div
                        key={permission._id}
                        className="text-gray-900 bg-gray-200 px-2 py-1 rounded-sm text-center hover:bg-gray-300 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                        title={permission.description || ""}
                      >
                        {permission.name}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-900 bg-red-100 px-1 py-1 rounded-sm text-center transition-colors col-span-2">
                      No permissions found
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100">
                  {formatDate(role.createdAt)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({formatDistanceToNow(new Date(role.createdAt), { addSuffix: true })})
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="updated_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Updated At
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100">
                  {formatDate(role.updatedAt)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({formatDistanceToNow(new Date(role.updatedAt), { addSuffix: true })})
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

export default ViewRoleModal;