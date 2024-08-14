import OrderService from './dashboard/order_service.js';
import { UsersModel } from '../models/user.js';

const login = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  try {
    const user = await UsersModel.findOne({ email, password });
    return user;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Login failed.');
  }
};

const register = async (user) => {
  if (!user.email || !user.password || !user.firstName || !user.lastName) {
    throw new Error('All fields are required.');
  }

  try {

    const exists = await getUser(user.email)
    if (exists) return null;

    const newUser = new UsersModel(user);
    await newUser.save();
    console.log('User registered successfully:', newUser);

    return newUser;

  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error('Registration failed.');
  }
};


const getUser = async (email) => {
  const existingUser = await UsersModel.findOne({ email });
  return existingUser;
}

const getUsers = async () => {
  try {
    const users = await UsersModel.find();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

const update = async (user) => {
  if (!user.email || !user.firstName || !user.lastName || !user.currentPassword || !user.newPassword) {
    throw new Error('All fields are required.');
  }

  try {
    // Check if user exists by email
    const existingUser = await getUser(user.email);
    if (!existingUser) return null;

    // Verify current password
    const isMatch = user.currentPassword === existingUser.password;
    if (!isMatch) {
      throw new Error('Current password is incorrect.');
    }

    // Update user details
    existingUser.firstName = user.firstName;
    existingUser.lastName = user.lastName;
    existingUser.password = user.newPassword;
    if (user.newEmail) {
      // update orders that had the previous email
      const userOrders = await OrderService.getOrdersByIds(existingUser.orders);
      for (const order of userOrders) {
        order.orderedBy = user.newEmail;
        await order.save();
      }
      existingUser.email = user.newEmail;
    }

    if (user.orders)
      existingUser.orders = user.orders;

    // Save the updated user
    await existingUser.save();
    console.log('User updated successfully:', existingUser);

    return existingUser;

  } catch (error) {
    console.error('Error during update:', error);
    throw new Error(error.message);
  }
};


const updateUserRole = async (email) => {
  try {

    const user = await getUser(email);
    const currentRole = user.role;

    console.log(currentRole);
    if (currentRole) user.role = false;
    else user.role = true;

    await user.save();
    return user;
  } catch (e) {
    console.error('Error updating user role');
    throw new Error(error.message);
  }
}

const updateUserOrders = async (user, orders) => {
  try {
    user.orders = orders;
    await user.save();

    return user;
  } catch (e) {
    console.error('Error updating user orders..', e);
    throw new Error(error.message);
  }
}

const findUserWhoOrderedSpecificOrder = async (email, orderId) => {
  try {
    const user = await UsersModel.findOne({ email, orders: orderId });
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error; // Re-throw the error after logging it
  }
};
const deleteUser = async (email) => {
  if (!email) {
    throw new Error('Email is required to delete a user.');
  }

  try {
    const deletedUser = await UsersModel.findOneAndDelete({ email });
    if (!deletedUser) {
      throw new Error('User not found.');
    }

    // Iterate through the user's orders and delete each one
    for (const orderId of deletedUser.orders) {
      try {
        await OrderService.deleteOrder(orderId);
      } catch (orderError) {
        console.error(`Failed to delete order ${orderId}:`, orderError);
      }
    }

    console.log('User deleted successfully:', deletedUser);
    return deletedUser;

  } catch (error) {
    console.error('Error during deletion:', error);
    throw new Error('Failed to delete user.');
  }
};


export default {
  login,
  register,
  update,
  getUser,
  getUsers,
  updateUserOrders,
  findUserWhoOrderedSpecificOrder,
  deleteUser,
  updateUserRole
};
