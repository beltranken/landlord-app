import { useAuth } from "@/providers/auth-provider";
import { UserRole } from "@/types";
import React, { useMemo } from "react";

export { UserRole };

// Permission definitions - expand these based on your app's requirements
export interface Permission {
  // Property management
  canViewProperties: boolean;
  canCreateProperties: boolean;
  canUpdateProperties: boolean;
  canDeleteProperties: boolean;
  
  // Tenant management
  canViewTenants: boolean;
  canCreateTenants: boolean;
  canUpdateTenants: boolean;
  canDeleteTenants: boolean;
  
  // Rent management
  canViewRents: boolean;
  canCreateRents: boolean;
  canUpdateRents: boolean;
  canDeleteRents: boolean;
  canCollectPayments: boolean;
  
  // User management
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canUpdateUsers: boolean;
  canDeleteUsers: boolean;
  
  // Organization management
  canManageOrganization: boolean;
  
  // Reports
  canViewReports: boolean;
  canViewFinancialReports: boolean;
}

// Role-based permission configuration
const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  [UserRole.ADMIN]: {
    // Admins (owners) have full permissions
    canViewProperties: true,
    canCreateProperties: true,
    canUpdateProperties: true,
    canDeleteProperties: true,
    canViewTenants: true,
    canCreateTenants: true,
    canUpdateTenants: true,
    canDeleteTenants: true,
    canViewRents: true,
    canCreateRents: true,
    canUpdateRents: true,
    canDeleteRents: true,
    canCollectPayments: true,
    canViewUsers: true,
    canCreateUsers: true,
    canUpdateUsers: true,
    canDeleteUsers: true,
    canManageOrganization: true,
    canViewReports: true,
    canViewFinancialReports: true,
  },
  [UserRole.COLLECTOR]: {
    // Collectors can manage rents and payments but limited access to other areas
    canViewProperties: true,
    canCreateProperties: false,
    canUpdateProperties: false,
    canDeleteProperties: false,
    canViewTenants: true,
    canCreateTenants: false,
    canUpdateTenants: true, // Can update tenant payment info
    canDeleteTenants: false,
    canViewRents: true,
    canCreateRents: false,
    canUpdateRents: true,
    canDeleteRents: false,
    canCollectPayments: true,
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canManageOrganization: false,
    canViewReports: true,
    canViewFinancialReports: false, // Limited financial access
  },
  [UserRole.USER]: {
    // Tenants have very limited permissions - mostly read-only for their own data
    canViewProperties: false, // Can only see their own unit
    canCreateProperties: false,
    canUpdateProperties: false,
    canDeleteProperties: false,
    canViewTenants: false, // Can only see their own profile
    canCreateTenants: false,
    canUpdateTenants: false,
    canDeleteTenants: false,
    canViewRents: true, // Can view their own rent history
    canCreateRents: false,
    canUpdateRents: false,
    canDeleteRents: false,
    canCollectPayments: false,
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canManageOrganization: false,
    canViewReports: false,
    canViewFinancialReports: false,
  },
};

export interface UsePermissionsReturn {
  permissions: Permission;
  hasPermission: (permission: keyof Permission) => boolean;
  hasAnyPermission: (permissions: Array<keyof Permission>) => boolean;
  hasAllPermissions: (permissions: Array<keyof Permission>) => boolean;
  isAdmin: boolean;
  isCollector: boolean;
  isTenant: boolean;
  userRole: UserRole | null;
}

/**
 * Hook for checking user permissions based on their role
 * 
 * @param userRole - Optional role override. If not provided, attempts to derive from user context
 * @returns Permission check utilities and role information
 * 
 * @example
 * ```tsx
 * const { hasPermission, isAdmin } = usePermissions();
 * 
 * if (hasPermission('canCreateProperties')) {
 *   return <CreatePropertyButton />;
 * }
 * 
 * if (isAdmin) {
 *   return <AdminPanel />;
 * }
 * ```
 */
export function usePermissions(userRole?: UserRole): UsePermissionsReturn {
  const { user, isAuthenticated } = useAuth();
  
  // TODO: Once the backend provides user role information, replace this logic
  // For now, we'll use the provided userRole or default to USER if none provided
  // In a real implementation, you'd get this from user.role or user.organizationRole
  const resolvedRole = useMemo(() => {
    if (userRole) return userRole;
    
    // TODO: Replace this with actual role from user object
    // return user?.organizationRole || user?.role || null;
    
    // Temporary: Default to USER role if authenticated, null if not
    return isAuthenticated ? UserRole.USER : null;
  }, [userRole, user, isAuthenticated]);

  const permissions = useMemo(() => {
    if (!resolvedRole) {
      // Return empty permissions for non-authenticated users
      return Object.keys(ROLE_PERMISSIONS[UserRole.USER]).reduce((acc, key) => {
        acc[key as keyof Permission] = false;
        return acc;
      }, {} as Permission);
    }
    
    return ROLE_PERMISSIONS[resolvedRole];
  }, [resolvedRole]);

  const hasPermission = useMemo(() => {
    return (permission: keyof Permission): boolean => {
      return permissions[permission];
    };
  }, [permissions]);

  const hasAnyPermission = useMemo(() => {
    return (permissionList: Array<keyof Permission>): boolean => {
      return permissionList.some(permission => permissions[permission]);
    };
  }, [permissions]);

  const hasAllPermissions = useMemo(() => {
    return (permissionList: Array<keyof Permission>): boolean => {
      return permissionList.every(permission => permissions[permission]);
    };
  }, [permissions]);

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: resolvedRole === UserRole.ADMIN,
    isCollector: resolvedRole === UserRole.COLLECTOR,
    isTenant: resolvedRole === UserRole.USER,
    userRole: resolvedRole,
  };
}

/**
 * Higher-order component for conditionally rendering content based on permissions
 * 
 * @example
 * ```tsx
 * <PermissionGuard permissions={['canCreateProperties']}>
 *   <CreatePropertyButton />
 * </PermissionGuard>
 * 
 * <PermissionGuard 
 *   permissions={['canViewReports']} 
 *   fallback={<AccessDenied />}
 *   requireAll={true}
 * >
 *   <ReportsPage />
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({ 
  children, 
  permissions, 
  fallback = null,
  requireAll = false,
  userRole 
}: {
  children: React.ReactNode;
  permissions: Array<keyof Permission>;
  fallback?: React.ReactNode;
  requireAll?: boolean;
  userRole?: UserRole;
}) {
  const { hasAnyPermission, hasAllPermissions } = usePermissions(userRole);
  
  const hasAccess = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);
    
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}