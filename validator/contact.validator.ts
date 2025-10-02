import { z } from "zod";
import { bdMobile } from "./auth.validator";

export const listQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20),
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

export const searchQuerySchema = z.object({
	q: z.string().trim().min(1),
	mode: z.enum(["alias", "phone", "auto"]).default("auto"),
});
