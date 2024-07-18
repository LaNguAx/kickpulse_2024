import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Product schema
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String], // Array of strings to hold sizes
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    supplier: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
    image: {
      type: String, // URL to the product image
      required: true,
    },
    brand: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
    category: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      subcategories: [
        {
          name: {
            type: String,
            required: true,
          },
          id: {
            type: mongoose.Types.ObjectId,
            required: true,
          },
          _id: false
        },
      ],
    },
    gender: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Products = mongoose.model('Product', ProductSchema);

export { Products as ProductsModel };
