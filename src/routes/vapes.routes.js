import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../middlewares/upload.js";
import { createVape, deleteVape, getVapeById, getVapes, updateVape } from "../controllers/vapes.controller.js";
const router = Router();

router.get("/", getVapes);
router.get("/:id", getVapeById);
router.post("/", uploadImage, createVape);
router.delete("/:id", deleteVape);

router.put("/:id", updateVape)

router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "Image is too large (max 5MB)" });
    }

    return res.status(400).json({ message: "Invalid image upload payload" });
  }

  return next(err);
});
export default router;
