import { getProperties } from "@/api/sdk.gen";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PROPERTY_QUERY_KEY } from "./useProperty";

export const useProperties = () =>
  useInfiniteQuery({
    queryKey: [PROPERTY_QUERY_KEY],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getProperties({
        query: { page: pageParam },
      });

      if (!response.data || response.error) {
        throw new Error(
          response.error?.message ?? "Failed to fetch properties",
        );
      }

      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

export default useProperties;
