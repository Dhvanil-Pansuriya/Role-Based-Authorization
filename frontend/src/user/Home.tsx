import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import UserLayout from "../components/UserLayout";

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.userData);

  return (
    <UserLayout>
      <div className=" bg-gray-100">
        <div className=" mx-auto px-6 py-10">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              Welcome Home
            </h1>
            <p className="text-gray-600 text-center mt-2">
              This is your personal dashboard - a protected route
            </p>
          </div>

          {/* User Info Card */}
          {user && (
            <div className="bg-white rounded-lg shadow-md p-6  mx-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Profile
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600 font-medium">Name</span>
                  <span className="text-gray-800">{user?.name || "N/A"}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="text-gray-800">{user?.email || "N/A"}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600 font-medium">Role</span>
                  <span className="text-gray-800">{user?.role?.name || "N/A"}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600 font-medium">Gender</span>
                  <span className="text-gray-800">{user?.gender || "N/A"}</span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600 font-medium">Joined</span>
                  <span className="text-gray-800">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Last Updated</span>
                  <span className="text-gray-800">
                    {user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!user && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">Loading user information...</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default Home;