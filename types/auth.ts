export type UserRole = "relationship_manager" | "analyst" | "administrator";

export interface UserPermissions {
  canViewCustomers: boolean;
  canEditCustomers: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  relationship_manager: {
    canViewCustomers: true,
    canEditCustomers: true,
    canViewAnalytics: false,
    canManageUsers: false,
  },
  analyst: {
    canViewCustomers: true,
    canEditCustomers: false,
    canViewAnalytics: true,
    canManageUsers: false,
  },
  administrator: {
    canViewCustomers: true,
    canEditCustomers: true,
    canViewAnalytics: true,
    canManageUsers: true,
  },
};
