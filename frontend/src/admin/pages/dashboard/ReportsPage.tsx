import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Loader2 } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserStats {
  totalUsers: number;
  totalStaff: number;
  totalAdmins: number;
  totalRoles: number;
  totalPermissions: number;
}

interface Report {
  title: string;
  count: number;
  color: string;
  borderColor: string;
}

const ReportsPage: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    totalStaff: 0,
    totalAdmins: 0,
    totalRoles: 0,
    totalPermissions: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("authToken");

        const [
          usersResponse,
          staffResponse,
          adminsResponse,
          rolesResponse,
          permissionsResponse,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/total-users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/total-staff`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/total-admins`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/total-roles`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/total-permissions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const newUserStats = {
          totalUsers: usersResponse.data.data.totalUsers,
          totalStaff: staffResponse.data.data.totalStaff,
          totalAdmins: adminsResponse.data.data.totalAdmins,
          totalRoles: rolesResponse.data.data.totalRoles,
          totalPermissions: permissionsResponse.data.data.totalPermissions,
        };
        setUserStats(newUserStats);

        // Generate dynamic reports based on user stats
        const dynamicReports: Report[] = [
          {
            title: "Total Users",
            count: newUserStats.totalUsers,
            color: "rgba(79, 70, 229, 0.8)", // indigo
            borderColor: "rgb(79, 70, 229)"
          },
          {
            title: "Total Staff",
            count: newUserStats.totalStaff,
            color: "rgba(8, 145, 178, 0.8)", // cyan
            borderColor: "rgb(8, 145, 178)"
          },
          {
            title: "Total Admins",
            count: newUserStats.totalAdmins,
            color: "rgba(3, 105, 161, 0.8)", // blue
            borderColor: "rgb(3, 105, 161)"
          },
          {
            title: "Total Roles",
            count: newUserStats.totalRoles,
            color: "rgba(5, 150, 105, 0.8)", // emerald
            borderColor: "rgb(5, 150, 105)"
          },
          {
            title: "Total Permissions",
            count: newUserStats.totalPermissions,
            color: "rgba(101, 163, 13, 0.8)", // lime
            borderColor: "rgb(101, 163, 13)"
          }
        ];

        setReports(dynamicReports);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching user stats:", err);
        setError("Failed to load user statistics. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
      title: {
        display: true,
        text: "User Statistics Overview",
        font: {
          size: 17,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Count: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
      y: {
        ticks: {
          font: {
            weight: 'bold',
          }
        }
      }
    },
    barThickness: 25,
  };

  const chartData = {
    labels: reports.map(report => report.title),
    datasets: [
      {
        label: "Count",
        data: reports.map(report => report.count),
        backgroundColor: reports.map(report => report.color),
        borderColor: reports.map(report => report.borderColor),
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 size={32} className="animate-spin mx-3 text-gray-600" />
        <div className="text-center py-6">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>

      {error ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  User Statistics Overview
                </h2>
                <div className="mt-4 h-96 bg-gray-50 rounded-lg p-4">
                  <Bar options={chartOptions} data={chartData} />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Reports Detail
                </h2>
                <div className="mt-4">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                            Report Title
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Count
                          </th>
                          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Color Indicator
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {reports.map((report, index) => (
                          <tr key={`${report.title}-${index}`}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                              {report.title}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {report.count.toLocaleString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <div
                                className="w-16 h-6 rounded"
                                style={{ backgroundColor: report.color }}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  font-bold text-gray-900">
                            Total Reports
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-bold">
                            {reports.length}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;