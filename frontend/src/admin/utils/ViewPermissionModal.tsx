"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Permission {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface ViewPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission: Permission | null;
}

const ViewPermissionModal: React.FC<ViewPermissionModalProps> = ({ isOpen, onClose, permission }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && permission && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-sm p-6 w-full max-w-md overflow-y-auto max-h-[65vh]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleModalClick}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold ml-2 flex items-center">Permission Details</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <section>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Name
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100 break-all">
                  {permission.name}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100">
                  {permission.description}
                </div>
              </div>
            
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100">
                  {formatDate(permission.createdAt)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({formatDistanceToNow(new Date(permission.createdAt), { addSuffix: true })})
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Updated At
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100">
                  {formatDate(permission.updatedAt)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({formatDistanceToNow(new Date(permission.updatedAt), { addSuffix: true })})
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

export default ViewPermissionModal;