import React, { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ValidationErrors {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    role?: string;
    gender?: string;
}

// Add interface for Role
interface Role {
    _id: string;
    name: string;
    description: string;
}

const AddUser: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '', // Changed from 0 to '' since we'll use role name or ID
        gender: '',
    });

    const [roles, setRoles] = useState<Role[]>([]); // Added state for roles
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const NAME_CHAR_LIMIT = 255;
    const EMAIL_CHAR_LIMIT = 255;
    const PASSWORD_CHAR_LIMIT = 255;

    // Fetch roles when component mounts
    useEffect(() => {
        const fetchRoles = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("No authentication token found. Please log in.");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/roles/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRoles(response.data.data);
                // Set default role if roles are available
                if (response.data.data.length > 0) {
                    setFormData(prev => ({ ...prev, role: response.data.data[0]._id }));
                }
            } catch (err) {
                setError("Failed to fetch roles");
            }
        };

        fetchRoles();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
            isValid = false;
        }

        if (!formData.gender) {
            newErrors.gender = 'Please select a gender';
            isValid = false;
        }

        if (!formData.role) {
            newErrors.role = 'Please select a role';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

        if (name === "name" && value.length >= NAME_CHAR_LIMIT) {
            setErrors((prev) => ({ ...prev, name: `Name must be ${NAME_CHAR_LIMIT} characters or less` }));
        } else if (name === "email" && value.length >= EMAIL_CHAR_LIMIT) {
            setErrors((prev) => ({ ...prev, email: `Email must be ${EMAIL_CHAR_LIMIT} characters or less` }));
        } else if ((name === "password" || name === "password_confirmation") && value.length >= PASSWORD_CHAR_LIMIT) {
            setErrors((prev) => ({ ...prev, [name]: `Password must be ${PASSWORD_CHAR_LIMIT} characters or less` }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
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
            await axios.post(`${import.meta.env.VITE_SERVER_API}/api/v1/user`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage({ text: 'User created successfully!', type: 'success' });
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: roles.length > 0 ? roles[0]._id : '',
                gender: '',
            });
            setErrors({});
        } catch (error: any) {
            if (error.response?.data?.message === "Email already exists") {
                setMessage({ text: 'Email already exists', type: 'error' });
            } else {
                setMessage({
                    text: error.response?.data?.message || 'Failed to create user.',
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Add User</h1>
            </div>

            <div className="bg-white shadow rounded-sm">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* ... Other form fields remain the same ... */}

                            <div>
                                <label htmlFor="name" className={labelClasses}>Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClasses(errors.name)}
                                    placeholder="Enter name"
                                    maxLength={NAME_CHAR_LIMIT}
                                    onFocus={handleFocus}
                                />
                                {errors.name && <p className={errorClasses}>{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className={labelClasses}>Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={inputClasses(errors.email)}
                                    placeholder="Enter email"
                                    maxLength={EMAIL_CHAR_LIMIT}
                                    onFocus={handleFocus}
                                />
                                {errors.email && <p className={errorClasses}>{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="gender" className={labelClasses}>Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={inputClasses(errors.gender)}
                                    onFocus={handleFocus}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <p className={errorClasses}>{errors.gender}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className={labelClasses}>Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={inputClasses(errors.password)}
                                    placeholder="Enter password"
                                    maxLength={PASSWORD_CHAR_LIMIT}
                                    onFocus={handleFocus}
                                />
                                {
                                    formData.password.length > PASSWORD_CHAR_LIMIT && (
                                        <p className="mt-1 text-sm text-red-600">Password must be less than {PASSWORD_CHAR_LIMIT} characters</p>
                                    )
                                }
                                {errors.password && <p className={errorClasses}>{errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className={labelClasses}>Confirm Password</label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className={inputClasses(errors.password_confirmation)}
                                    placeholder="Confirm password"
                                    maxLength={PASSWORD_CHAR_LIMIT}
                                    onFocus={handleFocus}
                                />
                                {
                                    formData.password_confirmation.length > PASSWORD_CHAR_LIMIT && (
                                        <p className="mt-1 text-sm text-red-600">Password must be less than {PASSWORD_CHAR_LIMIT} characters</p>
                                    )
                                }
                                {errors.password_confirmation && (
                                    <p className={errorClasses}>{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Dynamic Role Dropdown */}
                            <div>
                                <label htmlFor="role" className={labelClasses}>Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={inputClasses(errors.role)}
                                    onFocus={handleFocus}
                                >
                                    {roles.map((role) => (
                                        <option key={role._id} value={role.name}>
                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <p className={errorClasses}>{errors.role}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting || roles.length === 0}
                                className={`px-4 py-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ${isSubmitting || roles.length === 0 ? 'opacity-75 cursor-not-allowed' : ''
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
                                    'Add User'
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
            </div>
        </div>
    );
};

export default AddUser;