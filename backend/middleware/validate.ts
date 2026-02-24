import { Request, Response, NextFunction } from "express";
import { ZodSchema, z } from "zod";
import { photoFileSchema } from "../schemas/photoSchemas";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      // formatError preserves the full nested path: { body: { name: { _errors: ["..."] } } }
      // This lets the frontend map errors directly to individual fields.
      const errors = z.formatError(result.error);
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }
    const data = result.data as {
      body?: unknown;
      params?: Record<string, string>;
      query?: Record<string, any>;
    };
    if (data.body !== undefined) req.body = data.body;
    if (data.query !== undefined) req.query = data.query;
    if (data.params !== undefined) Object.assign(req.params, data.params);
    next();
  };
};

export const validateFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const result = photoFileSchema.safeParse({ file: req.file });
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return res.status(400).json({ message: "Invalid file", errors: fieldErrors });
  }

  next();
};