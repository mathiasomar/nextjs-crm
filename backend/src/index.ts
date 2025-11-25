import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";
import contactRoute from "./routes/contact.route";
import leadRoute from "./routes/lead.route";
import opportunityRoute from "./routes/oppotunity.route";
import activityRoute from "./routes/activity.route";
import { clerkMiddleware } from "@clerk/express";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.ORIGIN || "http://localhost:3000"],
  })
);
app.use(clerkMiddleware());

app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoute);
app.use("/api/leads", leadRoute);
app.use("/api/oppotunities", opportunityRoute);
app.use("/api/activities", activityRoute);

const PORT = process.env.PORT || 8000;

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
