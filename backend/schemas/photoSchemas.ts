import { z } from "zod";

export const photoParamSchema = z.object({
    params: z.object({
        photoId: z.uuid("Photo ID must be a valid UUID"),
    }),
});

export const updatePhotoSchema = z.object({
    body: z.object({
        caption: z.string().max(500, "Caption cannot exceed 500 characters").optional(),
    }),
});


const MimeTypeEnum = z.enum(["image/jpeg", "image/png", "image/gif"]);
export const photoFileSchema = z.object({
    file: z
        .object({
            originalname: z.string(),
            mimetype: MimeTypeEnum,
            size: z.number().max(10 * 1024 * 1024, "File too large. Max 10MB"),
            buffer: z.instanceof(Buffer),
        })
        .refine((f) => !!f, { message: "File is required" }),
});

