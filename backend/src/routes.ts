import { Router } from "express";
import multer from "multer";
import { handleUpload } from "./controllers/upload/UploadController";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), handleUpload);

export default router;
