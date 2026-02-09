import express from "express";
import { getTrip, createTrip, getTripById, updateTripById, deleteTripById } from "../controllers/tripsController";
import { upload } from "../lib/multer";

const tripsRouter = express.Router();

tripsRouter.get("/", getTrip);
tripsRouter.post("/", createTrip);

tripsRouter.post("/:tripId,photos", upload.array("photo", 10), createPhoto);

tripsRouter.get("/:id", getTripById);
tripsRouter.patch("/:id", updateTripById);
tripsRouter.delete("/:id", deleteTripById);


export default tripsRouter;
