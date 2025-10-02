import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
	openapi: "3.0.3",
	info: {
		title: "Contact Management API",
		version: "1.0.0",
		description:
			"Express + Prisma (MongoDB) API with unified responses, BD-only phone validation, and JWT auth.",
	},
	servers: [{ url: "http://localhost:4000", description: "Local" }],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
		schemas: {
			// Generic unified response wrapper
			ApiResponse: {
				type: "object",
				properties: {
					success: { type: "boolean" },
					payload: { nullable: true },
					message: { type: "string" },
					status: { type: "integer", format: "int32" },
				},
				required: ["success", "payload", "message", "status"],
			},

			// Domain models / payloads
			TokenResponse: {
				type: "object",
				properties: { token: { type: "string" } },
				required: ["token"],
			},

			RegisterRequest: {
				type: "object",
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string", minLength: 8, maxLength: 72 },
					profile: {
						type: "object",
						properties: {
							firstName: { type: "string" },
							lastName: { type: "string" },
							otherEmails: {
								type: "array",
								items: { type: "string", format: "email" },
								maxItems: 10,
							},
							contacts: {
								type: "array",
								maxItems: 100,
								items: {
									type: "object",
									properties: {
										phone: { type: "string", example: "01811223344" },
										alias: { type: "string", example: "HR Desk" },
									},
									required: ["phone", "alias"],
								},
							},
						},
						required: ["firstName", "lastName"],
					},
				},
				required: ["email", "password", "profile"],
			},

			LoginRequest: {
				type: "object",
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string", minLength: 6 },
				},
				required: ["email", "password"],
			},

			ContactCreate: {
				type: "object",
				properties: {
					phone: { type: "string", example: "01811223344" },
					alias: { type: "string", example: "HR Desk" },
					labels: {
						type: "array",
						items: { type: "string" },
						example: ["work"],
					},
					notes: { type: "string", example: "Receives calls 10am–6pm" },
				},
				required: ["phone"],
			},

			ContactListItem: {
				type: "object",
				properties: {
					id: { type: "string" },
					alias: { type: "string" },
					labels: { type: "array", items: { type: "string" } },
					notes: { type: "string", nullable: true },
					phoneNumber: { type: "string", example: "01811223344" },
					normalizedPhone: { type: "string", example: "8801811223344" },
					createdAt: { type: "string", format: "date-time" },
				},
			},

			ContactsPage: {
				type: "object",
				properties: {
					page: { type: "integer" },
					pageSize: { type: "integer" },
					total: { type: "integer" },
					items: {
						type: "array",
						items: { $ref: "#/components/schemas/ContactListItem" },
					},
				},
				required: ["page", "pageSize", "total", "items"],
			},
		},
	},
	// Apply bearer on all /contacts endpoints by default
	security: [],
};

export const swaggerOptions = swaggerJSDoc({
	definition: swaggerDefinition,
	// Point to route/controller files for JSDoc annotations
	apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
});
