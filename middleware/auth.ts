import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
export interface AuthedRequest extends Request {
	userId?: string;
}

export function requireAuth(
	req: AuthedRequest,
	res: Response,
	next: NextFunction,
) {
	const header = req.headers.authorization;
	if (!header?.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({
				success: false,
				payload: null,
				message: "Missing token",
				status: 401,
			});
	}
	try {
		const token = header.slice(7);
		const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
		req.userId = payload.userId;
		next();
	} catch {
		return res
			.status(401)
			.json({
				success: false,
				payload: null,
				message: "Invalid token",
				status: 401,
			});
	}
}
