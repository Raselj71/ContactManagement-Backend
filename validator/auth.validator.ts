import { z } from "zod";
import { isValidBDMobile } from "../lib/utils";

export const bdMobile = z.string().refine(isValidBDMobile, {
	message:
		"Phone must be a valid Bangladesh mobile number (01XXXXXXXXX or +8801XXXXXXXXX)",
});

export const strongPassword = z.string().min(8).max(72);

export const registerSchema = z.object({
	email: z.string().email().toLowerCase(),
	password: strongPassword,
	profile: z.object({
		firstName: z.string().trim().min(1).max(60),
		lastName: z.string().trim().min(1).max(60),
		otherEmails: z.array(z.string().email().toLowerCase()).max(10).optional(),
		contacts: z
			.array(
				z.object({
					phone: bdMobile,
					alias: z.string().trim().min(1).max(80),
				}),
			)
			.max(100)
			.optional(),
	}),
});

export const loginSchema = z.object({
	email: z.string().email().toLowerCase(),
	password: z.string().min(6),
});
