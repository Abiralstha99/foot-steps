import express from "express";
import tripRoutes from "./routes/tripRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import photoRoutes from "./routes/photoRoutes";
import { clerkMiddleware } from '@clerk/express';

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Clerk Middleware
app.use(clerkMiddleware());

//Routes
app.use("/api/trips", tripRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/photos", photoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
