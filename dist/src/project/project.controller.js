"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleProject = exports.getAllProjects = exports.createProject = void 0;
const ResponseHandler_1 = require("../utils/ResponseHandler");
const porject_model_1 = __importDefault(require("./porject.model"));
// Create project
const createProject = async (req, res) => {
    const { title, image, category, description, hosting, versionControl, link, github } = req.body;
    try {
        // category validation
        if (!Object.values(porject_model_1.default.schema.path("category").options.enum).includes(category)) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Invalid project category");
        }
        const project = new porject_model_1.default({ title, image, category, description, hosting, versionControl, link, github });
        await project.save();
        return (0, ResponseHandler_1.successResponse)(res, 201, "Project created successfully", project);
    }
    catch (error) {
        return (0, ResponseHandler_1.errorResponse)(res, 500, "Failed to create project");
    }
};
exports.createProject = createProject;
// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const category = req.query.category;
        const sortBy = req.query.sortBy;
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;
        let query = {};
        if (category && Object.values(porject_model_1.default.schema.path("category").options.enum).includes(category)) {
            query = { category };
        }
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
        // Fetch projects with pagination and sorting
        const projects = await porject_model_1.default.find(query).sort(sortOption).skip(skip).limit(limit);
        // Get total number of documents for the given query
        const totalProjects = await porject_model_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalProjects / limit);
        return (0, ResponseHandler_1.successResponse)(res, 200, "Projects fetched successfully", { projects, pagination: { totalProjects, totalPages, currentPage: page, limit } });
    }
    catch (error) {
        return (0, ResponseHandler_1.errorResponse)(res, 500, "Failed to fetch projects");
    }
};
exports.getAllProjects = getAllProjects;
// Get single project by ID
const singleProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Project id is required");
        }
        const project = (await porject_model_1.default.findById(id));
        if (!project) {
            return (0, ResponseHandler_1.errorResponse)(res, 404, "Project not found");
        }
        return (0, ResponseHandler_1.successResponse)(res, 200, "Project fetched successfully", project);
    }
    catch (error) {
        return (0, ResponseHandler_1.errorResponse)(res, 500, "Failed to fetch project");
    }
};
exports.singleProject = singleProject;
