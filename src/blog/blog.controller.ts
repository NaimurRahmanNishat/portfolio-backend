import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/ResponseHandler";
import Blogs, { BlogCategory } from "./blog.model";

interface CreateBlogBody {
  title: string;
  slug?: string;
  subtitle?: string;
  category: BlogCategory;
  content: string;
  thumbnail?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

const createBlog = async (
  req: Request<{}, {}, CreateBlogBody>,
  res: Response
): Promise<void> => {
  try {
    const { title, slug, subtitle, category, content, thumbnail, isPublished, isFeatured } = req.body;

    // Category validation
    if (!Object.values(BlogCategory).includes(category)) {
      return errorResponse(res, 400, "Invalid category");
    }

    // Duplicate title check
    const existingBlog = await Blogs.findOne({ title });
    if (existingBlog) {
      return errorResponse(res, 400, "Blog with this title already exists");
    }

    // Auto-generate slug if not provided
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

    const blog = new Blogs({
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

    return successResponse(res, 201, "Blog created successfully", blog);
  } catch (error: any) {
    console.error(error);
    return errorResponse(res, 500, "Failed to create blog");
  }
};

const allBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string;
    const category = req.query.category as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; 
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10;

    // filter blog
    let filter: any = {};
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
    const blogs = await Blogs.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);

    // total blog count
    const totalBlogs = await Blogs.countDocuments(filter);

    return successResponse(res, 200, "Blogs fetched successfully", {
      total: totalBlogs,
      page,
      totalPages: Math.ceil(totalBlogs / limit),
      blogs,
    });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch blogs");
  }
};


export { createBlog, allBlogs };
