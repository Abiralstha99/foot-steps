import express from "express";
import { getAllPhotos, updatePhoto, getPhotoById } from "../controllers/photoController";
import { clerkAuth, syncUser } from "../middleware/auth";

import { validate } from "../middleware/validate";
import { updatePhotoSchema, photoParamSchema } from "../schemas/photoSchemas";

const photoRouter = express.Router();

photoRouter.patch("/:photoId", clerkAuth, syncUser, validate(photoParamSchema), validate(updatePhotoSchema), updatePhoto);
photoRouter.get("/all", clerkAuth, syncUser, getAllPhotos);
photoRouter.get("/:photoId", clerkAuth, syncUser, validate(photoParamSchema), getPhotoById);

export default photoRouter;
