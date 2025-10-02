import { prisma } from "../lib/PrismaClient";
import { normalizeBDMobile } from "../lib/utils";

export async function listContacts(
	userId: string,
	page: number,
	pageSize: number,
) {
	const skip = (page - 1) * pageSize;
	const [items, total] = await Promise.all([
		prisma.userContact.findMany({
			where: { userId },
			include: { contact: true },
			skip,
			take: pageSize,
			orderBy: { createdAt: "desc" },
		}),
		prisma.userContact.count({ where: { userId } }),
	]);

	return {
		page,
		pageSize,
		total,
		items: items.map((uc) => ({
			id: uc.id,
			alias: uc.alias,
			labels: uc.labels,
			notes: uc.notes,
			phoneNumber: uc.contact?.phoneNumber,
			normalizedPhone: uc.contact?.normalizedPhone,
			createdAt: uc.createdAt,
		})),
	};
}

export async function addOrLinkContact(
	userId: string,
	input: {
		phone: string;
		alias?: string;
		labels?: string[];
		notes?: string;
	},
) {
	const norm = normalizeBDMobile(input.phone);
	const contact = await prisma.contact.upsert({
		where: { normalizedPhone: norm },
		create: { phoneNumber: input.phone, normalizedPhone: norm },
		update: {},
	});

	const uc = await prisma.userContact.upsert({
		where: { userId_contactId: { userId, contactId: contact.id } },
		create: {
			userId,
			contactId: contact.id,
			alias: input.alias ?? input.phone,
			labels: input.labels ?? [],
			notes: input.notes,
		},
		update: {
			alias: input.alias ?? input.phone,
			labels: input.labels ?? [],
			notes: input.notes,
		},
	});

	return {
		id: uc.id,
		alias: uc.alias,
		labels: uc.labels,
		notes: uc.notes,
		phoneNumber: contact.phoneNumber,
		normalizedPhone: contact.normalizedPhone,
	};
}

export async function updateContact(
	userId: string,
	userContactId: string,
	data: {
		alias?: string;
		labels?: string[];
		notes?: string;
	},
) {
	const existing = await prisma.userContact.findUnique({
		where: { id: userContactId },
	});
	if (!existing || existing.userId !== userId) {
		const err: any = new Error("Not found");
		err.status = 404;
		throw err;
	}
	return prisma.userContact.update({ where: { id: userContactId }, data });
}

export async function searchContacts(
	userId: string,
	q: string,
	mode: "alias" | "phone" | "auto",
) {
	// phone-first path
	if (mode === "phone" || mode === "auto") {
		const norm = normalizeBDMobile(q);
		if (norm) {
			const contact = await prisma.contact.findUnique({
				where: { normalizedPhone: norm },
			});
			if (contact) {
				const uc = await prisma.userContact.findUnique({
					where: { userId_contactId: { userId, contactId: contact.id } },
				});
				return [
					{
						phoneNumber: contact.phoneNumber,
						normalizedPhone: contact.normalizedPhone,
						alias: uc?.alias ?? contact.phoneNumber,
						labels: uc?.labels ?? [],
						notes: uc?.notes ?? null,
					},
				];
			}
			if (mode === "phone") return [];
		}
	}

	// alias search
	const aliasMatches = await prisma.userContact.findMany({
		where: { userId, alias: { contains: q, mode: "insensitive" } },
		include: { contact: true },
		take: 50,
	});

	return aliasMatches.map((uc) => ({
		phoneNumber: uc.contact?.phoneNumber,
		normalizedPhone: uc.contact?.normalizedPhone,
		alias: uc.alias,
		labels: uc.labels,
		notes: uc.notes,
	}));
}
