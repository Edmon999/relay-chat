import { z } from "zod";

export const HealthResponse = z.object({
  status: z.literal("ok"),
  timestamp: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof HealthResponse>;
