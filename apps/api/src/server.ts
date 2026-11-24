import { config } from "./config.ts";
import { buildApp } from "./app.ts";

const app = buildApp({ logger: true });

try {
  await app.listen({ port: config.PORT, host: config.HOST });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
