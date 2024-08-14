import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Order schema
const OrderSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    paymentDetails: {
      ccName: {
        type: String,
        required: true,
      },
      ccNumber: {
        type: String,
        required: true,
      },
      ccExpiration: {
        type: String,
        required: true,
      },
      ccCvv: {
        type: String,
        required: true,
      },
    },
    supplied: {
      type: Boolean,
      default: false
    },
    orderedBy: {
      type: String,
      required: false
    },
    total: {
      type: String,
      required: true,
    },
    cart: [
      {
        _id: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true,
        },
        img: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Orders = mongoose.model('Order', OrderSchema);

export { Orders as OrdersModel };
