import { getRents, GetRentsResponse } from "@/api";
import { BaseRequestWithPaging } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { RENT_QUERY_KEY } from "./useRent";

type UseRentsParams = BaseRequestWithPaging & {
  tenantId?: number;
  propertyId?: number;
};

export function useRents(params: UseRentsParams = {}) {
  return useQuery<GetRentsResponse["data"], unknown>({
    queryKey: [RENT_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getRents({
        query: { ...params },
      });

      if (!response.data?.data || response.error) {
        console.log("Get Rent Response:", response.error);
        throw new Error(response.error?.message || "Failed to get rent");
      }

      return response.data.data;
    },
  });
}
