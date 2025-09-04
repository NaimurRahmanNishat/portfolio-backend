import { Router } from "express";
import { allBlogs, createBlog, getSingleBlog } from "./blog.controller";

const router = Router();

router.post("/create-blog", createBlog);
router.get("/all-blogs", allBlogs);
router.get("/:id", getSingleBlog);

export default router;
