import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import { connectDatabase } from "./config/db";
import AppError from "./utils/app-error";
import globalErrorHandler from "./middlewares/error.middleware";
import stringRoutes from "./routes/string.routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/strings", stringRoutes);

// Handle unhandled routes
app.use(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `The route ${req.originalUrl} was not found on the server`,
      404
    )
  );
});

// Global error handling middleware
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
