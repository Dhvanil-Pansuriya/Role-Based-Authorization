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
  const [email, setEmail] = useState(user?.email || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [role, setRole] = useState(user?.role || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
  });

  const hasChanges = name !== user?.name || email !== user?.email || role !== user?.role || gender !== user?.gender;

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

    // Clear error when value is within limit
    if (errors.name) {
      setErrors(prev => ({
        ...prev,
        name: ''
      }));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    // Clear errors when focusing on a different field
    if (name !== 'name') {
      setErrors({ name: '' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    if (name.length > CHAR_LIMIT) {
      setErrors({ name: `Name must be less than ${CHAR_LIMIT} characters` });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_ADMIN_API}/user/${user?._id}`,
        { name, email, gender, role },
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
        dispatch(updateUser({ name, email, gender, role }));
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
                <div className="opacity-70 cursor-not-allowed">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 my-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 block w-full rounded-sm py-2 px-2 border-gray-300 shadow-sm sm:text-sm"
                    value={email}
                    disabled
                    onFocus={handleFocus}
                  />
                </div>
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
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 my-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full rounded-sm py-2 px-2 border-gray-300 shadow-sm sm:text-sm"
                  value={role}
                  onChange={(e) => setRole(parseInt(e.target.value))}
                  disabled
                  onFocus={handleFocus}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>User</option>
                </select>
              </div>

              <button
                type="submit"
                className={`inline-flex items-center mt-3 px-4 py-2 border text-sm font-medium rounded-sm shadow-sm text-white ${hasChanges && !errors.name ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={isLoading || !hasChanges || Boolean(errors.name)}
              >
                {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />} Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  );
};

export default SettingsPage;