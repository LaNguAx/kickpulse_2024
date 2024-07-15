import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Product schema
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subcategories: [
      {
        name: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Category = mongoose.model('Category', CategorySchema);

export { Category as CategoriesModel };
