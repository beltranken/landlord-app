import { getProperty, type GetPropertyResponse } from "@/api";
import { useQuery } from "@tanstack/react-query";

export type Property = GetPropertyResponse["data"];

interface UsePropertyOptions {
  enabled?: boolean;
}

export function useProperty(propertyId: number, options?: UsePropertyOptions) {
  return useQuery<Property, unknown>({
    queryKey: ["properties", propertyId],
    enabled: options?.enabled ?? propertyId != null,
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
