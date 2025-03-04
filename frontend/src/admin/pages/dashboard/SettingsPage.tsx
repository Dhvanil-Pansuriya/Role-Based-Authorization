import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../app/store";
import axios from "axios";
import { Check, Loader2 } from "lucide-react";
import { updateUser } from "../../../features/users/userSlice";
import toast, { Toaster } from 'react-hot-toast';

const CHAR_LIMIT = 225;

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userData);
  const [name, setName] = useState(user?.name || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
  });

  const hasChanges = name !== user?.name || gender !== user?.gender;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > CHAR_LIMIT) {
      setErrors(prev => ({
        ...prev,
        name: `Name must be less than ${CHAR_LIMIT} characters`
      }));
      return;
    }

    setName(value);

    if (errors.name) {
      setErrors(prev => ({
        ...prev,
        name: ''
      }));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    if (name !== 'name') {
      setErrors({ name: '' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.length > CHAR_LIMIT) {
      setErrors({ name: `Name must be less than ${CHAR_LIMIT} characters` });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_API}/user/${user?._id}`,
        { name, gender },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success(`User ${name} updated successfully!`, {
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
        });
        dispatch(updateUser({ name, gender }));
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred while updating the user.";
      console.log(errorMessage);
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message, {
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
        });
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
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      <div className="bg-white shadow rounded-sm divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
          <div className="mt-6 space-y-6">
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                {/* Editable Fields */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 my-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`mt-1 block w-full rounded-sm py-2 px-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.name ? 'focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={name}
                    onChange={handleNameChange}
                    onFocus={handleFocus}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 my-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    className="mt-1 block w-full rounded-sm py-2 px-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    onFocus={handleFocus}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Read-only Fields */}
                <div className="opacity-70 cursor-not-allowed">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 my-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 block w-full rounded-sm py-2 px-2 border-gray-300 shadow-sm sm:text-sm"
                    value={user?.email || ''}
                    disabled
                  />
                </div>

                <div className="opacity-70 cursor-not-allowed">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 my-2">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    className="mt-1 block w-full rounded-sm py-2 px-2 border-gray-300 shadow-sm sm:text-sm"
                    value={user?.role.name || ''}
                    disabled
                  />
                </div>

                <div className="opacity-70 cursor-not-allowed">
                  <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700 my-2">
                    Created At
                  </label>
                  <input
                    type="text"
                    name="createdAt"
                    id="createdAt"
                    className="mt-1 block w-full rounded-sm py-2 px-2 border-gray-300 shadow-sm sm:text-sm"
                    value={formatDate(user?.createdAt)}
                    disabled
                  />
                </div>

                <div className="opacity-70 cursor-not-allowed">
                  <label htmlFor="updatedAt" className="block text-sm font-medium text-gray-700 my-2">
                    Updated At
                  </label>
                  <input
                    type="text"
                    name="updatedAt"
                    id="updatedAt"
                    className="mt-1 block w-full rounded-sm py-2 px-2 border-gray-300 shadow-sm sm:text-sm"
                    value={formatDate(user?.updatedAt)}
                    disabled
                  />
                </div>
              </div>

              {/* Permissions Display */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 my-2">Permissions</h3>
                <div className="mt-2 border border-gray-200 rounded-sm p-4">
                  {user?.role.permissions?.length ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {user.role.permissions.map((permission) => (
                        <li key={permission._id} className="text-sm text-gray-600">
                          <span className="font-medium">{permission.name}</span>
                          {permission.description && `: ${permission.description}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No permissions assigned</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={`inline-flex items-center mt-6 px-4 py-2 border text-sm font-medium rounded-sm shadow-sm text-white ${hasChanges && !errors.name ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={isLoading || !hasChanges || Boolean(errors.name)}
              >
                {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />} Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default SettingsPage;