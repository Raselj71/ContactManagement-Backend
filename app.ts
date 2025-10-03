import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error";
import { authRouter } from "./route/auth.route";
import { contactsRouter } from "./route/contact.route";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/contacts", contactsRouter);

app.use(errorHandler);

export default app;
