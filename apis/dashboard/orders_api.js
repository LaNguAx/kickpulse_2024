import OrderService from '../../services/dashboard/order_service.js';
import AuthService from '../../services/auth_service.js';
import { UsersModel } from '../../models/user.js';

// Get all orders
export async function getOrders(req, res) {
  try {
    const orders = await OrderService.getOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Create a new order
export async function createOrder(req, res) {
  try {
    const order = { ...req.body };
    // if a logged in user ordered, save the order in his orders array
    if (req.session.userId)
      order.orderedBy = req.session.email;

    const newOrder = await OrderService.createOrder(order);

    if (req.session.userId) {
      const user = await AuthService.getUser(req.session.email);
      if (!user)
        return res.status(404).json({ success: false, message: 'Failed finding logged in user..' });

      user.orders.push(newOrder._id);
      const updatedOrders = user.orders;
      await AuthService.updateUserOrders(user, updatedOrders);
    }
    res.status(201).json({ success: true, data: newOrder });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get a single order by ID
export async function getOrder(req, res) {
  const { id } = req.params;
  try {
    const order = await OrderService.getOrder(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

export async function updateOrder(req, res) {
  const { id } = req.params;
  const newOrderData = { ...req.body };

  try {
    const updatedOrder = await OrderService.updateOrder(id, newOrderData);
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}


// Delete a order by ID
export async function deleteOrder(req, res) {
  const { id } = req.params;
  try {
    const deletedOrder = await OrderService.deleteOrder(id);

    const userWhoOrdered = await AuthService.getUser(deletedOrder.orderedBy, deletedOrder._id);
    if (userWhoOrdered) {
      // Remove the order ID from the user's orders array
      userWhoOrdered.orders.pull(deletedOrder._id);
      await userWhoOrdered.save();
      console.log(`Order ${deletedOrder._id} removed from user ${userWhoOrdered.email}`);
    }

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}


export async function getOrdersGroupedByEmail(req, res) {
  try {
    const groupedOrders = await OrderService.getOrdersGroupedByEmail();
    res.status(200).json({ success: true, data: groupedOrders });
  } catch (error) {
    console.error('Error fetching grouped orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get all orders in ascending order by creation date
export async function getOrdersInAscOrder(req, res) {
  try {
    const orders = await OrderService.getOrdersInAscOrder();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

