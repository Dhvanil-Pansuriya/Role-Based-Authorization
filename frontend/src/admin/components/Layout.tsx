import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Settings, Users, ChevronLeft, ChevronRight, ChevronDown, Shield, UsersRound, UserCog, PencilRuler, BarChartHorizontal, UserCheck, CalendarCheck2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useHasPermission } from '../utils/permissions';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    {
      name: 'Users',
      icon: Users,
      subItems: [
        { name: 'All Users', href: '/dashboard/users', icon: Users, permission: "view_users" },
        { name: 'Only Users', href: '/dashboard/users/allusers', icon: UsersRound, permission: "view_users" },
        { name: 'Only Admins', href: '/dashboard/users/alladmins', icon: Shield, permission: "view_users" },
        { name: 'Only Staff', href: '/dashboard/users/allstaff', icon: UserCheck, permission: "view_users" },
      ],
      permission: "view_users"
    },
    { name: 'All Roles', href: '/dashboard/allroles', icon: UserCog, permission: "view_roles" },
    { name: 'All Permissions', href: '/dashboard/allpermissions', icon: PencilRuler, permission: "view_permissions" },
    { name: 'Export Orders', href: '/dashboard/exportorders', icon: CalendarCheck2, permission: "export_orders" },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChartHorizontal },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // Filter navigation items based on permissions
  const filteredNavigation = navigation.filter(item => {
    if (item.permission) {
      const approved_permission = useHasPermission(item.permission);
      // console.log(item.permission, "=>", approved_permission);
      return approved_permission
    }
    return true;
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDesktopSidebar = () => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  const toggleUsersDropdown = () => setIsUsersDropdownOpen(!isUsersDropdownOpen);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
            onClick={toggleSidebar}
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white transform transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-xl font-semibold">
              Dashboard</span>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-sm hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {filteredNavigation.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={toggleUsersDropdown}
                      className={`flex items-center w-full px-4 py-2 rounded-sm text-gray-700 hover:bg-gray-100`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                      <ChevronDown
                        className={`w-5 h-5 ml-auto transition-transform ${isUsersDropdownOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {isUsersDropdownOpen && (
                      <div className="pl-8 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`flex items-center px-4 py-2 rounded-sm ${location.pathname === subItem.href
                              ? 'bg-gray-400 text-gray-900'
                              : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <subItem.icon className="w-5 h-5 mr-3" />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 rounded-sm ${location.pathname === item.href
                      ? 'bg-gray-400 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col ${isDesktopSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
          } transition-all duration-300`}
      >
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            {!isDesktopSidebarCollapsed && (
              <span className="text-xl font-semibold">Dashboard</span>
            )}
            <button
              onClick={toggleDesktopSidebar}
              className={`p-2 rounded-sm hover:bg-gray-100 ${isDesktopSidebarCollapsed ? 'mx-auto' : 'ml-auto'
                }`}
            >
              {isDesktopSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {filteredNavigation.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  !isDesktopSidebarCollapsed ? (
                    <>
                      <button
                        onClick={toggleUsersDropdown}
                        className={`flex items-center w-full px-4 py-2 rounded-sm text-gray-700 hover:bg-gray-100`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                        <ChevronDown
                          className={`w-5 h-5 ml-auto transition-transform ${isUsersDropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                      {isUsersDropdownOpen && (
                        <div className="pl-8 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`flex items-center px-4 py-2 rounded-sm ${location.pathname === subItem.href
                                ? 'bg-gray-400 text-gray-900'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                              <subItem.icon className="w-5 h-5 mr-3" />
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      title={item.name}
                      className="flex items-center justify-center py-2 text-gray-700 hover:bg-gray-100 rounded-sm"
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                  )
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center rounded-sm ${location.pathname === item.href
                      ? 'bg-gray-400 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100'
                      } ${isDesktopSidebarCollapsed ? 'justify-center py-2' : 'px-4 py-2'
                      }`}
                    title={isDesktopSidebarCollapsed ? item.name : ''}
                  >
                    <item.icon className="w-5 h-5" />
                    {!isDesktopSidebarCollapsed && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${isDesktopSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
          }`}
      >
        <Navbar
          children={
            <div className="sticky flex h-16 bg-white border-b lg:hidden">
              <button
                onClick={toggleSidebar}
                className="px-4 border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          }
        />

        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;