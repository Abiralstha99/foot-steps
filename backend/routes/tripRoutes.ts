import express from "express";
import { getTrip, createTrip, getTripById, updateTripById, deleteTripById } from "../controllers/tripsController";
import { createPhoto, handlePhotoUpload } from "../controllers/photoController";
import { clerkAuth, syncUser } from "../middleware/auth";
import { validate, validateFile } from "../middleware/validate";
import { createTripSchema, updateTripSchema, tripParamSchema, tripIdParamSchema } from "../schemas/tripSchemas";

const tripsRouter = express.Router();

tripsRouter.get("/", clerkAuth, syncUser, getTrip);
tripsRouter.post("/", clerkAuth, syncUser, validate(createTripSchema), createTrip);

tripsRouter.post("/:tripId/photos", clerkAuth, syncUser, handlePhotoUpload, validateFile, validate(tripIdParamSchema), createPhoto);

tripsRouter.get("/:id", clerkAuth, syncUser, validate(tripParamSchema), getTripById);
tripsRouter.patch("/:id", clerkAuth, syncUser, validate(tripParamSchema), validate(updateTripSchema), updateTripById);
tripsRouter.delete("/:id", clerkAuth, syncUser, validate(tripParamSchema), deleteTripById);

export default tripsRouter;
