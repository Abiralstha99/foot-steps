import express from "express";
import {
  getDashboardStats,
  getOnThisDay,
  getUpcomingTrips,
  getRecentActivity,
} from "../controllers/dashboardController";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", getDashboardStats);
dashboardRouter.get("/on-this-day", getOnThisDay);
dashboardRouter.get("/upcoming", getUpcomingTrips);
dashboardRouter.get("/recent-activity", getRecentActivity);

export default dashboardRouter;

