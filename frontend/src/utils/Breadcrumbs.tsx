import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const routeNames: { [key: string]: string } = {
    'dashboard': 'Home',
    'alladminsusers': "All Admins & Users",
    'alladmins': "All Admins",
    'allusers': 'All Users',
    'allroles': 'All Roles',
    'allpermissions': 'All Permissions',
    'allstaff': 'All Staff',
    'settings': 'Settings',
    'reports': 'Reports',
    'adduser': 'Add User',
    'profile': 'Profile',
    'users': 'Users',
    'addrole': "Add Role",
    'addpermissions': 'Add Permissions',
    'editrole': 'Edit Role',
    'exportorders': 'Export Orders',
    'exportordersresult': 'Export Orders Result',
    'exportresults' : 'Export Results'
};

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);


    const isId = (str: string) => {
        return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str) ||
            /^[0-9a-fA-F]{24}$/.test(str) ||
            /^\d+$/.test(str);
    };

    const displayablePaths = pathnames.filter(name => !isId(name));

    return (
        <nav className="flex items-center text-sm text-gray-600">
            {displayablePaths.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, pathnames.indexOf(name) + 1).join("/")}`;
                const isLast = index === displayablePaths.length - 1;
                const displayName = routeNames[name] || name;

                return (
                    <React.Fragment key={name}>
                        {isLast ? (
                            <span className="text-gray-900 capitalize">{displayName}</span>
                        ) : (
                            <>
                                <Link to={routeTo} className="hover:text-gray-900 capitalize">
                                    {displayName}
                                </Link>
                                <ChevronRight className="mx-2 h-4 w-4" />
                            </>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;