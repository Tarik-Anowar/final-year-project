"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UploadImage from "../components/uploadImage";
import signUpHandler from "../actions/submitSignupData";

const options = [
  "Football",
  "Global News",
  "Politics",
  "Cricket",
  "Stand Up",
  "Technology",
  "Music",
  "Movies",
  "Gaming",
  "Travel",
];

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords don't match!");
      setSnackbarOpen(true);
      return;
    }

    const signUpData = {
      name,
      email,
      password,
      imageUrl,
      interests: selectedOptions,
    };

    console.log("Sign-up data:", signUpData);

    try {
      const response = await signUpHandler(signUpData);
      console.log("Sign-up response:", response);

      if (response.ok) {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setImageUrl("");
        setSelectedOptions([]);
        setSnackbarMessage("Sign-up successful! Redirecting...");
        setSignUpSuccess(true);
        setSnackbarOpen(true);

        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setSignUpSuccess(false);
        setSnackbarMessage(
          "Sign-up failed. Please try again. " + response.error
        );
        console.error("Sign-up failed:", response.error);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setSignUpSuccess(false);
      setSnackbarMessage("An error occurred during sign-up. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleImageUpload = (url: string) => {
    console.log("Image uploaded with URL:", url);
    setImageUrl(url);
  };

  const handleOptionChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md my-10">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <UploadImage
            uploadPreset="nextjs"
            cloudName="dmaxxegxu"
            onUpload={handleImageUpload}
          />
          <div>
            <h2 className="text-lg font-medium mb-2">Select Your Interests</h2>
            <div className="grid grid-cols-2 gap-2">
              {options.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <div className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link href="/signin" passHref>
            <div className="text-blue-500 hover:underline">Sign In</div>
          </Link>
        </div>
      </div>

      {snackbarOpen && (
        <div
          className={`${
            signUpSuccess ? "bg-green-500" : "bg-red-500"
          } text-white px-6 py-4 rounded-lg mt-4`}
        >
          {snackbarMessage}
          <button className="ml-4 underline" onClick={handleCloseSnackbar}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
