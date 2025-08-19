"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8000;
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
// routes
const contact_route_1 = __importDefault(require("./src/contact/contact.route"));
app.use("/api/contact", contact_route_1.default);
// routes
const project_route_1 = __importDefault(require("./src/project/project.route"));
app.use("/api/projects", project_route_1.default);
// routes
const blog_route_1 = __importDefault(require("./src/blog/blog.route"));
app.use("/api/blogs", blog_route_1.default);
async function bootstrap() {
    try {
        const connectDB = process.env.DB_URL;
        if (!connectDB) {
            console.error("❌ No MongoDB URL found in environment variables.");
            process.exit(1);
        }
        await mongoose_1.default.connect(connectDB);
        console.log("✅ MongoDB Connected!");
        // start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("❌ MongoDB Connection Failed!", error);
    }
}
// default route check the home page
app.get("/", (req, res) => {
    res.send("Hello server is running!");
});
bootstrap();
