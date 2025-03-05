// src/utils/permissions.js
export const hasPermission = (user, permission) => {
  return user?.permissions?.includes(permission) || false;
};
