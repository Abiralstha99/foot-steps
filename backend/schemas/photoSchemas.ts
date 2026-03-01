import { z } from "zod";
import { CAPTION_MAX_LEN } from "../config/constants";
const photoIdParam = z.object({
    photoId: z.uuid("Photo ID must be a valid UUID"),
});

const updatePhotoBody = z.object({
    caption: z.string().max(CAPTION_MAX_LEN, `Caption cannot exceed ${CAPTION_MAX_LEN} characters`).optional(),
});

// gif excluded — known polyglot attack vector
const MimeTypeEnum = z.enum(["image/jpeg", "image/png"]);

const photoFile = z.object({
    originalname: z.string(),
    mimetype: MimeTypeEnum,
    size: z.number().max(10 * 1024 * 1024, "File too large. Max 10MB"),
    buffer: z.instanceof(Buffer),
});

// Used by: GET /:photoId, PATCH /:photoId
export const photoParamSchema = z.object({
    params: photoIdParam,
});

// Used by: PATCH /:photoId 
export const updatePhotoSchema = z.object({
    body: updatePhotoBody,
});

// Used by: validateFile middleware
export const photoFileSchema = z.object({
    file: photoFile,
});
