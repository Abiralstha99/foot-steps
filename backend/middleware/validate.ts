import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { createPhoto } from "../controllers/photoController";
import { photoFileSchema } from "../schemas/photoSchemas";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // If body,params or query is missing, zod will handle it as an empty object
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.format();
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.fieldErrors,
      });
    }

    // Overwrite req fields with parsed (coerced/stripped) data
    Object.assign(req, result.data);
    next();
  };
};

export const validateFile = (req: Request, res: Response, next: NextFunction) => {
  const result = photoFileSchema.safeParse({ file: req.file });
  if (!result.success) {
    return res.status(400).json({ message: "Invalid file", errors: result.error.format() });
  }
  next();
};