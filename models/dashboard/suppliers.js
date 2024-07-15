import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Product schema
const SupplierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    brands: [
      {
        name: {
          type: String,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Suppliers = mongoose.model('Supplier', SupplierSchema);

export { Suppliers as SuppliersModel };
