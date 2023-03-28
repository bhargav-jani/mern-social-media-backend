import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { uploadToCloudinary } from "./middleware/cloudinary.js";
import {v2 as cloudinary} from 'cloudinary';
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";


/* configurations */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json({limit:'30mb'}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* routes with files */
app.post("/auth/register", uploadToCloudinary, register);
app.post("/posts", verifyToken, uploadToCloudinary, createPost);

/* routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* mongoose setup */
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", false);
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

		/* add data one time manually via data folder */
		// User.insertMany(users);
		// Post.insertMany(posts);
	})
	.catch((error) => console.log(`${error} did not connect`));

