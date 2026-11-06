import { useState } from "react";
import { startSocialSignIn } from "#/lib/auth-client";

export default function SocialSignInButtons() {
	const [error, setError] = useState<string | null>(null);
	const [connecting, setConnecting] = useState(false);

	async function signIn() {
		setConnecting(true);
		setError(null);
		try {
			await startSocialSignIn("google");
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Could not sign in with Google.",
			);
			setConnecting(false);
		}
	}

	return (
		<div className="flex flex-col gap-3">
			<button
				type="button"
				disabled={connecting}
				onClick={signIn}
				className="rounded border border-[var(--line)] bg-[var(--surface)] px-4 py-2 font-bold text-[var(--fire-ink)] disabled:opacity-60"
			>
				{connecting ? "Connecting…" : "Continue with Google"}
			</button>
			{error && (
				<p role="alert" className="text-sm text-[var(--fire-rust)]">
					{error}
				</p>
			)}
		</div>
	);
}
