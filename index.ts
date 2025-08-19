import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app: Application = express();
const port: number = 8000;

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// routes
import contactRoutes from "./src/contact/contact.route";
app.use("/api/contact", contactRoutes);

// routes
import allProjectRoute from "./src/project/project.route";
app.use("/api/projects", allProjectRoute)

// routes
import blogRoutes from "./src/blog/blog.route";
app.use("/api/blogs", blogRoutes);

async function bootstrap() {
  try {
    const connectDB = process.env.DB_URL;
    if (!connectDB) {
      console.error("❌ No MongoDB URL found in environment variables.");
      process.exit(1);
    }
    await mongoose.connect(connectDB);
    console.log("✅ MongoDB Connected!");
    // start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed!", error);
  }
}

// default route check the home page
app.get("/", (req:Request, res:Response) => {
  res.send("Portfolio server is running!");
});

bootstrap();
