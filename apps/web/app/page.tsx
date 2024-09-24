"use client";
import { useSession } from "next-auth/react";
import MyAppBar from "./components/Appbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import getUserPosts from "./actions/getUserPosts";

const Home: React.FC = () => {
  const { data: session, status } = useSession();
  const [currUserPosts, setCurrUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { ok, allPosts } = await getUserPosts();

      if (ok === true && allPosts !== undefined) {
        setCurrUserPosts(allPosts);
      } else {
        setCurrUserPosts([]); // No posts if fetching fails
      }
      setLoading(false);
    };

    fetchPosts();
  }, [session]);

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
                  {currUserPosts.map((post: any) => (
                    <div
                      key={post._id}
                      className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300"
                    >
                      <h2 className="text-xl font-bold">{post.topic}</h2>
                      <p className="text-gray-600">{post.description}</p>
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
