"use server";

import connectToDatabase from "../lib/db";
import Post from "../model/postModel";
import { Types } from "mongoose";

export default async function updatePostLikes(
  postId: string,
  userId: string,
  isLike: boolean
) {
  try {
    await connectToDatabase();

    const userObjectId = new Types.ObjectId(userId);

    // Prepare the update operations
    let updateOperation;

    if (isLike) {
      // Add user to likes and remove from dislikes
      updateOperation = {
        $addToSet: { likes: userObjectId },
        $pull: { dislikes: userObjectId },
      };
    } else {
      // Add user to dislikes and remove from likes
      updateOperation = {
        $addToSet: { dislikes: userObjectId },
        $pull: { likes: userObjectId },
      };
    }

    // Update the post with the appropriate operation
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updateOperation,
      { new: true } // Return the updated post
    );

    if (!updatedPost) {
      return { ok: false, error: "Post not found" };
    }

    return { ok: true, post: updatedPost };
  } catch (error) {
    console.error("Error updating post likes/dislikes:", error);
    return { ok: false, error: "Failed to update post likes/dislikes" };
  }
}
