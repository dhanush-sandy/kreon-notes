import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import TextNotesRoutes from "./routes/text-notes.routes.js";
import DrawingNotesRoutes from "./routes/drawing-notes.routes.js";
import ReminderNotesRoutes from "./routes/reminder-notes.routes.js";
import CommonRoutes from "./routes/common.routes.js";
import DebugRoutes from "./routes/debug.routes.js";
import cronService from "./services/cron.service.js";

const app = express();

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Middlewares
app.use(cookieParser());
app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  bodyParser.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// API Routes
app.use("/api/v1/text-notes", TextNotesRoutes);
app.use("/api/v1/drawing-notes", DrawingNotesRoutes);
app.use("/api/v1/reminder-notes", ReminderNotesRoutes);
app.use("/api/v1/notes", CommonRoutes);
app.use("/api/debug", DebugRoutes);

// Initialize cron jobs
cronService.initCronJobs();

export default app;
