import { client } from "@/api/client.gen";
import { CreateProperty } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdatePropertyVariables {
  propertyId: number;
  body: CreateProperty;
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, UpdatePropertyVariables>({
    mutationKey: ["properties", "update"],
    mutationFn: async ({ propertyId, body }) => {
      await client.instance.put(`/api/properties/${propertyId}`, body);
    },
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties", propertyId] });
    },
  });
}
