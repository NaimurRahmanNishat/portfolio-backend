"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("./project.controller");
const router = (0, express_1.Router)();
router.post("/create-project", project_controller_1.createProject);
router.get("/all-projects", project_controller_1.getAllProjects);
router.get("/:id", project_controller_1.singleProject);
exports.default = router;
