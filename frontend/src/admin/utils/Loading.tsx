import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-t-4 border-black border-t-gray-500 rounded-full animate-spin"></div>
        {/* Loading Text */}
        <p className="text-lg font-semibold text-black">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;