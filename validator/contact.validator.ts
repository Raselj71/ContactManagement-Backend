import { z } from "zod";
import { bdMobile } from "./auth.validator";

export const combinedQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
	q: z
		.string()
		.transform((v) => (typeof v === "string" ? v.trim() : v))
		.optional()
		.transform((v) => (v === "" ? undefined : v)),
	mode: z.enum(["alias", "phone", "auto"]).default("auto").optional(),

	sortBy: z.enum(["createdAt"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const addContactSchema = z.object({
	phone: bdMobile,
	alias: z.string().trim().min(1).max(80).optional(),
	labels: z.array(z.string().trim().min(1)).max(20).default([]),
	notes: z.string().trim().max(500).optional(),
});

export const updateContactSchema = z
	.object({
		alias: z.string().trim().min(1).max(80).optional(),
		labels: z.array(z.string().trim().min(1)).max(20).optional(),
		notes: z.string().trim().max(500).optional(),
	})
	.refine((obj) => Object.keys(obj).length > 0, {
		message: "No updates provided",
	});

export const contactIdParamSchema = z.object({
	userContactId: z.string().min(1, "userContactId is required"),
});
