import { describe, expect, it } from "vitest";
import { buildApp } from "./app.ts";
import { HealthResponse } from "@super/shared";

describe("GET health", () => {
  it("returns 200 with a valid body", async () => {
    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
    const body = HealthResponse.parse(response.json());
    expect(body.status).toBe("ok");

    await app.close();
  });
});
