import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { createVape, deleteVape, getVapes, updateVape } from "../controllers/vapes.controller.js";
const router = Router();
router.post("/vapes", upload.single("image"), createVape);
router.get("/", getVapes);
router.delete("/:id", deleteVape);
router.put("/:id", updateVape)

export default router;
