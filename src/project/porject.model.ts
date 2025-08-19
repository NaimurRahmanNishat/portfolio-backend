import mongoose, { Schema, Document } from "mongoose";

export enum ProjectCategory {
  AllProjects = 'All Projects',
  Frontend = 'Frontend Development',
  Backend = 'Backend Development',
  Fullstack = 'Fullstack Development',
}

// Features & Technologies sub schemas
const featureItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const technologyItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

// Project Details main schema
const projectDetailsSchema = new Schema({
  overview: { type: String, required: true },
  features: [featureItemSchema],
  technologies: [technologyItemSchema]
}, { _id: false });


export interface ProjectType extends Document {
  title: string;
  image: string;
  category: ProjectCategory;
  description: string;
  hosting: string;
  versionControl: string;
  link: string;
  github: string;
}

const projectSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, enum: Object.values(ProjectCategory), required: true },
  description: projectDetailsSchema, 
  hosting: { type: String, required: true },
  versionControl: { type: String, required: true },
  link: { type: String, required: true },
  github: { type: String, required: true },
}, {
  timestamps: true
});

const Projects = mongoose.models.Project || mongoose.model<ProjectType>("Project", projectSchema);

export default Projects;