import express from "express";
import { getTrip, createTrip, getTripById, getTripPhotos, updateTripById, deleteTripById } from "../controllers/tripsController";
import { createPhoto, handlePhotoUpload, getPhotosByGrouped } from "../controllers/photoController";
import { clerkAuth, syncUser } from "../middleware/auth";
import { validate, validateFile } from "../middleware/validate";
import { createTripSchema, updateTripSchema, tripParamSchema, tripIdParamSchema } from "../schemas/tripSchemas";

const tripsRouter = express.Router();

tripsRouter.get("/", clerkAuth, syncUser, getTrip);
tripsRouter.post("/", clerkAuth, syncUser, validate(createTripSchema), createTrip);
tripsRouter.post("/:tripId/photos", clerkAuth, syncUser, validate(tripIdParamSchema), handlePhotoUpload, validateFile, createPhoto);
tripsRouter.get("/:id", clerkAuth, syncUser, validate(tripParamSchema), getTripById);
tripsRouter.get("/:id/photos/grouped", clerkAuth, syncUser, validate(tripParamSchema), getPhotosByGrouped);
tripsRouter.get("/:id/photos", clerkAuth, syncUser, validate(tripParamSchema), getTripPhotos);
tripsRouter.patch("/:id", clerkAuth, syncUser, validate(tripParamSchema), validate(updateTripSchema), updateTripById);
tripsRouter.delete("/:id", clerkAuth, syncUser, validate(tripParamSchema), deleteTripById); 

export default tripsRouter;
