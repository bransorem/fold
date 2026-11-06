import { betterAuth } from "better-auth";
import type { Env } from "./env";

export function createAuth(env: Env) {
	const apiHostname = new URL(env.API_ORIGIN).hostname;
	const socialProviders = {
		...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
			? {
					google: {
						clientId: env.GOOGLE_CLIENT_ID,
						clientSecret: env.GOOGLE_CLIENT_SECRET,
					},
				}
			: {}),
		...(env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET
			? {
					apple: {
						clientId: env.APPLE_CLIENT_ID,
						clientSecret: env.APPLE_CLIENT_SECRET,
					},
				}
			: {}),
	};
	return betterAuth({
		baseURL: env.API_ORIGIN,
		trustedOrigins: [env.WEB_ORIGIN],
		basePath: "/api/auth",
		secret: env.BETTER_AUTH_SECRET,
		database: env.DB,
		emailAndPassword: { enabled: true },
		socialProviders: socialProviders,
		advanced: {
			...(apiHostname === "api.fold.localhost"
				? {
						crossSubDomainCookies: {
							enabled: true,
							domain: "fold.localhost",
						},
					}
				: {}),
			defaultCookieAttributes: {
				sameSite: "lax",
				secure: env.API_ORIGIN.startsWith("https://"),
				httpOnly: true,
			},
		},
	});
}
