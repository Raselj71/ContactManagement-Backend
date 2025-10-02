import app from "./app.ts"; // 👈 in ESM you must use .js extension after compile

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`✅ Server running at http://localhost:${port}`);
});
