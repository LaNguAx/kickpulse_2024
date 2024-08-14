import OrdersService from '../../services/dashboard/order_service.js';
export async function ordersIndex(req, res) {
  const allOrders = await OrdersService.getOrders();
  res.render('../views/dashboard/orders', {
    orders: allOrders,
  });
}
