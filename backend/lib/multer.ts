import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import type { Request } from "express";

//tells Multer to keep uploaded files in RAM instead of writing them to disk
const storage = multer.memoryStorage();

const limits = {
    fileSize: 5 * 1024 * 1024,
}
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|webm|mov|avi|mkv/i;
    const ext = path.extname(file.originalname).slice(1);
    const mimeOk = allowed.test(file.mimetype);
    const extOk = allowed.test(ext);
    if (mimeOk && extOk) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, gif, webp, mp4, webm, mov, avi, mkv) are allowed"));
    }
  };
  
  export const upload = multer({
    storage,
    limits,
    fileFilter, // remove if you want to accept any file type
  });
