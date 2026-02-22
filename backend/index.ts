import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tripRoutes from "./routes/tripRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import photoRoutes from "./routes/photoRoutes";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middleware
app.use(express.json()); app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://foot-steps-gamma.vercel.app',
  credentials: true
}));
//Clerk Middleware
app.use(clerkMiddleware());

//Routes
app.use("/api/trips", tripRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/photos", photoRoutes);

// Serve built frontend (single-service deploy: API + SPA)
// Expected build output at: <repoRoot>/frontend/dist
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");
const frontendIndexHtml = path.join(frontendDistPath, "index.html");
const hasBuiltFrontend = fs.existsSync(frontendIndexHtml);

if (hasBuiltFrontend) {
  app.use(express.static(frontendDistPath));

  // SPA fallback (avoid capturing API routes)
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.sendFile(frontendIndexHtml);
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
