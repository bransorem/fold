export const apiOrigin =
	(import.meta.env.VITE_API_ORIGIN as string | undefined) ??
	"http://localhost:8000";

export async function authRequest<T>(path: string, body: unknown): Promise<T> {
	const response = await fetch(`${apiOrigin}${path}`, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	const result = (await response.json()) as T & {
		message?: string;
		error?: string;
	};
	if (!response.ok) {
		throw new Error(
			result.message ?? result.error ?? "Could not complete request.",
		);
	}
	return result;
}

export async function startSocialSignIn(provider: "google" | "apple") {
	const callback = new URL("/auth/callback", window.location.origin);
	const result = await authRequest<{ url?: string; message?: string }>(
		"/api/auth/sign-in/social",
		{ provider, callbackURL: callback.toString() },
	);
	if (!result.url) throw new Error("Could not start social sign in.");
	window.location.assign(result.url);
}
