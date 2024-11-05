import { Schema, model, Types, Document } from "mongoose";

export interface IEdgeUser extends Document {
  user: Types.ObjectId;
  connection: number;
}
// Interface for the Edge in the Hypergraph
export interface IEdge extends Document {
  users: IEdgeUser[]; // Array of user IDs (nodes)
  topic: string; // Topic as the "weight" of the edge
}

// Interface for the Hypergraph
export interface IHypergraph extends Document {
  edges: IEdge[]; // Array of edges in the hypergraph
}

const edgeUserSchema = new Schema<IEdgeUser>({
  connection: { type: Number, default: 0 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Edge Schema
const edgeSchema = new Schema<IEdge>({
  users: [
    edgeUserSchema, // References to User model
  ],
  topic: { type: String, required: true }, // Topic as the edge weight
});

// Hypergraph Schema
const hypergraphSchema = new Schema<IHypergraph>({
  edges: [edgeSchema], // Array of edges
});

// Create and export the Hypergraph model
const Hypergraph = model<IHypergraph>("Hypergraph", hypergraphSchema);

export default Hypergraph;
