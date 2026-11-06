import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Main,
});

function Main() {
	return (
		<main className="mx-auto flex min-h-[65vh] w-[min(1080px,_calc(100%_-_2rem))] flex-col items-center justify-center py-20 text-center">
			<section className="mt-12 w-full max-w-2xl text-left">
				<p className="mb-16 text-center text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--fire-rust)]">
					Let your app unfold.
				</p>
				<h2 className="mb-4 text-center font-['Lato',sans-serif] text-2xl font-bold">
					Fold
				</h2>
				<p className="text-center text-sm text-[var(--fire-muted)] mb-24">
					Fold helps you build cool things.
				</p>
			</section>
		</main>
	);
}
