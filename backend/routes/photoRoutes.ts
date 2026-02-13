import express from "express";
import { getAllPhotos } from "../controllers/photoController";

const photosRouter = express.Router();

// GET /api/photos/all - Get all photos with coordinates
photosRouter.get("/all", getAllPhotos);

export default photosRouter;