import { describe, expect, test } from "bun:test";

const { createApp, getAllowedOrigins } = await import("./app");
const app = createApp(() => ({
	handler: async () => new Response("auth ok"),
}) as ReturnType<(typeof import("./auth"))["createAuth"]>);

describe("app not-found handler", () => {
	test("returns a JSON 404 for an unknown route", async () => {
		const response = await app.request("/missing");

		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({ error: "Not found" });
	});
});

describe("API routes", () => {
	test("applies credentialed CORS to an allowed origin", async () => {
		const response = await app.request(
			"/api/auth/session",
			{ headers: { Origin: "https://fold.localhost" } },
			{
				WEB_ORIGIN: "https://example.com",
				API_ORIGIN: "https://api.example.com",
				BETTER_AUTH_SECRET: "test-secret",
				DB: {} as D1Database,
			},
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
			"https://fold.localhost",
		);
		expect(response.headers.get("Access-Control-Allow-Credentials")).toBe("true");
	});

	test("serves the auth handler for GET auth requests", async () => {
		const response = await app.request("/api/auth/session", {}, {
			WEB_ORIGIN: "https://example.com",
			API_ORIGIN: "https://api.example.com",
			BETTER_AUTH_SECRET: "test-secret",
			DB: {} as D1Database,
		});

		expect(response.status).toBe(200);
		expect(await response.text()).toBe("auth ok");
	});
});

describe("getAllowedOrigins", () => {
	test("keeps the configured web origin first", () => {
		expect(getAllowedOrigins("https://preview.example.com")).toEqual([
			"https://preview.example.com",
			"https://fold.localhost",
			"https://api.fold.localhost",
		]);
	});

	test("includes both local Fold origins", () => {
		const origins = getAllowedOrigins("http://localhost:3000");

		expect(origins).toContain("https://fold.localhost");
		expect(origins).toContain("https://api.fold.localhost");
	});
});
