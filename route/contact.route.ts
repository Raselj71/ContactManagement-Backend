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

/**
 * @swagger
 * tags:
 *   - name: Contacts
 *     description: Contacts management
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: List contacts (paginated)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Contacts page
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     payload:
 *                       $ref: '#/components/schemas/ContactsPage'
 */
contactsRouter.get(
	"/",
	requireAuth,
	validateQuery(listQuerySchema),
	listContactsController,
);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create or link a contact (BD-only phone)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactCreate'
 *     responses:
 *       201:
 *         description: Contact linked/created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
contactsRouter.post(
	"/",
	requireAuth,
	validateBody(addContactSchema),
	addContactController,
);

/**
 * @swagger
 * /contacts/{userContactId}:
 *   patch:
 *     summary: Update alias/labels/notes of my contact link
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userContactId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactCreate'
 *     responses:
 *       200:
 *         description: Contact updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
contactsRouter.patch(
	"/:userContactId",
	requireAuth,
	validateBody(updateContactSchema),
	updateContactController,
);

/**
 * @swagger
 * /contacts/search:
 *   get:
 *     summary: Search by alias (per-user) or phone (BD-only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         required: true
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [alias, phone, auto]
 *           default: auto
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
contactsRouter.get(
	"/search",
	requireAuth,
	validateQuery(searchQuerySchema),
	searchContactsController,
);
