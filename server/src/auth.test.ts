import { afterEach, describe, expect, mock, test } from "bun:test";
import type { Env } from "./env";

const betterAuth = mock((options: unknown) => options);
mock.module("better-auth", () => ({ betterAuth }));

const { createAuth } = await import("./auth");

afterEach(() => betterAuth.mockClear());

function makeEnv(overrides: Partial<Env> = {}): Env {
	return {
		API_ORIGIN: "https://api.example.com",
		WEB_ORIGIN: "https://example.com",
		BETTER_AUTH_SECRET: "test-secret",
		DB: {} as D1Database,
		...overrides,
	};
}

describe("createAuth", () => {
	test("configures email auth and trusted origins", () => {
		createAuth(makeEnv());

		const options = betterAuth.mock.calls[0]?.[0] as Record<string, any>;
		expect(options.baseURL).toBe("https://api.example.com");
		expect(options.trustedOrigins).toEqual(["https://example.com"]);
		expect(options.basePath).toBe("/api/auth");
		expect(options.emailAndPassword).toEqual({ enabled: true });
		expect(options.socialProviders).toEqual({});
	});

	test("enables a social provider only when both credentials exist", () => {
		createAuth(
			makeEnv({ GOOGLE_CLIENT_ID: "google-id", APPLE_CLIENT_SECRET: "apple-secret" }),
		);

		const options = betterAuth.mock.calls[0]?.[0] as Record<string, any>;
		expect(options.socialProviders).toEqual({});
	});

	test("configures complete Google and Apple providers", () => {
		createAuth(
			makeEnv({
				GOOGLE_CLIENT_ID: "google-id",
				GOOGLE_CLIENT_SECRET: "google-secret",
				APPLE_CLIENT_ID: "apple-id",
				APPLE_CLIENT_SECRET: "apple-secret",
			}),
		);

		const options = betterAuth.mock.calls[0]?.[0] as Record<string, any>;
		expect(options.socialProviders).toEqual({
			google: { clientId: "google-id", clientSecret: "google-secret" },
			apple: { clientId: "apple-id", clientSecret: "apple-secret" },
		});
	});

	test("uses secure cookies for HTTPS and enables local cross-subdomain cookies", () => {
		createAuth(
			makeEnv({
				API_ORIGIN: "http://api.fold.localhost:8000",
			}),
		);

		const options = betterAuth.mock.calls[0]?.[0] as Record<string, any>;
		expect(options.advanced.crossSubDomainCookies).toEqual({
			enabled: true,
			domain: "fold.localhost",
		});
		expect(options.advanced.defaultCookieAttributes).toEqual({
			sameSite: "lax",
			secure: false,
			httpOnly: true,
		});
	});
});
