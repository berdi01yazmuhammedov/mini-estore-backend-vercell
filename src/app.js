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

app.get("/", (_req, res) => {
  return res.status(200).send("Backend is alive 🚀");
});
app.use((err, _req, res, _next) => {
  console.error("UNHANDLED EXPRESS ERROR: ", err);
  if (res.headersSent) {
    return;
  }

  return res.status(500).json({ message: err.message });
});

export default app;
