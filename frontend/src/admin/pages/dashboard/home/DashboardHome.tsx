import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CornerDownRight, PencilRuler, Shield, UserCheck, UserCog, Users, UsersRound } from "lucide-react";

const DashboardHome: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [totalRoles, setTotalRoles] = useState<number>(0);
  const [totalPermissions, setTotalPermissions] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/total-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        animateValue(setTotalUsers, 0, response.data.data.totalUsers, 1000);
      } catch (error) {
        console.error("Error fetching total users:", error);
        setError("Failed to fetch total users");
      }
    };

    const fetchTotalAdmins = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/total-admins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        animateValue(setTotalAdmins, 0, response.data.data.totalAdmins, 1000);
      } catch (error) {
        console.error("Error fetching total admins:", error);
        setError("Failed to fetch total admins");
      }
    };

    const fetchTotalStaff = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/total-staff`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        animateValue(setTotalStaff, 0, response.data.data.totalStaff, 1000);
      } catch (error) {
        console.error("Error fetching total staff:", error);
        setError("Failed to fetch total staff");
      }
    };

    const fetchTotalRoles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/total-roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        animateValue(setTotalRoles, 0, response.data.data.totalRoles, 1000);
      } catch (error) {
        console.error("Error fetching total roles:", error);
        setError("Failed to fetch total roles");
      }
    };

    const fetchTotalPermissions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/total-permissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        animateValue(setTotalPermissions, 0, response.data.data.totalPermissions, 1000);
      } catch (error) {
        console.error("Error fetching total permissions:", error);
        setError("Failed to fetch total permissions");
      }
    };

    fetchTotalUsers();
    fetchTotalAdmins();
    fetchTotalStaff();
    fetchTotalRoles();
    fetchTotalPermissions();
  }, []);

  const animateValue = (setter: React.Dispatch<React.SetStateAction<number>>, start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setter(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  if (loading) {
    return <div className="text-center py-6">Loading data...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-6">
        <Link to="/dashboard/users" >
          <div className="bg-white rounded-sm shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Total Registered Users</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalUsers + totalAdmins + totalStaff}</h3>
              </div>
              <div className="bg-pink-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CornerDownRight className="h-4 w-4 text-pink-500 mr-1" />
              <span className="text-gray-500 ml-2">Total count of all registered users</span>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/users/allusers" >
          <div className="bg-white rounded-sm shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Only Users</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalUsers}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UsersRound className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CornerDownRight className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-gray-500 ml-2">Total count of only users</span>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/users/alladmins">
          <div className="bg-white rounded-sm shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Only Admins</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalAdmins}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CornerDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-gray-500 ml-2">Total count of only admins</span>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/users/allstaff">
          <div className="bg-white rounded-sm shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Only  Staff</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalStaff}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CornerDownRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-gray-500 ml-2">Total count of only staff</span>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/allroles">
          <div className="bg-white rounded-sm shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Roles</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalRoles}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <UserCog className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CornerDownRight className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-gray-500 ml-2">Total count of all roles</span>
            </div>
          </div>
        </Link>
        <Link to="/dashboard/allpermissions">
          <div className="bg-white rounded-sm shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Permissions</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalPermissions}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <PencilRuler className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CornerDownRight className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-gray-500 ml-2">Total count of all permissions</span>
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
};

export default DashboardHome;