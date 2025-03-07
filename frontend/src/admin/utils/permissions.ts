import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import axios from "axios";

interface Permission {
    _id: string;
    name: string;
    description: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

interface Role {
    _id: string;
    name: string;
    description: string;
    permissions: Permission[];
    __v: number;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    status: number;
    message: string;
    data: {
        role: Role;
    };
}

interface UserData {
    _id: string;
    name: string;
    email: string;
    gender: string;
    role: Role;
    token: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const useHasPermission = (permissionName: string): boolean => {
    const user = useSelector((state: RootState) => state.user.userData) as UserData | null;
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            const authToken = localStorage.getItem("authToken");
            if (!authToken || !user?._id) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_API}/get-role-from-user-id/${user._id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                // Extract permissions from the role object in the response
                setPermissions(response.data.data.role.permissions);
                // console.log(response.data.data.role.permissions);

            } catch (error) {
                console.error("Failed to fetch permissions:", error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };
        fetchPermissions();
    }, [user?._id]);

    if (loading) {
        return false;
    }

    // Check permissions from the API first
    const hasPermissionFromApi = permissions.some(permission =>
        permission.name.toLowerCase() === permissionName.toLowerCase()
    );

    // If not found in API, check in Redux store
    if (!hasPermissionFromApi && user && user.role && user.role.permissions) {
        return user.role.permissions.some(permission =>
            permission.name.toLowerCase() === permissionName.toLowerCase()
        );
    }



    return hasPermissionFromApi;
};