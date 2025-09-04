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
exports.getSingleBlog = exports.allBlogs = exports.createBlog = void 0;
const ResponseHandler_1 = require("../utils/ResponseHandler");
const blog_model_1 = __importStar(require("./blog.model"));
const createBlog = async (req, res) => {
    try {
        const { title, slug, subtitle, authorImage, category, content, thumbnail, isPublished = true, isFeatured = false } = req.body;
        // Category validation
        if (!Object.values(blog_model_1.BlogCategory).includes(category)) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Invalid category");
        }
        // Auto-generate slug if not provided
        const finalSlug = slug || title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        // Duplicate title/slug check
        const existingBlog = await blog_model_1.default.findOne({ $or: [{ title }, { slug: finalSlug }] });
        if (existingBlog) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Blog with this title or slug already exists");
        }
        const blog = new blog_model_1.default({
            title,
            slug: finalSlug,
            subtitle,
            authorImage,
            category,
            content,
            thumbnail: thumbnail || 'https://mailrelay.com/wp-content/uploads/2018/03/que-es-un-blog-1.png',
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
        const sortBy = req.query.sortBy || "createdAt";
        const category = req.query.category;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // filter blog (search by title, subtitle, content, category, slug)
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
        // sort blog
        let sortOption = {};
        switch (sortBy) {
            case "title-asc":
                sortOption = { title: 1 };
                break;
            case "title-desc":
                sortOption = { title: -1 };
                break;
            case "oldest":
                sortOption = { createdAt: 1 };
                break;
            case "newest":
            default:
                sortOption = { createdAt: -1 };
                break;
        }
        // Category filter
        if (category && Object.values(blog_model_1.BlogCategory).includes(category)) {
            filter.category = category;
        }
        // Calculate skip for pagination
        const skip = (page - 1) * limit;
        const blogs = await blog_model_1.default.find(filter).sort(sortOption).skip(skip).limit(limit);
        const totalBlogs = await blog_model_1.default.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / limit);
        return (0, ResponseHandler_1.successResponse)(res, 200, "Blogs fetched successfully", { blogs, total: totalBlogs, page, totalPages, limit });
    }
    catch (error) {
        return (0, ResponseHandler_1.errorResponse)(res, 500, "Failed to fetch blogs");
    }
};
exports.allBlogs = allBlogs;
const getSingleBlog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Blog id is required");
        }
        const blog = await blog_model_1.default.findById(id);
        if (!blog) {
            return (0, ResponseHandler_1.errorResponse)(res, 404, "Blog not found");
        }
        return (0, ResponseHandler_1.successResponse)(res, 200, "Blog fetched successfully", blog);
    }
    catch (error) {
        return (0, ResponseHandler_1.errorResponse)(res, 500, "Failed to fetch blog");
    }
};
exports.getSingleBlog = getSingleBlog;
