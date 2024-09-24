"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import UserAvatar from "./userAvatar";

const MyAppBar = () => {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<boolean>(false);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => !prev);
  };

  const id = anchorEl ? "user-popover" : undefined;

  return (
    <nav className="bg-gray-900 h-[75px] p-4 shadow-lg sticky top-0">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo or Brand */}
        <div className="text-white text-xl font-bold">
          <Link href="/">
            <div className="hover:text-gray-400 transition duration-300">
              VibeConnect
            </div>
          </Link>
        </div>

        {/* Navigation and User Section */}
        <div className="flex items-center space-x-6">
          {/* User Authenticated */}
          {status === "authenticated" ? (
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                className="focus:outline-none"
              >
                <UserAvatar
                  userId={session?.user?.id}
                  name={session?.user?.name}
                  imageUrl={session?.user?.image}
                  size={40}
                />
              </button>

              {anchorEl && (
                <div
                  id={id}
                  className="absolute bg-white shadow-lg rounded-lg py-4 px-6 right-0 mt-2 w-64 z-50"
                >
                  <div className="text-center">
                    <h6 className="text-lg font-semibold text-gray-900">
                      {session?.user?.name}
                    </h6>
                    <p className="text-sm text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                  <div className="mt-4 text-center">
                    <UserAvatar
                      userId={session?.user?.id}
                      name={session?.user?.name}
                      imageUrl={session?.user?.image}
                      size={80}
                    />
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full mt-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User Not Authenticated
            <div className="flex items-center space-x-4">
              <Link href="/signin">
                <div className="text-white hover:text-gray-400 transition duration-300">
                  Sign In
                </div>
              </Link>
              <Link href="/signup">
                <div className="text-white hover:text-gray-400 transition duration-300">
                  Sign Up
                </div>
              </Link>
            </div>
          )}

          {/* Hamburger Menu Icon
          <button className="text-white focus:outline-none hover:text-gray-400 transition duration-300">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button> */}

          <div></div>
        </div>
      </div>
    </nav>
  );
};

export default MyAppBar;
