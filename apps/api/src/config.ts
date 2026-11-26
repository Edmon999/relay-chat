import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  HOST: z.string().default("127.0.0.1"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url(),
});

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:\n" + z.prettifyError(result.error));
  process.exit(1);
}

export const config = result.data;
