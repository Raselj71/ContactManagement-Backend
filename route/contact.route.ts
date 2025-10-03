import { Router } from "express";
import {
	addContactController,
	listContactsController,
	searchContactsController,
	updateContactController,
} from "../controller/contact.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validation";
import {
	addContactSchema,
	listQuerySchema,
	searchQuerySchema,
	updateContactSchema,
} from "../validator/contact.validator";

export const contactsRouter = Router();

contactsRouter.get(
	"/",
	requireAuth,
	validateQuery(listQuerySchema),
	listContactsController,
);

contactsRouter.post(
	"/",
	requireAuth,
	validateBody(addContactSchema),
	addContactController,
);

contactsRouter.put(
	"/:userContactId",
	requireAuth,
	validateBody(updateContactSchema),
	updateContactController,
);

contactsRouter.get(
	"/search",
	requireAuth,
	validateQuery(searchQuerySchema),
	searchContactsController,
);
