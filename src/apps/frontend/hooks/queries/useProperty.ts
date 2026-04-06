import { getProperty, type GetPropertyResponse } from "@/api";
import { useQuery } from "@tanstack/react-query";

export type Property = GetPropertyResponse["data"];
export const PROPERTY_QUERY_KEY = "property";

export function useProperty(propertyId: number) {
  return useQuery<Property, unknown>({
    queryKey: [PROPERTY_QUERY_KEY, propertyId],
    queryFn: async () => {
      const response = await getProperty({
        path: { propertyId },
      });

      if (!response.data?.data || response.error) {
        console.log("Get Property Response:", response.error);
        throw new Error(response.error?.message || "Failed to get property");
      }

      return response.data.data;
    },
  });
}
