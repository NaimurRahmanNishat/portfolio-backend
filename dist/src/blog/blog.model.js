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
exports.BlogCategory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var BlogCategory;
(function (BlogCategory) {
    BlogCategory["WebDevelopment"] = "Web Development";
    BlogCategory["FrontendDevelopment"] = "Frontend Development";
    BlogCategory["BackendDevelopment"] = "Backend Development";
    BlogCategory["ProgrammingTips"] = "Programming Tips";
    BlogCategory["TechTutorials"] = "Tech Tutorials";
    BlogCategory["CareerDevelopment"] = "Career Development";
    BlogCategory["ProjectShowcases"] = "Project Showcases";
    BlogCategory["ToolsAndResources"] = "Tools & Resources";
    BlogCategory["DevOpsAndDeployment"] = "DevOps & Deployment";
    BlogCategory["IndustryNews"] = "Industry News";
})(BlogCategory || (exports.BlogCategory = BlogCategory = {}));
const blogSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, maxLength: [120, 'Title cannot exceed 120 characters'] },
    slug: { type: String, required: true, unique: true, lowercase: true },
    subtitle: { type: String, trim: true },
    authorImage: { type: String },
    category: { type: String, enum: Object.values(BlogCategory), required: true },
    content: { type: String, required: true, minLength: [10, 'Content should be at least 10 characters long'] },
    thumbnail: {
        type: String,
        default: 'https://mailrelay.com/wp-content/uploads/2018/03/que-es-un-blog-1.png'
    },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
}, {
    timestamps: true,
});
const Blogs = mongoose_1.default.models.Blog || mongoose_1.default.model('Blog', blogSchema);
exports.default = Blogs;
