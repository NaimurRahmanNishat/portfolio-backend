import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import contactRoutes from "./src/contact/contact.route";
import allProjectRoute from "./src/project/project.route";
import blogRoutes from "./src/blog/blog.route";

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 8000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://portfolio-frontend-ten-coral.vercel.app",
    ],
    credentials: true,
  })
);

// MongoDB Cached Connection for Serverless
declare global {
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global._mongooseCache || { conn: null, promise: null };
global._mongooseCache = cached;

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  const uri = process.env.DB_URL || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("No MongoDB URL found in DB_URL or MONGODB_URI");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Ensure DB connected before routes
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Portfolio server is running!");
});

app.use("/api/contact", contactRoutes);
app.use("/api/projects", allProjectRoute);
app.use("/api/blogs", blogRoutes);

// Global Error Handler (keeps CORS headers on error responses)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Run listen locally, export app for Vercel
if (!process.env.VERCEL) {
  connectToDatabase()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    })
    .catch((err) => {
      console.error("❌ MongoDB Connection Failed!", err);
    });
}

export default app;
