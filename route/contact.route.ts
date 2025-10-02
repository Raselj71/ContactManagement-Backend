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

contactsRouter.use(requireAuth);

contactsRouter.get("/", validateQuery(listQuerySchema), listContactsController);
contactsRouter.post("/", validateBody(addContactSchema), addContactController);
contactsRouter.patch(
	"/:userContactId",
	validateBody(updateContactSchema),
	updateContactController,
);
contactsRouter.get(
	"/search",
	validateQuery(searchQuerySchema),
	searchContactsController,
);
