import express from "express";
import { getTrip, createTrip } from "../controllers/tripsController";

const tripsRouter = express.Router();

tripsRouter.get("/:tripId", getTrip);
tripsRouter.post("/", createTrip);

export default tripsRouter;
