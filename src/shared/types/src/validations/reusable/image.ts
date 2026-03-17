import { z } from "zod";

export const imageSchema = z.object({
  name: z.string().max(255),
  fileSize: z
    .number()
    .gt(0)
    .lt(5 * 1024 * 1024), // 5MB limit
  type: z.mime(["image/jpeg", "image/png"]),
});

export type Image = z.infer<typeof imageSchema>;
