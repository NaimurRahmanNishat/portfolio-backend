import { Router } from "express";
import { allBlogs, createBlog } from "./blog.controller";

const router = Router();

router.post("/create-blog", createBlog);

router.get("/all-blogs", allBlogs);


export default router;