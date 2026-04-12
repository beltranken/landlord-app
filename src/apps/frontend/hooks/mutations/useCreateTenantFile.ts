import { createTenantFile, type CreateTenantFileData } from "@/api";
import { tenantQueryKey } from "@/hooks/queries/useTenants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateTenantFileVariables {
  tenantId: number;
  body: CreateTenantFileData["body"];
}

export function useCreateTenantFile() {
  const queryClient = useQueryClient();

  return useMutation<number, unknown, CreateTenantFileVariables>({
    mutationKey: [tenantQueryKey, "files", "create"],
    mutationFn: async ({ tenantId, body }) => {
      const response = await createTenantFile({
        path: { tenantId },
        body,
      });

      if (!response.data?.data || response.error) {
        console.log("Create Tenant File Response:", response.error);
        throw new Error(
          response.error?.message || "Failed to create tenant file",
        );
      }

      return response.data.data.tenantFileId;
    },
    onSuccess: (_tenantFileId, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: [tenantQueryKey, tenantId] });
    },
  });
}
