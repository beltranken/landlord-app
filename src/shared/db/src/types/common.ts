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

export const baseRequestWithPagingSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(50).optional(),
});
export type BaseRequestWithPaging = z.infer<typeof baseRequestWithPagingSchema>;

export type BaseResponseWithPaging = z.infer<
  typeof baseResponseWithPagingSchema
>;

export const imageTypes = ["image/jpeg", "image/png"] as const;

export type ImageType = (typeof imageTypes)[number];

export const imageUploadRequestSchema = z.object({
  name: z.string(),
  uri: z.string().min(1, "URI is required"),
  type: z.enum(imageTypes, "Invalid file type. Only JPEG and PNG are allowed."),
  size: z
    .number()
    .int()
    .gt(0, "File size must be greater than 0")
    .max(10 * 1024 * 1024, "File size must be less than 10MB"), // Max 10MB
});
export type ImageUploadRequest = z.infer<typeof imageUploadRequestSchema>;

z.globalRegistry.add(imageUploadRequestSchema, {
  id: "ImageUploadRequest",
});

export type WithOrganizationId<T = {}> = T & { organizationId: number };

export type WithUserIdAndOrganizationId<T = {}> = T & {
  organizationId: number;
  userId: number;
};

export const documentTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
] as const;

export type DocumentType = (typeof documentTypes)[number];

export const documentUploadRequestSchema = imageUploadRequestSchema.extend({
  type: z.enum(
    documentTypes,
    "Invalid file type. Only JPEG, PNG, PDF, and DOC are allowed.",
  ),
});

export type DocumentUploadRequest = z.infer<typeof documentUploadRequestSchema>;

z.globalRegistry.add(documentUploadRequestSchema, {
  id: "DocumentUploadRequest",
});
