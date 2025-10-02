import cors from "cors";
import express from "express";
import { ok } from "./lib/common";
import { errorHandler } from "./middleware/error";
import { authRouter } from "./route/auth.route";
import { contactsRouter } from "./route/contact.route";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json(ok({ ok: true }, "Healthy")));

app.use("/auth", authRouter);
app.use("/contacts", contactsRouter);

// must be last
app.use(errorHandler);

export default app;
