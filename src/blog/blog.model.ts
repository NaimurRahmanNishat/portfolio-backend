import mongoose, { Schema } from 'mongoose';
import { Document, Types } from 'mongoose';


export enum BlogCategory {
  WebDevelopment = 'Web Development',
  FrontendDevelopment = 'Frontend Development',
  BackendDevelopment = 'Backend Development',
  ProgrammingTips = 'Programming Tips',
  TechTutorials = 'Tech Tutorials',
  CareerDevelopment = 'Career Development',
  ProjectShowcases = 'Project Showcases',
  ToolsAndResources = 'Tools & Resources',
  DevOpsAndDeployment = 'DevOps & Deployment',
  IndustryNews = 'Industry News',
}

export interface IBlog extends Document {
  title: string;
  subtitle: string;
  image: string;
  category: BlogCategory;
  content: string;
  thumbnail?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    image: { type: String, required: true },
    category: { type: String, enum: Object.values(BlogCategory), required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, default: 'https://mailrelay.com/wp-content/uploads/2018/03/que-es-un-blog-1.png' },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Blogs = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blogs;