import mongoose, { Types, Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  topic: string;
  description: string;
  creator: Types.ObjectId;
  image?: string;
}

const postSchema = new Schema<IPost>(
  {
    topic: {
      type: String,
      required: [true, "Please enter your topic"],
    },
    description: {
      type: String,
      required: [true, "Please enter your description"],
    },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    image: { type: String },
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  mongoose.models?.Post || mongoose.model<IPost>("Post", postSchema);
export default Post;
