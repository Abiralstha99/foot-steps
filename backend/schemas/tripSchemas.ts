import { z } from 'zod';

const tripIdParam = z.object({
    id: z.uuid("Trip ID must be a valid UUID"),
});

const createTripBody = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    startDate: z.iso.datetime({ message: "startDate must be a valid ISO 8601 date" }),
    endDate: z.iso.datetime({ message: "endDate must be a valid ISO 8601 date" }),
    coverPhotoUrl: z
        .url()
        .refine(u => /^https?:\/\//i.test(u), { message: "Only http/https URLs are allowed" })
        .optional(),
}).refine(
    data => new Date(data.startDate) <= new Date(data.endDate),
    { message: "startDate must be on or before endDate", path: ["endDate"] }
);

const updateTripBody = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),
    coverPhotoUrl: z
        .url()
        .refine(u => /^https?:\/\//i.test(u), { message: "Only http/https URLs are allowed" })
        .optional()
        .or(z.literal("")),
}).refine(
    data => !data.startDate || !data.endDate || new Date(data.startDate) <= new Date(data.endDate),
    { message: "startDate must be on or before endDate", path: ["endDate"] }
);

export const tripParamSchema = z.object({
    params: tripIdParam,
});

export const createTripSchema = z.object({
    body: createTripBody,
});

export const updateTripSchema = z.object({
    body: updateTripBody,
});