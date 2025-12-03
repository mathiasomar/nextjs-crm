import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";
import contactRoute from "./routes/contact.route";
import leadRoute from "./routes/lead.route";
import opportunityRoute from "./routes/oppotunity.route";
import activityRoute from "./routes/activity.route";
import organizationRoute from "./routes/organization.route";
import productRoute from "./routes/product.route";

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.ORIGIN || "http://localhost:3000"],
  })
);

app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoute);
app.use("/api/leads", leadRoute);
app.use("/api/opportunities", opportunityRoute);
app.use("/api/activities", activityRoute);
app.use("/api/organizations", organizationRoute);
app.use("/api/products", productRoute);

const PORT = process.env.PORT || 8000;

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
