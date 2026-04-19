import { createRent, CreateRentData } from "@/api";
import { RENT_QUERY_KEY } from "@/hooks/queries/useRent";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateRent() {
  const queryClient = useQueryClient();

  return useMutation<number, unknown, CreateRentData["body"]>({
    mutationKey: [RENT_QUERY_KEY, "create"],
    mutationFn: async (body) => {
      const response = await createRent({
        body,
      });

      if (!response.data?.data || response.error) {
        throw new Error(response.error?.message || "Failed to create contract");
      }

      return response.data.data.rentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RENT_QUERY_KEY] });
    },
  });
}
