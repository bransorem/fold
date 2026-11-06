import { getRequestHeader } from "@tanstack/react-start/server";
import { apiOrigin } from "./auth-client";

export type AdminAccess = "admin" | "signed-out" | "no-access" | "unavailable";

export async function getAdmin(): Promise<AdminAccess> {
	const cookie = getRequestHeader("cookie");
	if (!cookie) return "signed-out";
	const response = await fetch(`${apiOrigin}/api/admin`, {
		headers: { cookie },
	});
	if (response.status === 401) return "signed-out";
	if (response.status === 403) return "no-access";
	if (!response.ok) return "unavailable";
	const result = (await response.json()) as { isAdmin?: boolean };
	return result.isAdmin === true ? "admin" : "no-access";
}

export async function isAdminAuthenticated() {
	return (await getAdmin()) === "admin";
}
