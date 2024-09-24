"use server";
import { getServerSession } from "next-auth/next"; // Import the session handler from NextAuth
import connectToDatabase from "../lib/db";
import Post from "../model/postModel";
import { NEXT_AUTH } from "../lib/auth"; // Import your NextAuth configuration

interface PostData {
  topic: string;
  description: string;
  image?: string;
}

export default async function postHandler({
  topic,
  description,
  image,
}: PostData) {
  try {
    // Get session from the server

    const session = await getServerSession(NEXT_AUTH);
    if (!session || !session.user) {
      return { ok: false, error: "Not authenticated" };
    }

    // Retrieve the user ID from the session
    const creator = session.user.id;

    // Create a new post with the authenticated user as the creator
    const newPost = new Post({
      topic,
      description,
      image,
      creator, // Store the creator (user ID) in the Post document
    });

    // Connect to the database and save the post
    await connectToDatabase();
    const post = await newPost.save();

    console.log(`Post created with ID: ${post._id}`);
    return { ok: true };
  } catch (err) {
    console.error("Error saving post:", err);
    return { ok: false, error: err + "... Error saving post" };
  }
}
