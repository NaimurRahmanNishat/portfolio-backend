import { Router } from "express";
import { createProject, getAllProjects, singleProject } from "./project.controller";

const router = Router();

router.post("/create-project", createProject);

router.get("/all-projects", getAllProjects);

router.get("/:id", singleProject);

export default router;