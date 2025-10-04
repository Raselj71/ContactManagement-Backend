import { Router } from "express";
import {
	addContactController,
	deleteContactController,
	getContactByIdController,
	getContactsController,
	updateContactController,
} from "../controller/contact.controller";
import { requireAuth } from "../middleware/auth";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "../middleware/validation";
import {
	addContactSchema,
	combinedQuerySchema,
	contactIdParamSchema,
	updateContactSchema,
} from "../validator/contact.validator";

export const contactsRouter = Router();

contactsRouter.get(
	"/",
	requireAuth,
	validateQuery(combinedQuerySchema),
	getContactsController,
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
	"/:userContactId",
	requireAuth,
	validateParams(contactIdParamSchema),
	getContactByIdController,
);

contactsRouter.delete(
	"/:userContactId",
	requireAuth,
	validateParams(contactIdParamSchema),
	deleteContactController,
);
