import { getTenants } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const tenantQueryKey = "tenants";

export function useTenants() {
  return useInfiniteQuery({
    queryKey: [tenantQueryKey],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTenants({
        query: { page: pageParam },
      });

      if (!response.data || response.error) {
        console.log("Get Tenants Response:", response.error);
        throw new Error(response.error?.message || "Failed to get tenants");
      }

      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
