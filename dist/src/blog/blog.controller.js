"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.allBlogs = exports.createBlog = void 0;
const ResponseHandler_1 = require("../utils/ResponseHandler");
const blog_model_1 = __importStar(require("./blog.model"));
const createBlog = async (req, res) => {
    try {
        const { title, slug, subtitle, category, content, thumbnail, isPublished, isFeatured } = req.body;
        // Category validation
        if (!Object.values(blog_model_1.BlogCategory).includes(category)) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Invalid category");
        }
        // Duplicate title check
        const existingBlog = await blog_model_1.default.findOne({ title });
        if (existingBlog) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Blog with this title already exists");
        }
        // Auto-generate slug if not provided
        const finalSlug = slug ||
            title
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
        const blog = new blog_model_1.default({
            title,
            slug: finalSlug,
            subtitle,
            category,
            content,
            thumbnail,
            isPublished,
            isFeatured,
        });
        await blog.save();
        return (0, ResponseHandler_1.successResponse)(res, 201, "Blog created successfully", blog);
    }
    catch (error) {
        console.error(error);
        return (0, ResponseHandler_1.errorResponse)(res, 500, "Failed to create blog");
    }
};
exports.createBlog = createBlog;
const allBlogs = async (req, res) => {
    try {
        const search = req.query.search;
        const category = req.query.category;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // filter blog
        let filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { subtitle: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
            ];
        }
        // filter by category
        if (category) {
            filter.category = category;
        }
        // pagination
        const skip = (page - 1) * limit;
        // blog fetch
        const blogs = await blog_model_1.default.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);
        // total blog count
        const totalBlogs = await blog_model_1.default.countDocuments(filter);
        return (0, ResponseHandler_1.successResponse)(res, 200, "Blogs fetched successfully", {
            total: totalBlogs,
            page,
            totalPages: Math.ceil(totalBlogs / limit),
            blogs,
        });
    }
    catch (error) {
        return (0, ResponseHandler_1.errorResponse)(res, 500, "Failed to fetch blogs");
    }
};
exports.allBlogs = allBlogs;
