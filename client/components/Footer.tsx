export default function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className="border-t border-[var(--line)] bg-[color-mix(in_oklab,var(--header-bg)_84%,transparent_16%)] py-7 text-[var(--fire-muted)]">
			<div className="mx-auto w-[min(1080px,_calc(100%_-_2rem))] font-sans text-[1.1rem] leading-[0.9] tracking-[0.08em]">
				FOLD
				<small className="mt-2 block text-[0.5rem] tracking-[0.16em]">
					BUILD · SOMETHING · COOL
				</small>
			</div>
			<div className="mx-auto mt-6 flex w-[min(1080px,_calc(100%_-_2rem))] items-center justify-between border-t border-[var(--fire-line)] pt-3 text-[0.55rem] max-[700px]:items-start max-[700px]:flex-col max-[700px]:gap-4">
				<span>&copy; {year} All rights reserved.</span>
				<span>Build something cool with 🤖</span>
			</div>
		</footer>
	);
}
