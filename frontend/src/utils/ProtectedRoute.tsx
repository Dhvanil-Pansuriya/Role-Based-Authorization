import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';

const ProtectedRoute: React.FC = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    const authToken = localStorage.getItem('authToken');

    if (!user || !authToken) {
        handleLogout();
        return <Navigate to="/login" />;
    }

    const decodedToken = jwtDecode<JwtPayload>(authToken);
    if (decodedToken?.exp && decodedToken.exp * 1000 < Date.now()) {
        handleLogout();
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

export default ProtectedRoute;
