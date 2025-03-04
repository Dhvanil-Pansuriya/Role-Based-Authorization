import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ValidationErrors {
    name?: string;
    description?: string;
    permissions?: string;
}

interface Permission {
    _id: string;
    name: string;
}

const AddRole: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [] as string[]
    });

    const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const NAME_CHAR_LIMIT = 255;
    const DESCRIPTION_CHAR_LIMIT = 500;
    const NAME_REGEX = /^[a-z0-9_]+$/;
    const navigate = useNavigate();


    useEffect(() => {
        const fetchPermissions = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("No authentication token found. Please log in.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/permissions`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAvailablePermissions(response.data.data);
                console.log(response.data.data);
            } catch (error: any) {
                console.log(error);
                setError(error.response?.data?.message || 'Failed to fetch permissions.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Role name is required';
            isValid = false;
        } else if (!NAME_REGEX.test(formData.name)) {
            newErrors.name = 'Role name must be lowercase letters and underscores only';
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Role description is required';
            isValid = false;
        }

        if (formData.permissions.length === 0) {
            newErrors.permissions = 'Please select at least one permission';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name as keyof ValidationErrors]) {
            setErrors({
                ...errors,
                [name]: undefined,
            });
        }

        if (name === "name") {
            if (value.length >= NAME_CHAR_LIMIT) {
                setErrors((prev) => ({ ...prev, name: `Name must be ${NAME_CHAR_LIMIT} characters or less` }));
            } else if (!NAME_REGEX.test(value)) {
                setErrors((prev) => ({ ...prev, name: 'Role name must be lowercase letters and underscores only' }));
            } else {
                setErrors((prev) => ({ ...prev, name: undefined }));
            }
        } else if (name === "description" && value.length >= DESCRIPTION_CHAR_LIMIT) {
            setErrors((prev) => ({ ...prev, description: `Description must be ${DESCRIPTION_CHAR_LIMIT} characters or less` }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handlePermissionChange = (permissionName: string) => {
        setFormData(prevData => {
            const updatedPermissions = prevData.permissions.includes(permissionName)
                ? prevData.permissions.filter(name => name !== permissionName)
                : [...prevData.permissions, permissionName];

            if (updatedPermissions.length > 0 && errors.permissions) {
                setErrors({
                    ...errors,
                    permissions: undefined,
                });
            }

            return {
                ...prevData,
                permissions: updatedPermissions
            };
        });
    };

    const handleFocus = () => {
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage({ text: 'Please correct the errors in the form', type: 'error' });
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("No authentication token found. Please log in.");
            return;
        }

        setIsSubmitting(true);

        try {
            await axios.post(`${import.meta.env.VITE_SERVER_API}/api/v1/roles`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage({ text: 'Role created successfully!', type: 'success' });
            setFormData({
                name: '',
                description: '',
                permissions: []
            });
            setErrors({});
            navigate('/dashboard/allroles');
        } catch (error: any) {
            if (error.response?.data?.message === "Role already exists") {
                setMessage({ text: 'Role already exists', type: 'error' });
            } else {
                setMessage({
                    text: error.response?.data?.message || 'Failed to create role.',
                    type: 'error'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = (error?: string) => `
        w-full px-4 py-2 transition-all duration-300 border rounded-sm 
        focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none 
        hover:border-gray-300 bg-white
        ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}
    `;
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
    const errorClasses = "mt-1 text-sm text-red-600";

    if (error) {
        return <div className="text-center py-6 text-red-500">{error}</div>;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Loader2 size={32} className="animate-spin mx-3 text-gray-600" />
                <div className="text-center py-6">Loading permissions..</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Add Role</h1>
            </div>

            <div className="bg-white shadow rounded-sm">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="name" className={labelClasses}>Role Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClasses(errors.name)}
                                    placeholder="Enter role name"
                                    maxLength={NAME_CHAR_LIMIT}
                                    onFocus={handleFocus}
                                />
                                {errors.name && <p className={errorClasses}>{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="description" className={labelClasses}>Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={inputClasses(errors.description)}
                                    placeholder="Enter role description"
                                    maxLength={DESCRIPTION_CHAR_LIMIT}
                                    onFocus={handleFocus}
                                    rows={3}
                                />
                                {errors.description && <p className={errorClasses}>{errors.description}</p>}
                            </div>

                            <div>
                                <label className={labelClasses}>Permissions</label>
                                <div className="mt-2 border border-gray-300 rounded-sm p-4 max-h-64 overflow-y-auto">
                                    {availablePermissions.length === 0 ? (
                                        <p className="text-gray-500">No permissions available</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {availablePermissions.map((permission) => (
                                                <div key={permission._id} className="flex items-center">
                                                    <input
                                                        id={`permission-${permission._id}`}
                                                        type="checkbox"
                                                        checked={formData.permissions.includes(permission.name)}
                                                        onChange={() => handlePermissionChange(permission.name)}
                                                        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor={`permission-${permission._id}`} className="ml-2 text-sm text-gray-700">
                                                        {permission.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.permissions && <p className={errorClasses}>{errors.permissions}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={() => navigate("/dashboard/allroles")}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Add Role'
                                )}
                            </button>
                        </div>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded-sm transition-all duration-500 ease-in-out animate-slideIn ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            <div className="flex items-center">
                                {message.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                                )}
                                <p>{message.text}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};

export default AddRole;