import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/user.route";
import contactRoute from "./routes/contact.route";
import leadRoute from "./routes/lead.route";
import opportunityRoute from "./routes/oppotunity.route";
import activityRoute from "./routes/activity.route";
import productRoute from "./routes/product.route";
import authRoutes from "./routes/auth.route";

import cookieParser from "cookie-parser";
import {
  apiLimiter,
  corsOptions,
  errorHandler,
  securityHeaders,
} from "./middlewares/security.middleware";

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(securityHeaders);
app.use(corsOptions);

// Apply rate limiting to all routes
app.use(apiLimiter);

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoute);
app.use("/api/leads", leadRoute);
app.use("/api/opportunities", opportunityRoute);
app.use("/api/activities", activityRoute);
app.use("/api/products", productRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   res.status(err.status || 500).json({ message: err.message });
// });

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
