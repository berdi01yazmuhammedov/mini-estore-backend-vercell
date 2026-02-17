import "dotenv/config";
import express from "express";
import cors from "cors";
import vapesRoutes from "./routes/vapes.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/api/vapes", vapesRoutes);

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Backend is alive 🚀");
});
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

export default app;
