import express from "express";
import {
  getDashboardStats,
  getOnThisDay,
  getUpcomingTrips,
  getRecentActivity,
} from "../controllers/dashboardController";
import { clerkAuth, syncUser } from "../middleware/auth";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", clerkAuth, syncUser, getDashboardStats);
dashboardRouter.get("/on-this-day", clerkAuth, syncUser, getOnThisDay);
dashboardRouter.get("/upcoming", clerkAuth, syncUser, getUpcomingTrips);
dashboardRouter.get("/recent-activity", clerkAuth, syncUser, getRecentActivity);

export default dashboardRouter;
