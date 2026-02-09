import express from "express";
import { getTrip, createTrip, getTripById, updateTripById, deleteTripById, createPhoto } from "../controllers/tripsController";
import { upload } from "../lib/multer";

const tripsRouter = express.Router();

tripsRouter.get("/", getTrip);
tripsRouter.post("/", createTrip);

tripsRouter.post(
  "/:tripId/photos",
  (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: "Upload failed",
          error: err.message,
        });
      }
      next();
    });
  },
  createPhoto
);

tripsRouter.get("/:id", getTripById);
tripsRouter.patch("/:id", updateTripById);
tripsRouter.delete("/:id", deleteTripById);


export default tripsRouter;
