import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ValidationErrors {
    name?: string;
    description?: string;
}

const AddPermission: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const NAME_CHAR_LIMIT = 255;
    const DESCRIPTION_CHAR_LIMIT = 500;
    const NAME_REGEX = /^[a-z0-9_]+$/;
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Permission name is required';
            isValid = false;
        } else if (!NAME_REGEX.test(formData.name)) {
            newErrors.name = 'Permission name must be lowercase letters and underscores only';
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Permission description is required';
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
                setErrors((prev) => ({ ...prev, name: 'Permission name must be lowercase letters and underscores only' }));
            } else {
                setErrors((prev) => ({ ...prev, name: undefined }));
            }
        } else if (name === "description" && value.length >= DESCRIPTION_CHAR_LIMIT) {
            setErrors((prev) => ({ ...prev, description: `Description must be ${DESCRIPTION_CHAR_LIMIT} characters or less` }));
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
            await axios.post(`${import.meta.env.VITE_SERVER_API}/api/v1/permissions`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage({ text: 'Permission created successfully!', type: 'success' });
            setFormData({
                name: '',
                description: ''
            });

            navigate("/dashboard/allpermissions");
            setErrors({});
        } catch (error: any) {
            if (error.response?.data?.message === "Permission already exists") {
                setMessage({ text: 'Permission already exists', type: 'error' });
            } else {
                setMessage({
                    text: error.response?.data?.message || 'Failed to create permission.',
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
                <h1 className="text-2xl font-semibold text-gray-900">Add Permission</h1>
            </div>

            <div className="bg-white shadow rounded-sm">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="name" className={labelClasses}>Permission Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClasses(errors.name)}
                                    placeholder="Enter permission name (e.g., test_permissions)"
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
                                    placeholder="Enter permission description (e.g., This is test permissions not for any uses)"
                                    maxLength={DESCRIPTION_CHAR_LIMIT}
                                    onFocus={handleFocus}
                                    rows={3}
                                />
                                {errors.description && <p className={errorClasses}>{errors.description}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={() => navigate("/dashboard/allpermissions")}
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
                                    'Add Permission'
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

export default AddPermission;