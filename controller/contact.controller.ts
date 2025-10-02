import type { Response } from "express";
import { created, fail, ok } from "../lib/common";
import type { AuthedRequest } from "../middleware/auth";
import {
	addOrLinkContact,
	listContacts,
	searchContacts,
	updateContact,
} from "../services/contact.services";

export async function listContactsController(
	req: AuthedRequest,
	res: Response,
) {
	try {
		const { page, pageSize } = req.query as any;
		const data = await listContacts(
			req.userId!,
			Number(page),
			Number(pageSize),
		);
		return res.json(ok(data));
	} catch (e: any) {
		return res.status(400).json(fail(e?.message ?? "Bad request", 400));
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

export async function searchContactsController(
	req: AuthedRequest,
	res: Response,
) {
	try {
		const { q, mode } = req.query as any;
		const items = await searchContacts(req.userId!, String(q), mode);
		const msg =
			mode === "phone" && items.length === 0
				? "No phone match"
				: mode === "phone"
					? "Phone match"
					: "Alias matches";
		return res.json(ok(items, msg));
	} catch (e: any) {
		return res.status(400).json(fail(e?.message ?? "Bad request", 400));
	}
}
