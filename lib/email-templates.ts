import { sendEmail, getAdminEmail, isEmailConfigured } from '@/lib/email';

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  const adminEmail = getAdminEmail();

  await sendEmail({
    to: adminEmail,
    replyTo: data.email,
    subject: `New Contact: ${data.subject}`,
    text: [
      'You have received a new message from the website contact form.',
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : '',
      `Subject: ${data.subject}`,
      '',
      'Message:',
      data.message,
    ]
      .filter(Boolean)
      .join('\n'),
    html: `
      <h2>New Contact Form Message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      <p><strong>Subject:</strong> ${data.subject}</p>
      <hr>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  });
}

export async function sendContactAutoReply(data: ContactEmailData) {
  await sendEmail({
    to: data.email,
    subject: 'Thank you for contacting Samuel Louis-Jean Publications',
    text: [
      `Dear ${data.name},`,
      '',
      'Thank you for reaching out to Samuel Louis-Jean Publications. We have received your message and will get back to you as soon as possible.',
      '',
      'Your message:',
      `"${data.message}"`,
      '',
      'Blessings,',
      'Samuel Louis-Jean Publications',
    ].join('\n'),
    html: `
      <p>Dear ${data.name},</p>
      <p>Thank you for reaching out to <strong>Samuel Louis-Jean Publications</strong>. We have received your message and will get back to you as soon as possible.</p>
      <p><strong>Your message:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>
      <p>Blessings,<br><strong>Samuel Louis-Jean Publications</strong></p>
    `,
  });
}

export async function sendNewsletterNotification(email: string, name?: string) {
  const adminEmail = getAdminEmail();

  await sendEmail({
    to: adminEmail,
    subject: 'New Newsletter Subscriber',
    text: `A new subscriber joined the newsletter.\n\nEmail: ${email}${name ? `\nName: ${name}` : ''}`,
    html: `<p>A new subscriber joined the newsletter.</p><p><strong>Email:</strong> ${email}${name ? `<br><strong>Name:</strong> ${name}` : ''}</p>`,
  });
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{ title: string; quantity: number; price: number }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function sendOrderConfirmationToCustomer(data: OrderEmailData) {
  const itemsList = data.items
    .map((item) => `- ${item.title} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`)
    .join('\n');

  await sendEmail({
    to: data.customerEmail,
    subject: `Order Confirmation — ${data.orderNumber}`,
    text: [
      `Dear ${data.customerName},`,
      '',
      'Thank you for your order from Samuel Louis-Jean Publications!',
      '',
      `Order Number: ${data.orderNumber}`,
      '',
      'Items:',
      itemsList,
      '',
      `Subtotal: ${formatPrice(data.subtotal)}`,
      `Shipping: ${formatPrice(data.shippingCost)}`,
      `Total: ${formatPrice(data.total)}`,
      '',
      'Shipping Address:',
      `${data.shippingAddress.address}`,
      `${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}`,
      data.shippingAddress.country,
      '',
      'We will process your order and contact you with shipping details.',
      '',
      'Blessings,',
      'Samuel Louis-Jean Publications',
    ].join('\n'),
  });
}

export async function sendOrderNotificationToAdmin(data: OrderEmailData) {
  const adminEmail = getAdminEmail();
  const itemsList = data.items
    .map((item) => `<li>${item.title} x${item.quantity} — ${formatPrice(item.price * item.quantity)}</li>`)
    .join('');

  await sendEmail({
    to: adminEmail,
    replyTo: data.customerEmail,
    subject: `New Paid Order — ${data.orderNumber}`,
    text: [
      'A new order has been paid.',
      '',
      `Order: ${data.orderNumber}`,
      `Customer: ${data.customerName}`,
      `Email: ${data.customerEmail}`,
      data.customerPhone ? `Phone: ${data.customerPhone}` : '',
      `Total: ${formatPrice(data.total)}`,
    ]
      .filter(Boolean)
      .join('\n'),
    html: `
      <h2>New Paid Order</h2>
      <p><strong>Order:</strong> ${data.orderNumber}</p>
      <p><strong>Customer:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> ${data.customerEmail}</p>
      ${data.customerPhone ? `<p><strong>Phone:</strong> ${data.customerPhone}</p>` : ''}
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> ${formatPrice(data.total)}</p>
    `,
  });
}

export async function sendOrderEmailsIfConfigured(data: OrderEmailData) {
  if (!isEmailConfigured()) return;

  try {
    await Promise.all([
      sendOrderConfirmationToCustomer(data),
      sendOrderNotificationToAdmin(data),
    ]);
  } catch (error) {
    console.error('Order email error:', error);
  }
}

export { isEmailConfigured };
