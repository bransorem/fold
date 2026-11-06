export type Env = {
	DB: D1Database;
	BETTER_AUTH_SECRET: string;
	WEB_ORIGIN: string;
	API_ORIGIN: string;
	GOOGLE_CLIENT_ID?: string;
	GOOGLE_CLIENT_SECRET?: string;
	APPLE_CLIENT_ID?: string;
	APPLE_CLIENT_SECRET?: string;
};
