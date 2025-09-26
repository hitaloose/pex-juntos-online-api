import multer from "multer";

import { CONFIG } from "../config";

export const uploadMiddleware = multer({
  limits: { fileSize: CONFIG.FILE_UPLOAD_MAX_SIZE_MB * 1024 * 1024 },
});
