import Order from '@/models/Order';
import { sendOrderEmailsIfConfigured } from '@/lib/email-templates';

export async function sendOrderPaidEmails(orderId: string) {
  const order = await Order.findById(orderId);

  if (!order || order.paymentStatus !== 'paid') {
    return;
  }

  await sendOrderEmailsIfConfigured({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    items: order.items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total,
    shippingAddress: order.shippingAddress,
  });
}
