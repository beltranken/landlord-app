import { createProperty } from "@/api";
import { CreateProperty } from "@/types";
import uploadPreSign from "@/utils/media/upload-presign";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation<number, unknown, CreateProperty>({
    mutationKey: ["properties", "create"],
    mutationFn: async (body) => {
      const response = await createProperty({
        body,
      });

      if (!response.data?.data || response.error) {
        console.log("Create Property Response:", response.error);
        throw new Error(response.error?.message || "Failed to create property");
      }
      const { id, imageUri } = response.data.data;

      if (imageUri && body.image) {
        // upload
        try {
          await uploadPreSign(imageUri, body.image.uri, (percent) => {
            console.log(`Upload progress: ${percent.toFixed(2)}%`);
          });
        } catch (err) {
          console.error("Error uploading image:", err);
        }
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}
