import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "http";
import contactRoutes from "./src/contact/contact.route";
import allProjectRoute from "./src/project/project.route";
import blogRoutes from "./src/blog/blog.route";

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 8000;
let server: Server | null = null;

// Middlewares
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
app.options("*", cors());

// MongoDB Cached Connection
declare global {
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global._mongooseCache || { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.DB_URL || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("❌ No MongoDB URL found in DB_URL or MONGODB_URI");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// Ensure DB connection before hitting routes
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Health / Root Route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Portfolio server is running!",
  });
});

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/projects", allProjectRoute);
app.use("/api/blogs", blogRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler (keeps CORS headers even on error)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🚨 Server Error:", err);
  const statusCode = Number(err?.statusCode || err?.status) || 500;
  res.status(statusCode).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
});

// Persistent server startup (for VPS / Render / Local)
const shutdown = (exitCode = 1): void => {
  if (server) {
    server.close(() => {
      mongoose.connection.close().finally(() => process.exit(exitCode));
    });
  } else {
    process.exit(exitCode);
  }
};

if (!process.env.VERCEL) {
  process.on("unhandledRejection", (reason) => {
    console.error("🚨 Unhandled Rejection:", reason);
    shutdown(1);
  });

  process.on("uncaughtException", (error) => {
    console.error("🚨 Uncaught Exception:", error);
    shutdown(1);
  });

  (async () => {
    try {
      await connectDB();
      console.log("✅ MongoDB Connected!");
      server = app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      shutdown(1);
    }
  })();
}

export default app;
