import express from "express";
import { updatePhoto } from "../controllers/photoController";
import { clerkAuth, syncUser } from "../middleware/auth";

const photoRouter = express.Router();

photoRouter.patch("/:photoId", clerkAuth, syncUser, updatePhoto);

export default photoRouter;