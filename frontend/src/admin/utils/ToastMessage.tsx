import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

type ToastMessageProps = {
  message: string;
  type: 'update' | 'delete' | 'error';
};

const ToastMessage: React.FC<ToastMessageProps> = ({ message, type }) => {
  const showToast = () => {
    const styles = {
      style: {
        border: '1px solid gray',
        padding: '16px',
        color: 'gray',
      },
      iconTheme: {
        primary: type === 'update' ? 'green' : 'red',
        secondary: 'white',
      },
    };

    if (type === 'update') {
      toast.success(message, styles);
    } else if (type === 'delete' || type === 'error') {
      toast.error(message, styles);
    }
  };

  return (
    <>
      <button onClick={showToast} className="px-4 py-2 bg-blue-500 text-white rounded">
        Show Toast
      </button>
      <Toaster position="bottom-center" reverseOrder={true} />
    </>
  );
};

export default ToastMessage;
