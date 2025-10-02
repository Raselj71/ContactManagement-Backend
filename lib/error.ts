import type { NextFunction, Request, Response } from "express";
import { fail } from "./common";

export function errorHandler(
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	const status = typeof err?.status === "number" ? err.status : 500;
	const message = err?.message || "Internal Server Error";
	res.status(status).json(fail(message, status));
}
