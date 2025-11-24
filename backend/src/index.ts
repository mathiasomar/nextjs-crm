import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.ORIGIN || "http://localhost:3000"],
  })
);

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8000;

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
