import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  scheduleDate?: string;
  requestDate?: string;
  startTime: string;
  endTime: string;
  orderNumber: string;
  accountName: string;
  status: string;
}

interface ValidationErrors {
  date?: string;
  startTime?: string;
  endTime?: string;
  orderNumber?: string;
  accountName?: string;
  status?: string;

}

const ExportOrders: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    scheduleDate: '08/03/2020',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    orderNumber: '100001',
    accountName: 'Acc1',
    status: 'Finished'
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Order number is required';
      isValid = false;
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
      isValid = false;
    }

    if (!formData.status.trim()) {
      newErrors.status = 'Status is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ text: 'Please correct the errors in the form', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        oneOf: {
          schedule_date: formData.scheduleDate,
          request_date: formData.requestDate
        },
        start_time: formData.startTime,
        end_time: formData.endTime,
        order_number: formData.orderNumber,
        account_name: formData.accountName,
        status: formData.status
      };
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrors({
          ...errors,
          status: "Token not found"
        });
        return;

      }


      const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/dispatch/export-orders`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage({ text: 'Export successful!', type: 'success' });
      navigate('/dashboard/exportorders/exportresults', { state: { responseData: response.data } });
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || 'Failed to export orders',
        type: 'error'
      });
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Export Orders</h1>

      <div className="bg-white shadow rounded-sm">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scheduleDate" className={labelClasses}>Schedule Date</label>
                <input
                  id="scheduleDate"
                  type="text"
                  name="scheduleDate"
                  value={formData.scheduleDate}
                  onChange={handleChange}
                  className={inputClasses(errors.date)}
                  placeholder="MM/DD/YYYY"
                />
                {errors.date && <p className={errorClasses}>{errors.date}</p>}
              </div>

              <div>
                <label htmlFor="startTime" className={labelClasses}>Start Time</label>
                <input
                  id="startTime"
                  type="text"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={inputClasses(errors.startTime)}
                  placeholder="HH:MM AM/PM"
                />
                {errors.startTime && <p className={errorClasses}>{errors.startTime}</p>}
              </div>

              <div>
                <label htmlFor="endTime" className={labelClasses}>End Time</label>
                <input
                  id="endTime"
                  type="text"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={inputClasses(errors.endTime)}
                  placeholder="HH:MM AM/PM"
                />
                {errors.endTime && <p className={errorClasses}>{errors.endTime}</p>}
              </div>

              <div>
                <label htmlFor="orderNumber" className={labelClasses}>Order Number</label>
                <input
                  id="orderNumber"
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  className={inputClasses(errors.orderNumber)}
                />
                {errors.orderNumber && <p className={errorClasses}>{errors.orderNumber}</p>}
              </div>

              <div>
                <label htmlFor="accountName" className={labelClasses}>Account Name</label>
                <input
                  id="accountName"
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  className={inputClasses(errors.accountName)}
                />
                {errors.accountName && <p className={errorClasses}>{errors.accountName}</p>}
              </div>

              <div>
                <label htmlFor="status" className={labelClasses}>Status</label>
                <input
                  id="status"
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputClasses(errors.status)}
                />
                {errors.status && <p className={errorClasses}>{errors.status}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Processing...
                  </span>
                ) : (
                  'Export Orders'
                )}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
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

export default ExportOrders;