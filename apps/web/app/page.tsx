"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import getUserPosts from "./actions/getUserPosts";
import getAllPosts from "./actions/getAllPosts";
import updatePostLikes from "./actions/updatePostLikes";

// Define the Posts interface
export interface Posts {
  _id: string;
  topic: string;
  description: string;
  likes: string[]; // Array of ObjectIds represented as strings for frontend
  dislikes: string[];
}

// Home component
const Home: React.FC = () => {
  const { data: session, status } = useSession();
  const [currUserPosts, setCurrUserPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { ok, allPosts } = await getAllPosts();

      if (ok === true && allPosts !== undefined) {
        setCurrUserPosts(allPosts);
      } else {
        setCurrUserPosts([]); // No posts if fetching fails
      }
      setLoading(false);
    };

    fetchPosts();
  }, [session]);

  // Handle Like functionality
  const handleLike = async (postId: string) => {
    const userId = session?.user?.id;
    setCurrUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId && !post.likes.includes(userId) // Ensure user hasn't liked the post yet
          ? {
              ...post,
              likes: [...post.likes, userId],
              dislikes: post.dislikes.filter((id) => id !== userId), // Remove dislike if user disliked before
            }
          : post
      )
    );
    // Make API call to backend to register the "like" in the database
    await updatePostLikes(postId, userId, true);
  };

  // Handle Dislike functionality
  const handleDislike = async (postId: string) => {
    const userId = session?.user?.id;
    setCurrUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId && !post.dislikes.includes(userId) // Ensure user hasn't disliked the post yet
          ? {
              ...post,
              dislikes: [...post.dislikes, userId],
              likes: post.likes.filter((id) => id !== userId), // Remove like if user liked before
            }
          : post
      )
    );
    // Make API call to backend to register the "dislike" in the database
    await updatePostLikes(postId, userId, false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4 lg:px-0">
        {status === "authenticated" ? (
          <div className="text-center">
            <h1 className="text-2xl lg:text-4xl font-bold mb-4">
              Welcome, {session?.user?.name}!
            </h1>
            <p className="text-gray-600 mb-6 text-lg lg:text-xl">
              Feel free to create a new post or browse through the content.
            </p>
            <Link href="/create-post" passHref>
              <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300">
                Create Post
              </button>
            </Link>

            {/* Show posts if available, otherwise show "No posts" */}
            <div className="mt-6">
              {loading ? (
                <p>Loading posts...</p>
              ) : currUserPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currUserPosts.map((post) => (
                    <div
                      key={post._id}
                      className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300"
                    >
                      <h2 className="text-xl font-bold">{post.topic}</h2>
                      <p className="text-gray-600">{post.description}</p>
                      <div className="flex justify-between mt-4">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                          onClick={() => handleLike(post._id)}
                        >
                          Like ({post.likes.length})
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          onClick={() => handleDislike(post._id)}
                        >
                          Dislike ({post.dislikes.length})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No posts available.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center justify-center h-[calc(100vh-75px)]">
            <h1 className="text-2xl lg:text-4xl font-bold mb-4">
              Welcome to Our Platform!
            </h1>
            <p className="text-gray-600 mb-6 text-lg lg:text-xl">
              Please sign in to create posts and access more features.
            </p>
            <Link href="/signin" passHref>
              <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300">
                Sign In
              </button>
            </Link>
            <div className="mt-4 text-lg lg:text-xl">
              Don&apos;t have an account?{" "}
              <Link href="/signup" passHref>
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Sign Up
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
