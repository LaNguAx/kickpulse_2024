import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Branch schema
const BranchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Branches = mongoose.model('Branch', BranchSchema);

export { Branches as BranchesModel };
