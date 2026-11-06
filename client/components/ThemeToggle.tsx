import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

type ThemeMode = "light" | "dark";

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") {
		return "light";
	}

	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark") {
		return stored;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyThemeMode(mode: ThemeMode) {
	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(mode);
	document.documentElement.setAttribute("data-theme", mode);
	document.documentElement.style.colorScheme = mode;
}

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("light");

	useEffect(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		applyThemeMode(initialMode);
	}, []);

	function toggleMode() {
		const nextMode: ThemeMode = mode === "light" ? "dark" : "light";
		setMode(nextMode);
		applyThemeMode(nextMode);
		window.localStorage.setItem("theme", nextMode);
	}

	const label = `Theme mode: ${mode}. Click to switch to ${mode === "light" ? "dark" : "light"} mode.`;
	const Icon = mode === "dark" ? FiMoon : FiSun;

	return (
		<button
			type="button"
			onClick={toggleMode}
			aria-label={label}
			title={label}
			className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] p-2 text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
		>
			<Icon aria-hidden="true" />
		</button>
	);
}
