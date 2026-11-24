import Fastify, { type FastifyServerOptions } from "fastify";
import type { HealthResponse } from "@super/shared";

export function buildApp(options: FastifyServerOptions = {}) {
  const app = Fastify(options);

  app.get("/health", async (): Promise<HealthResponse> => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  return app;
}
