import express from "express";
import multer from "multer"; // middleware für dateiupload in express
import { checkAuth } from "../middleware/checkAuth.js";
import { deleteMedia, uploadMedia } from "../controllers/mediaController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // das sind 10 MB
  },
});

router.use(checkAuth);

router.post("/uploadImage", upload.single("image"), uploadMedia); // FE muss dann die Datei unter Namen "image" schicken

router.delete("/:mediaId", deleteMedia);

export default router;
