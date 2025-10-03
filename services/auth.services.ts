import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/PrismaClient";
import { normalizeBDMobile } from "../lib/utils";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser(data: {
	email: string;
	password: string;
	profile: {
		firstName: string;
		lastName: string;
		otherEmails?: string[];
		contacts?: { phone: string; alias: string }[];
	};
}) {
	const exists = await prisma.user.findUnique({ where: { email: data.email } });
	if (exists) {
		const err: any = new Error("Email already registered");
		err.status = 409;
		throw err;
	}

	const passwordHash = await bcrypt.hash(data.password, 10);
	const user = await prisma.user.create({
		data: { email: data.email, passwordHash },
	});

	const userProfile = await prisma.profile.create({
		data: {
			userId: user.id,
			firstName: data.profile.firstName,
			lastName: data.profile.lastName,
			otherEmails: data.profile.otherEmails ?? [],
			initialContacts: (data.profile.contacts ?? []).map((c) => ({
				phone: c.phone,
				alias: c.alias,
			})),
		},
	});

	for (const c of data.profile.contacts ?? []) {
		const norm = normalizeBDMobile(c.phone);
		if (!norm) continue;

		const contact = await prisma.contact.upsert({
			where: { normalizedPhone: norm },
			create: { phoneNumber: c.phone, normalizedPhone: norm },
			update: {},
		});

		await prisma.userContact.upsert({
			where: { userId_contactId: { userId: user.id, contactId: contact.id } },
			create: {
				userId: user.id,
				contactId: contact.id,
				alias: c.alias,
				labels: [],
			},
			update: { alias: c.alias },
		});
	}

	return { userProfile };
}

export async function loginUser(email: string, password: string) {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		const err: any = new Error("Invalid credentials");
		err.status = 401;
		throw err;
	}
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) {
		const err: any = new Error("Invalid credentials");
		err.status = 401;
		throw err;
	}
	const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
	return { token };
}
