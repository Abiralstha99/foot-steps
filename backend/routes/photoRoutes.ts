import express from "express";
import { getAllPhotos, updatePhoto, getPhotoById, deletePhoto } from "../controllers/photoController";
import { clerkAuth, syncUser } from "../middleware/auth";

import { validate } from "../middleware/validate";
import { updatePhotoSchema, photoParamSchema } from "../schemas/photoSchemas";

const photoRouter = express.Router();

photoRouter.get("/all", clerkAuth, syncUser, getAllPhotos);
photoRouter.patch("/:photoId", clerkAuth, syncUser, validate(photoParamSchema), validate(updatePhotoSchema), updatePhoto);
photoRouter.delete("/:photoId", clerkAuth, syncUser, validate(photoParamSchema), deletePhoto);
photoRouter.get("/:photoId", clerkAuth, syncUser, validate(photoParamSchema), getPhotoById);

export default photoRouter;
