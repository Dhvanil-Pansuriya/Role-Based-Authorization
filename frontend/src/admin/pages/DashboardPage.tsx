import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import Loading from '../utils/Loading';

const DashboardPage: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {

        const adminPromise = axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const staffPromise = axios.get(`${import.meta.env.VITE_SERVER_API}/api/v1/staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const [adminResult, staffResult] = await Promise.all([
          adminPromise.catch(() => ({ data: { success: false } })),
          staffPromise.catch(() => ({ data: { success: false } }))
        ]);


        if (adminResult.data.success || staffResult.data.success) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Authorization check failed:', error.response?.data || error.message);
        } else {
          console.error('Authorization check failed:', error);
        }
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  if (isAuthorized === null) {
    return <Loading />;
  }

  if (isAuthorized === false) {
    return <Navigate to="/home" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default DashboardPage;