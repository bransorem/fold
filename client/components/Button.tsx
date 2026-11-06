import type { ReactNode } from "react";

type ButtonProps = {
	href: string;
	variant?: "primary" | "outline";
	className?: string;
	children: ReactNode;
};

const variantClassNames = {
	primary: "bg-[var(--button-bg)]",
	outline: "border border-white/80",
};

export default function Button({
	href,
	variant = "primary",
	className = "",
	children,
}: ButtonProps) {
	return (
		<a
			href={href}
			className={`inline-flex items-center justify-center rounded-[5px] px-[1.45rem] py-3 text-[0.75rem] font-bold text-white no-underline transition-transform hover:-translate-y-0.5 hover:!text-white ${variantClassNames[variant]} ${className}`}
		>
			{children}
		</a>
	);
}
