import express from "express";
import { getTrip, createTrip, getTripById, updateTripById, deleteTripById } from "../controllers/tripsController";

const tripsRouter = express.Router();

tripsRouter.get("/", getTrip);
tripsRouter.post("/", createTrip);

tripsRouter.get("/:id", getTripById);
tripsRouter.patch("/:id", updateTripById);
tripsRouter.delete("/:id", deleteTripById);

export default tripsRouter;
