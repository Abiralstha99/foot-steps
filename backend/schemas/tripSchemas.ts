import { z } from 'zod';

export const tripParamSchema = z.object({
    params: z.object({
        id: z.uuid("Trip ID must be a valid UUID"),
    }),
});

export const createTripSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    startDate: z.iso.datetime({ message: "startDate must be a valid ISO 8601 date" }),
    endDate: z.iso.datetime({ message: "endDate must be a valid ISO 8601 date" }),
    coverPhotoUrl: z.url().optional(),
}).refine(
    data => new Date(data.startDate) <= new Date(data.endDate),
    { message: "startDate must be on or before endDate", path: ["endDate"] }
)


export const updateTripSchema = z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        startDate: z.iso.datetime({ message: "startDate must be a valid ISO 8601 date" }),
        endDate: z.iso.datetime({ message: "endDate must be a valid ISO 8601 date" }),
        coverPhotoUrl: z.url().optional().or(z.literal("")),
}).refine(
    data => new Date(data.startDate) <= new Date(data.endDate),
    { message: "startDate must be on or before endDate", path: ["endDate"] }
)