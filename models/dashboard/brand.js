import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Brand schema
const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Brands = mongoose.model('Brand', BrandSchema);

export { Brands as BrandsModel };
