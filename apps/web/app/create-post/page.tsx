"use client";
import { useState } from "react";
import postHandler from "../actions/submitPostData";
import { useRouter } from "next/navigation";
import UploadImage from "../components/uploadImage";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    image: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (url: string) => {
    console.log("Image uploaded with URL:", url);
    setFormData({
      ...formData,
      image: url,
    });
  };

  const handleImageChange = (e: any) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log(session);

    const { topic, description, image } = formData;
    const postData = {
      topic,
      description,
      image,
    };

    console.log("post data:", postData);

    try {
      const response = await postHandler(postData);
      console.log("Sign-up response:", response);

      if (response.ok) {
        setFormData({
          topic: "",
          description: "",
          image: "",
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        console.error("Post failed:", response.error);
      }
    } catch (error) {
      console.error("Error during creating post:", error);
    }
    console.log(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-75px)] bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Create a Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="topic">
              Topic
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded"
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={1000}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="image">
              Image
            </label>
            <UploadImage
              uploadPreset="nextjs"
              cloudName="dmaxxegxu"
              onUpload={handleImageUpload}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
