"use server";

import connectToDatabase from "../lib/db";
import Post from "../model/postModel";
import { Types } from "mongoose";

// Posts interface for the frontend
export interface Posts {
  _id: string;
  topic: string;
  description: string;
  likes: string[]; // Array of ObjectIds represented as strings for frontend
  dislikes: string[];
}

export default async function getAllPosts() {
  try {
    await connectToDatabase();

    // Fetch all posts
    const allPosts = await Post.find().select(
      "_id topic description likes dislikes"
    );

    // Convert allPosts to match the Posts interface
    const formattedPosts: Posts[] = allPosts.map((post) => ({
      _id: post._id.toString(), // Convert ObjectId to string
      topic: post.topic,
      description: post.description,
      likes: post.likes.map((like: Types.ObjectId) => like.toString()), // Convert ObjectId array to string array
      dislikes: post.dislikes.map((dislike: Types.ObjectId) =>
        dislike.toString()
      ), // Convert ObjectId array to string array
    }));

    console.log(`Formatted Posts:\n`, formattedPosts);

    return { ok: true, allPosts: formattedPosts };
  } catch (err) {
    console.error("Error fetching posts:", err);
    return { ok: false, error: err + "... Error fetching posts" };
  }
}
