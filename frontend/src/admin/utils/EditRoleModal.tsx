import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

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

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Partial<Role>) => void;
  role: Role | null;
  permissions: Permission[];
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ isOpen, onClose, onSave, role, permissions }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]); // Using permission names

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setSelectedPermissions(role.permissions.map(p => p.name));
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPermissionObjects = permissions.filter(permission => selectedPermissions.includes(permission.name));
    onSave({ name, description, permissions: selectedPermissionObjects });
    onClose();
  };

  const handlePermissionChange = (permissionName: string, isChecked: boolean) => {
    setSelectedPermissions(prev =>
      isChecked
        ? [...prev, permissionName]
        : prev.filter(name => name !== permissionName)
    );
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !role) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="bg-white rounded-sm p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold ml-2">Edit Role</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Role Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={role?.name === "admin"}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border border-gray-200 p-3 rounded-sm">
                    {permissions.map((permission) => (
                      <div key={permission._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`permission-${permission._id}`}
                          checked={selectedPermissions.includes(permission.name)}
                          onChange={(e) => handlePermissionChange(permission.name, e.target.checked)}
                          className="h-4 w-4 text-gray-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={role?.name === "admin"}
                        />
                        <label
                          htmlFor={`permission-${permission._id}`}
                          className="ml-2 block text-sm text-gray-900"
                          title={permission.description || ""}
                        >
                          {permission.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditRoleModal;