import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./auth";
import type { Env } from "./env";

type Variables = { auth: ReturnType<typeof createAuth> };

export function createApp(authFactory = createAuth) {
	const app = new Hono<{ Bindings: Env; Variables: Variables }>();
	app.use("/api/*", async (c, next) => {
	// Both hostnames are used for the public site. Keep the configured origin
	// for preview/local environments while allowing the www production alias.
		const origins = getAllowedOrigins(c.env.WEB_ORIGIN);
		return cors({
		origin: origins,
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
 		})(c, next);
	});

	app.use("/api/*", async (c, next) => {
		c.set("auth", authFactory(c.env));
		await next();
	});

	app.on(["GET", "POST"], "/api/auth/*", (c) =>
		c.get("auth").handler(c.req.raw),
	);

 	app.notFound((c) => c.json({ error: "Not found" }, 404));
	app.onError((error, c) => {
		console.error(error);
		const origin = c.req.header("Origin");
		if (origin && getAllowedOrigins(c.env.WEB_ORIGIN).includes(origin)) {
			c.header("Access-Control-Allow-Origin", origin);
			c.header("Access-Control-Allow-Credentials", "true");
			c.header("Vary", "Origin");
		}
		return c.json({ error: "Internal server error" }, 500);
	});
	return app;
}

export function getAllowedOrigins(configuredOrigin: string) {
	return [
		configuredOrigin,
		"https://fold.localhost",
		"https://api.fold.localhost",
	];
}

const app = createApp();
export default app;
