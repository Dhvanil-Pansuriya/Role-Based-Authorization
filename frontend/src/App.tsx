import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import DashboardHome from './admin/pages/dashboard/home/DashboardHome';
import ProfilePage from './admin/pages/dashboard/profile/ProfilePage';
import SettingsPage from './admin/pages/settings/SettingsPage';
import ReportsPage from './admin/pages/dashboard/reports/ReportsPage';
import AllUsers from './admin/pages/dashboard/users/AllUsers';
import ProtectedRoute from './utils/ProtectedRoute';
import Home from './user/Home';
import AddUser from './admin/pages/dashboard/users/AddUser';
import AllAdmins from './admin/pages/dashboard/users/AllAdmins';
import AllStaff from './admin/pages/dashboard/users/AllStaff';
import AllRoles from './admin/pages/dashboard/roles/AllRoles';
import AllPermissions from './admin/pages/dashboard/permissions/AllPermissions';
import Users from './admin/pages/dashboard/users/Users';
import AddRole from './admin/pages/dashboard/roles/AddRole';
import AddPermission from './admin/pages/dashboard/permissions/AddPermission';
import EditRole from './admin/utils/EditRolePage';
import ExportOrders from './admin/pages/dashboard/orders/OrderExport';
import ExportResults from './admin/pages/dashboard/orders/OrderResults';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path='/home' element={<Home />} />
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="users" element={<Users />} />
            <Route path="adduser" element={<AddUser />} />
            <Route path="users/allusers" element={<AllUsers />} />
            <Route path="users/alladmins" element={<AllAdmins />} />
            <Route path="users/allstaff" element={<AllStaff />} />
            <Route path="allroles" element={<AllRoles />} />
            <Route path="allroles/editrole/:id" element={<EditRole />} />
            <Route path="allroles/addrole" element={<AddRole />} />
            <Route path="allpermissions" element={<AllPermissions />} />
            <Route path="allpermissions/addpermissions" element={<AddPermission />} />
            <Route path="exportorders" element={<ExportOrders />} />
            <Route path="exportorders/exportresults" element={<ExportResults />} />

          </Route>
        </Route>

        {/* <Route path="*" element={<Navigate to="/" />} /> */}

      </Routes>

    </Router>
  );
}

export default App;