import express from "express";
import { getTrip, createTrip, getTripById, updateTripById, deleteTripById, createPhoto, handlePhotoUpload } from "../controllers/tripsController";
import { clerkAuth, syncUser } from "../middleware/auth";

const tripsRouter = express.Router();

tripsRouter.get("/", clerkAuth, syncUser, getTrip);
tripsRouter.post("/", clerkAuth, syncUser, createTrip);

tripsRouter.post("/:tripId/photos", clerkAuth, syncUser, handlePhotoUpload, createPhoto);

tripsRouter.get("/:id", clerkAuth, syncUser, getTripById);
tripsRouter.patch("/:id", clerkAuth, syncUser, updateTripById);
tripsRouter.delete("/:id", clerkAuth, syncUser, deleteTripById);

export default tripsRouter;
