import type { Response } from "express";
import { created, fail, ok } from "../lib/common";
import type { AuthedRequest } from "../middleware/auth";
import {
	addOrLinkContact,
	deleteUserContact,
	getUserContactById,
	listContacts,
	searchContacts,
	updateContact,
} from "../services/contact.services";

export async function getContactsController(req: AuthedRequest, res: Response) {
	try {
		const {
			page = 1,
			pageSize = 20,
			q,
			mode = "auto",
			sortBy = "createdAt",
			sortOrder = "desc",
		} = req.query as any;

		const pageNum = Number(page);
		const size = Number(pageSize);

		if (q && String(q).trim().length > 0) {
			const term = String(q).trim();
			const results = await searchContacts(req.userId!, term, mode as any);

			const msg =
				mode === "phone" && results.length === 0
					? "No phone match"
					: mode === "phone"
						? "Phone match"
						: "Alias matches";

			const start = (pageNum - 1) * size;
			const end = start + size;
			const sliced = results.slice(start, end);

			return res.json(
				ok(
					{
						page: pageNum,
						pageSize: size,
						total: results.length,
						items: sliced,
					},
					msg,
				),
			);
		}

		const data = await listContacts(
			req.userId!,
			pageNum,
			size,
			sortBy as "createdAt",
			sortOrder as "asc" | "desc",
		);
		return res.json(ok(data));
	} catch (e: any) {
		return res
			.status(e?.status ?? 400)
			.json(fail(e?.message ?? "Bad request", e?.status ?? 400));
	}
}

export async function addContactController(req: AuthedRequest, res: Response) {
	try {
		const data = await addOrLinkContact(req.userId!, req.body);
		return res.status(201).json(created(data, "Contact linked/created"));
	} catch (e: any) {
		return res.status(400).json(fail(e?.message ?? "Bad request", 400));
	}
}

export async function updateContactController(
	req: AuthedRequest,
	res: Response,
) {
	try {
		const data = await updateContact(
			req.userId!,
			req.params.userContactId,
			req.body,
		);
		return res.json(ok(data, "Contact updated"));
	} catch (e: any) {
		return res
			.status(e?.status ?? 400)
			.json(fail(e?.message ?? "Bad request", e?.status ?? 400));
	}
}

export async function getContactByIdController(
	req: AuthedRequest,
	res: Response,
) {
	try {
		const { userContactId } = req.params as { userContactId: string };
		const data = await getUserContactById(req.userId!, userContactId);
		return res.json(ok(data));
	} catch (e: any) {
		return res
			.status(e?.status ?? 400)
			.json(fail(e?.message ?? "Bad request", e?.status ?? 400));
	}
}

export async function deleteContactController(
	req: AuthedRequest,
	res: Response,
) {
	try {
		const { userContactId } = req.params as { userContactId: string };
		const result = await deleteUserContact(req.userId!, userContactId);
		return res.json(ok(result, "Contact deleted"));
	} catch (e: any) {
		return res
			.status(e?.status ?? 400)
			.json(fail(e?.message ?? "Bad request", e?.status ?? 400));
	}
}
