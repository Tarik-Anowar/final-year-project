"use server";
import connectToDatabase from "../lib/db";
import User from "../model/userModel";
interface SignUpData {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  interests: string[];
}

export default async function signUpHandler({
  name,
  email,
  password,
  imageUrl,
  interests,
}: SignUpData) {
  try {
    const newUser = new User({
      name,
      email,
      password: password,
      image: imageUrl || "",
      interests,
    });
    console.log(newUser);

    await connectToDatabase();
    const user = await newUser.save();

    console.log(`User created with ID: ${user._id}`);
    return { ok: true };
  } catch (err) {
    console.error("Error saving user:", err);
    return { ok: false, error: err + "... Error saving user" };
  }
}
