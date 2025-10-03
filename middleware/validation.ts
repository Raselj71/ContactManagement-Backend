import type { NextFunction, Request, Response } from "express";
import type z from "zod";
import type { ZodSchema, ZodTypeAny } from "zod";
import { fail } from "../lib/common";

function issuesToProblems(issues: z.ZodIssue[]) {
	return issues.map((e) => ({
		path: e.path.join("."),
		message: e.message,
		code: e.code,
	}));
}
export function validateBody<T extends ZodTypeAny>(schema: T) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			return res
				.status(422)
				.json(
					fail("Validation failed", 422, {
						errors: issuesToProblems(result.error.issues),
					}),
				);
		}
		(res.locals as any).body = result.data;
		next();
	};
}

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.query);
		if (!result.success) {
			const problems = result.error.issues.map((e) => ({
				path: e.path.join("."),
				message: e.message,
				code: e.code,
			}));
			return res
				.status(422)
				.json(fail("Validation failed", 422, { errors: problems }));
		}

		(res.locals as any).query = result.data;
		next();
	};
}
