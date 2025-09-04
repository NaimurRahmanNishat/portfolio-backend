import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongoose';

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
  slug: string;
  subtitle?: string;
  authorImage: string;
  category: BlogCategory;
  content: string;
  thumbnail?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true, maxLength: [120, 'Title cannot exceed 120 characters']},
    slug: { type: String, required: true, unique: true, lowercase: true },
    subtitle: { type: String, trim: true },
    authorImage: { type: String},
    category: { type: String, enum: Object.values(BlogCategory), required: true },
    content: { type: String, required: true, minLength: [10, 'Content should be at least 10 characters long']},
    thumbnail: { 
      type: String, 
      default: 'https://mailrelay.com/wp-content/uploads/2018/03/que-es-un-blog-1.png' 
    },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Blogs = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blogs;
