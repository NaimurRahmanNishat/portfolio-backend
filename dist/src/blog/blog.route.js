"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const router = (0, express_1.Router)();
router.post("/create-blog", blog_controller_1.createBlog);
router.get("/all-blogs", blog_controller_1.allBlogs);
exports.default = router;
