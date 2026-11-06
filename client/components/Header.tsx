import { useEffect, useState } from "react";
import { apiOrigin, authRequest } from "../lib/auth-client";
import ThemeToggle from "./ThemeToggle";

const navLinkClass =
	"font-bold nav-link relative inline-flex items-center py-3 text-[0.77rem] text-[var(--sea-ink-soft)] no-underline hover:text-[var(--sea-ink)]";

export default function Header() {
	const [user, setUser] = useState<{ name: string } | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	useEffect(() => {
		let active = true;
		fetch(`${apiOrigin}/api/auth/get-session`, { credentials: "include" })
			.then(async (response) => {
				if (!response.ok) return null;
				const result: unknown = await response.json();
				if (!result || typeof result !== "object" || !("user" in result))
					return null;
				const sessionUser = result.user;
				if (
					!sessionUser ||
					typeof sessionUser !== "object" ||
					!("name" in sessionUser) ||
					typeof sessionUser.name !== "string" ||
					!sessionUser.name
				) {
					return null;
				}
				return { name: sessionUser.name };
			})
			.then((result) => {
				if (active) setUser(result);
			})
			.catch(() => {
				if (active) setUser(null);
			});
		return () => {
			active = false;
		};
	}, []);

	return (
		<header className="border-b border-[var(--fire-line)] bg-[var(--header-bg)]">
			<nav className="mx-auto flex min-h-[78px] w-[min(1080px,_calc(100%_-_2rem))] items-center gap-8 max-[700px]:flex-wrap max-[700px]:py-4">
				<h2 className="m-0 font-sans text-[1.1rem] leading-[0.9] tracking-[0.08em]">
					<a
						href="/"
						className="flex items-center gap-2 text-[var(--fire-ink)] no-underline"
					>
						<span>
							FOLD
							<em className="mt-1 block text-[0.72em] not-italic tracking-[0.2em] text-[var(--fire-rust)]">
								BUILDER
							</em>
						</span>
					</a>
				</h2>
				<div className="ml-auto flex gap-7 max-[700px]:order-3 max-[700px]:w-full max-[700px]:justify-between max-[700px]:gap-2">
					{[["Home", ""]].map(([label, page]) => (
						<a
							key={label}
							href={page ? `/${page}` : "/"}
							className={navLinkClass}
						>
							{label}
						</a>
					))}
				</div>
				<div className="theme-toggle max-[700px]:ml-auto">
					<ThemeToggle />
				</div>
				{user ? (
					<div className="relative">
						<button
							type="button"
							className={navLinkClass}
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen(!menuOpen)}
						>
							{user.name}
						</button>
						{menuOpen && (
							<div className="absolute right-0 top-full z-20 mt-1 min-w-36 rounded border border-[var(--fire-line)] bg-[var(--surface)] p-1 shadow-lg">
								<a
									href="/settings"
									className="block rounded px-3 py-2 text-sm text-[var(--fire-ink)] no-underline hover:bg-[var(--surface-strong)]"
								>
									Settings
								</a>
								<button
									type="button"
									className="block w-full rounded px-3 py-2 text-left text-sm text-[var(--fire-ink)] hover:bg-[var(--surface-strong)]"
									onClick={async () => {
										await authRequest("/api/auth/sign-out", {});
										setUser(null);
										setMenuOpen(false);
									}}
								>
									Log out
								</button>
							</div>
						)}
					</div>
				) : (
					<a href="/login" className={navLinkClass}>
						Sign in
					</a>
				)}
			</nav>
		</header>
	);
}
