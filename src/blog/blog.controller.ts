import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/ResponseHandler";
import Blogs, { BlogCategory } from "./blog.model";

interface CreateBlogBody {
  title: string;
  slug?: string;
  subtitle?: string;
  authorImage?: string;
  category: BlogCategory;
  content: string;
  thumbnail?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}
const createBlog = async (req: Request<{}, {}, CreateBlogBody>,res: Response): Promise<void> => {
  try {
    const { title, slug, subtitle, authorImage, category, content, thumbnail, isPublished = true, isFeatured = false } = req.body;

    // Category validation
    if (!Object.values(BlogCategory).includes(category)) {
      return errorResponse(res, 400, "Invalid category");
    }

    // Auto-generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    // Duplicate title/slug check
    const existingBlog = await Blogs.findOne({ $or: [{ title }, { slug: finalSlug }] });
    if (existingBlog) {
      return errorResponse(res, 400, "Blog with this title or slug already exists");
    }

    const blog = new Blogs({
      title,
      slug: finalSlug,
      subtitle,
      authorImage,
      category,
      content,
      thumbnail : thumbnail || 'https://mailrelay.com/wp-content/uploads/2018/03/que-es-un-blog-1.png',
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
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const category = req.query.category as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // filter blog (search by title, subtitle, content, category, slug)
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

    // sort blog
    let sortOption: any = {};
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
    if (category && Object.values(BlogCategory).includes(category as BlogCategory)) {
      filter.category = category;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const blogs = await Blogs.find(filter).sort(sortOption).skip(skip).limit(limit);

    const totalBlogs = await Blogs.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / limit);

    return successResponse(res, 200, "Blogs fetched successfully", { blogs, total: totalBlogs, page, totalPages, limit });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch blogs");
  }
};

const getSingleBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, 400, "Blog id is required");
    }
    const blog = await Blogs.findById(id);
    if (!blog) {
      return errorResponse(res, 404, "Blog not found");
    }
    return successResponse(res, 200, "Blog fetched successfully", blog);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch blog");
  }
};

export { createBlog, allBlogs, getSingleBlog };
