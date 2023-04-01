import express from "express";
import { getFeedPosts, getUserPosts, likePost, deletePost, addComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* read */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* update */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, addComment);

/* delete */
router.delete("/:userId/:postId", verifyToken, deletePost);

export default router;
