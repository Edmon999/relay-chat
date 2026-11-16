import { HealthResponse } from "@super/shared";

const health: HealthResponse = {
  status: "ok",
  timestamp: new Date().toISOString(),
};

const parseHealth = HealthResponse.parse(health);
console.log(parseHealth, "parseHealth");
