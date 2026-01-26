import "dotenv/config";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import vapesRoutes from "./routes/vapes.routes.js";
import orderRoutes from "./routes/order.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//routes
app.use("/api/vapes", vapesRoutes);

app.use("/api/orders", orderRoutes);

console.log("APP STARTING...");

app.get("/", (req, res) => {
  res.send("Backend is alive 🚀");
});
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

app.listen(PORT, () => {
  console.log(`Серверт работает на порту :${PORT}`);
});
