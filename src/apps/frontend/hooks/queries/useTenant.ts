import { getTenant, GetTenantResponse } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { tenantQueryKey } from "./useTenants";

export function useTenant(tenantId: number) {
  return useQuery<GetTenantResponse["data"], unknown>({
    queryKey: [tenantQueryKey, tenantId],
    queryFn: async () => {
      const response = await getTenant({
        path: { tenantId },
      });

      if (!response.data?.data || response.error) {
        console.log("Get Tenant Response:", response.error);
        throw new Error(response.error?.message || "Failed to get tenant");
      }

      return response.data.data;
    },
  });
}
