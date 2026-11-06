import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SocialSignInButtons from "#/components/SocialSignInButtons";
import { authRequest } from "#/lib/auth-client";

export const Route = createFileRoute("/signup")({
	component: SignupPage,
});

function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [accountCreated, setAccountCreated] = useState(false);

	async function submit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitting(true);
		setError(null);
		try {
			await authRequest("/api/signup", {
				name,
				email,
				password,
			});
			await authRequest("/api/auth/sign-out", {}).catch(() => undefined);
			setAccountCreated(true);
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Could not create your account.",
			);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="mx-auto w-[min(440px,_calc(100%_-_2rem))] py-16">
			{accountCreated ? (
				<>
					<p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--fire-rust)]">
						Account request received
					</p>
					<h1 className="mb-4 font-['Lato',sans-serif] text-3xl font-bold">
						Awaiting authorization
					</h1>
					<p className="text-sm text-[var(--fire-muted)]">
						Your account was created.
					</p>
				</>
			) : (
				<>
					<p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--fire-rust)]">
						Join
					</p>
					<h1 className="mb-6 font-['Lato',sans-serif] text-3xl font-bold">
						Create your account
					</h1>
					<form
						onSubmit={submit}
						className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6"
					>
						<label className="flex flex-col gap-1 text-sm font-bold">
							Name
							<input
								autoComplete="name"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="rounded border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-normal"
							/>
						</label>
						<label className="flex flex-col gap-1 text-sm font-bold">
							Email
							<input
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="rounded border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-normal"
							/>
						</label>
						<label className="flex flex-col gap-1 text-sm font-bold">
							Password
							<input
								type="password"
								autoComplete="new-password"
								minLength={8}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="rounded border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-normal"
							/>
						</label>
						{error && (
							<p role="alert" className="text-sm text-[var(--fire-rust)]">
								{error}
							</p>
						)}
						<button
							type="submit"
							disabled={submitting}
							className="rounded bg-[var(--button-bg)] px-4 py-2 font-bold text-white disabled:opacity-60"
						>
							{submitting ? "Creating account…" : "Sign up"}
						</button>
					</form>
					<div className="my-5 flex items-center gap-3 text-xs text-[var(--fire-muted)]">
						<span className="h-px flex-1 bg-[var(--line)]" />
						or sign up with
						<span className="h-px flex-1 bg-[var(--line)]" />
					</div>
					<SocialSignInButtons />
					<p className="mt-5 text-sm text-[var(--fire-muted)]">
						Already have an account?{" "}
						<a href="/login" className="font-bold text-[var(--fire-rust)]">
							Sign in
						</a>
						.
					</p>
				</>
			)}
		</main>
	);
}
