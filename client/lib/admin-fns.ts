import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getAdmin } from "./admin-auth.server";

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(
	async () => ({
		access: await getAdmin(),
	}),
);

export const logoutAdmin = createServerFn({ method: "POST" }).handler(
	async () => {
		throw redirect({ href: "/admin/login" });
	},
);
