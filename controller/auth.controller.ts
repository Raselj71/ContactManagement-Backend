import type { Request, Response } from "express";
import { created, fail, ok } from "../lib/common";
import { loginUser, registerUser } from "../services/auth.services";

export async function registerController(req: Request, res: Response) {
	try {
		const result = await registerUser(req.body);
		return res.status(201).json(created(result, "Registered"));
	} catch (e: any) {
		return res
			.status(e?.status ?? 400)
			.json(fail(e?.message ?? "Bad request", e?.status ?? 400));
	}
}

export async function loginController(req: Request, res: Response) {
	try {
		const result = await loginUser(req.body.email, req.body.password);
		return res.json(ok(result, "Logged in"));
	} catch (e: any) {
		return res
			.status(e?.status ?? 400)
			.json(fail(e?.message ?? "Bad request", e?.status ?? 400));
	}
}
