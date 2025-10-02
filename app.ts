import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import type { NextFunction, Request, Response } from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use((_req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	console.error("Error:", err);
	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
});

export default app;
