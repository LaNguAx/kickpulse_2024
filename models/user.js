import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the User schema
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 128,
      // match: [
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      // ],
    },
    orders: {
      type: [mongoose.Types.ObjectId],
      default: [], // Default to an empty array if no orders are present
    },
    role: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Users = mongoose.model('User', UserSchema);

export { Users as UsersModel };
