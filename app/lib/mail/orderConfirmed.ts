import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendOrderConfirmationEmail(to: string, orderId: string, amount: string) {
  try {
    const info = await transporter.sendMail({
      from: `"CommerciaL" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Order Confirmed – CommerciaL',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #333;">Your order has been confirmed!</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Total:</strong> ₹${amount}</p>
          <p>We have started processing your order. You will receive further updates as it moves to shipping.</p>
          <p>Thanks for shopping with <strong>CommerciaL</strong>!</p>
        </div>
      `,
    });

    return { success: true, info };
  } catch (err) {
    return { success: false, error: err };
  }
}
