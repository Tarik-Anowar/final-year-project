"use client";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
      callbackUrl: "/",
    });

    if (result?.error) {
      alert(result.error);
    } else if (result?.ok && result?.url) {
      router.push(result.url);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      alert(result.error);
    } else if (result?.ok && result?.url) {
      router.push(result.url);
    }
  };

  if (!hydrated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-75px)] bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full p-2 border border-gray-300 rounded-lg mt-1 placeholder-gray-500"
              autoComplete="email"
              autoFocus
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full p-2 border border-gray-300 rounded-lg mt-1 placeholder-gray-500"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign In
          </button>
          <button
            type="button"
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition mt-2"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </button>
        </form>
        <div className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" passHref>
            <div className="text-blue-500 hover:underline">Sign Up</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
