import z from "zod/v4";

export type Nullable<T> = T | null | undefined;

export const baseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

z.globalRegistry.add(baseResponseSchema, { id: "BaseResponse" });

export type BaseResponse = z.infer<typeof baseResponseSchema>;

export const baseResponseWithPagingSchema = baseResponseSchema.extend({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  hasMore: z.boolean(),
});

z.globalRegistry.add(baseResponseWithPagingSchema, {
  id: "BaseResponseWithPaging",
});

export type BaseResponseWithPaging = z.infer<
  typeof baseResponseWithPagingSchema
>;

export const imageTypes = ["image/jpeg", "image/png"] as const;

export const imageUploadRequestSchema = z.object({
  name: z.string(),
  uri: z.string(),
  type: z.enum(imageTypes, "Invalid file type. Only JPEG and PNG are allowed."),
  size: z
    .number()
    .int()
    .max(10 * 1024 * 1024), // Max 10MB
});
export type ImageUploadRequest = z.infer<typeof imageUploadRequestSchema>;

z.globalRegistry.add(imageUploadRequestSchema, {
  id: "ImageUploadRequest",
});

export type WithOrganizationId<T> = T & { organizationId: number };

export type WithUserIdAndOrganizationId<T> = T & {
  organizationId: number;
  userId: number;
};
