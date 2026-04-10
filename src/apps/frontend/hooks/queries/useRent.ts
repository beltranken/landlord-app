import { getRent, GetRentResponse } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const RENT_QUERY_KEY = "rents";

export function useRent(rentId: number) {
  return useQuery<GetRentResponse["data"], unknown>({
    queryKey: [RENT_QUERY_KEY, rentId],
    queryFn: async () => {
      const response = await getRent({
        path: { rentId },
      });

      if (!response.data?.data || response.error) {
        console.log("Get Rent Response:", response.error);
        throw new Error(response.error?.message || "Failed to get rent");
      }

      return response.data.data;
    },
  });
}
