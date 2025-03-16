import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import connectDB from "./database/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1); // Exit process on failure
  }
};

startServer();
