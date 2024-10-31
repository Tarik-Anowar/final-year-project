"use server";

import { getServerSession } from "next-auth";
import connectToDatabase from "../lib/db";
import { NEXT_AUTH } from "../lib/auth";
import Post from "../model/postModel";

export default async function getUserPosts() {
  try {
    // Get session from the server

    const session = await getServerSession(NEXT_AUTH);

    if (!session || !session.user) {
      return { ok: false, error: "Not authenticated" };
    }

    const curr_user_id = session.user.id;
    console.log(curr_user_id);

    // Connect to the database and save the post
    await connectToDatabase();
    const allPosts = await Post.find({ creator: curr_user_id }).select(
      "_id topic description"
    );

    console.log(`All Posts with ID: ${curr_user_id}\n`);
    console.log(allPosts);

    return { ok: true, allPosts };
  } catch (err) {
    console.error("Error saving post:", err);
    return { ok: false, error: err + "... Error saving post" };
  }
}
