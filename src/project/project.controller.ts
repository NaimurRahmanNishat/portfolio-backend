import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/ResponseHandler";
import Projects, { ProjectType } from "./porject.model";

// Create project
const createProject = async (req: Request, res: Response): Promise<void> => {
  const { title, image, category, description, hosting, versionControl, link, github } = req.body;
  try {
    // category validation
    if (!Object.values(Projects.schema.path("category").options.enum).includes(category)) {
        return errorResponse(res, 400, "Invalid project category");
    }
    const project = new Projects({ title, image, category, description, hosting, versionControl, link, github });
    await project.save();
    return successResponse(res, 201, "Project created successfully", project);
  } catch (error) {
    return errorResponse(res, 500, "Failed to create project");
  }
};

// Get all projects
const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string;
    const sortBy = req.query.sortBy as string;

    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;

    let query: any = {};
    if (category && Object.values(Projects.schema.path("category").options.enum).includes(category)) {
      query = { category };
    }

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

    // Fetch projects with pagination and sorting
    const projects = await Projects.find(query).sort(sortOption).skip(skip).limit(limit);

    // Get total number of documents for the given query
    const totalProjects = await Projects.countDocuments(query);
    const totalPages = Math.ceil(totalProjects / limit);

    return successResponse(res, 200, "Projects fetched successfully", { projects, pagination: { totalProjects, totalPages, currentPage: page, limit } });
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch projects");
  }
};

// Get single project by ID
const singleProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, 400, "Project id is required");
    }
    const project = (await Projects.findById(id)) as ProjectType;
    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }
    return successResponse(res, 200, "Project fetched successfully", project);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch project");
  }
};

export { createProject, getAllProjects, singleProject };
