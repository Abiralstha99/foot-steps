import express from "express";
import { getAllPhotos, updatePhoto, getPhotoById } from "../controllers/photoController";
import { clerkAuth, syncUser } from "../middleware/auth";


const photoRouter = express.Router();

photoRouter.patch("/:photoId", clerkAuth, syncUser, updatePhoto);
photoRouter.get("/all", clerkAuth, syncUser, getAllPhotos);
photoRouter.get("/:photoId", clerkAuth, syncUser, getPhotoById);
export default photoRouter;
