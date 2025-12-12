import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { httpLogger } from "./utils/logger.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import { apiRateLimiter } from "./middleware/rateLimit.middleware.js";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          process.env.CLIENT_URL || "http://localhost:3000",
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS?.split(",") || [
  "http://localhost:3000",
];
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
app.use("/api", apiRateLimiter);

// Logging
app.use(httpLogger);

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Compression
app.use(compression());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "auth-service",
    version: process.env.npm_package_version,
  });
});

// API routes
const API_VERSION = process.env.API_VERSION || "v1";
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);

// 404 handler
app.use("*", notFoundHandler);

// Error handling
app.use(errorHandler);

export default app;
