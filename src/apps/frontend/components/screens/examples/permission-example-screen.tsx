import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  usePermissions,
  PermissionGuard,
  UserRole,
} from "@/hooks/usePermissions";
import { Colors } from "@/constants/colors";

/**
 * Example component demonstrating permission-based UI rendering
 */
export default function PermissionExampleScreen() {
  const {
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isCollector,
    userRole,
    permissions,
  } = usePermissions();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Permission System Demo
      </Text>

      {/* Display current user role */}
      <View
        style={{
          marginBottom: 20,
          padding: 15,
          backgroundColor: "#f0f0f0",
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Current Role: {userRole || "Not authenticated"}
        </Text>
        <Text style={{ marginTop: 5 }}>
          Admin: {isAdmin ? "Yes" : "No"} | Collector:{" "}
          {isCollector ? "Yes" : "No"}
        </Text>
      </View>

      {/* Method 1: Using hasPermission directly */}
      {hasPermission("canCreateProperties") && (
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            Create Property (Direct Permission Check)
          </Text>
        </TouchableOpacity>
      )}

      {/* Method 2: Using PermissionGuard component */}
      <PermissionGuard permissions={["canViewTenants"]}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.secondary,
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            View Tenants (Permission Guard)
          </Text>
        </TouchableOpacity>
      </PermissionGuard>

      {/* Method 3: Using PermissionGuard with fallback */}
      <PermissionGuard
        permissions={["canViewFinancialReports"]}
        fallback={
          <View
            style={{
              backgroundColor: "#ffebee",
              padding: 15,
              borderRadius: 8,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "#f44336",
            }}
          >
            <Text style={{ color: "#d32f2f", textAlign: "center" }}>
              Access Denied: Financial Reports
            </Text>
          </View>
        }
      >
        <TouchableOpacity
          style={{
            backgroundColor: Colors.accent,
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text
            style={{ color: "black", textAlign: "center", fontWeight: "600" }}
          >
            Financial Reports (With Fallback)
          </Text>
        </TouchableOpacity>
      </PermissionGuard>

      {/* Method 4: Multiple permission checks */}
      {hasAnyPermission(["canCreateTenants", "canUpdateTenants"]) && (
        <TouchableOpacity
          style={{
            backgroundColor: "#4caf50",
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            Tenant Management (Any Permission)
          </Text>
        </TouchableOpacity>
      )}

      {/* Role-based conditional rendering */}
      {isAdmin && (
        <View
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#e8f5e8",
            borderRadius: 8,
            borderWidth: 2,
            borderColor: "#4caf50",
          }}
        >
          <Text style={{ fontWeight: "600", color: "#2e7d32" }}>
            🔑 Admin Panel Access
          </Text>
          <Text style={{ marginTop: 5, color: "#2e7d32" }}>
            You have full administrative privileges
          </Text>
        </View>
      )}

      {/* Permission debugging info (for development) */}
      <View
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
        }}
      >
        <Text style={{ fontWeight: "600", marginBottom: 10 }}>
          Debug: Current Permissions
        </Text>
        <Text style={{ fontSize: 12, fontFamily: "monospace" }}>
          {JSON.stringify(permissions, null, 2)}
        </Text>
      </View>

      {/* Example of testing different roles */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "600", marginBottom: 10 }}>
          Test Different Roles:
        </Text>

        <PermissionGuard
          permissions={["canManageOrganization"]}
          userRole={UserRole.ADMIN}
        >
          <Text style={{ color: Colors.primary, marginBottom: 5 }}>
            ✅ Admin can manage organization
          </Text>
        </PermissionGuard>

        <PermissionGuard
          permissions={["canManageOrganization"]}
          userRole={UserRole.COLLECTOR}
        >
          <Text style={{ color: Colors.primary, marginBottom: 5 }}>
            ✅ Collector can manage organization
          </Text>
        </PermissionGuard>

        <PermissionGuard
          permissions={["canManageOrganization"]}
          userRole={UserRole.USER}
          fallback={
            <Text style={{ color: "#666", marginBottom: 5 }}>
              ❌ Tenant cannot manage organization
            </Text>
          }
        >
          <Text style={{ color: Colors.primary, marginBottom: 5 }}>
            ✅ Tenant can manage organization
          </Text>
        </PermissionGuard>
      </View>
    </View>
  );
}
