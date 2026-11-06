import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { apiOrigin, authRequest } from "../lib/auth-client";

export const Route = createFileRoute("/auth/callback")({
	component: SocialAuthCallback,
});

function SocialAuthCallback() {
	const [error, setError] = useState<string | null>(null);
	const [pendingAuthorization, setPendingAuthorization] = useState(false);

	useEffect(() => {
		let active = true;
		async function finish() {
			try {
				const statusResponse = await fetch(`${apiOrigin}/api/account-status`, {
					credentials: "include",
				});
				const status = (await statusResponse.json()) as {
					authorized?: boolean;
				};
				if (!statusResponse.ok || !status.authorized) {
					await authRequest("/api/auth/sign-out", {}).catch(() => undefined);
					if (active) setPendingAuthorization(true);
					return;
				}
			} catch (cause) {
				if (active)
					setError(
						cause instanceof Error
							? cause.message
							: "Could not complete sign in.",
					);
			}
		}
		void finish();
		return () => {
			active = false;
		};
	}, []);

	return (
		<main className="mx-auto w-[min(440px,_calc(100%_-_2rem))] py-16">
			{pendingAuthorization ? (
				<>
					<h1 className="mb-3 text-2xl font-bold">Awaiting authorization</h1>
					<p className="text-sm text-[var(--fire-muted)]">
						Your account must be authorized by an administrator before you can
						use logged in features.
					</p>
				</>
			) : error ? (
				<>
					<h1 className="mb-3 text-2xl font-bold">
						Sign in could not be completed
					</h1>
					<p role="alert" className="mb-5 text-sm text-[var(--fire-rust)]">
						{error}
					</p>
					<a href="/login" className="font-bold text-[var(--fire-rust)]">
						Return to sign in
					</a>
				</>
			) : (
				<p>Completing sign in…</p>
			)}
		</main>
	);
}
