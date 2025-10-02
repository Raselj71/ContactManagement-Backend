import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";
import { fail } from "../lib/common";

export function validateBody<T>(schema: ZodSchema<T>) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			req.body = schema.parse(req.body);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				const problems = err.errors.map((e) => ({
					path: e.path.join("."),
					message: e.message,
					code: e.code,
				}));
				return res
					.status(422)
					.json(fail("Validation failed", 422, { errors: problems }));
			}
			return res.status(400).json(fail("Invalid request body", 400));
		}
	};
}

export function validateQuery<T>(schema: ZodSchema<T>) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			req.query = schema.parse(req.query);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				const problems = err.errors.map((e) => ({
					path: e.path.join("."),
					message: e.message,
					code: e.code,
				}));
				return res
					.status(422)
					.json(fail("Validation failed", 422, { errors: problems }));
			}
			return res.status(400).json(fail("Invalid query parameters", 400));
		}
	};
}
