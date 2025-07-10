import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,     
    pass: process.env.GMAIL_PASS,     
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      from: `"CommerciaL" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <p>Here is your OTP:</p>
          <p style="font-size: 24px; font-weight: bold;">${otp}</p>
          <p>This code is valid for 5 minutes.</p>
          <p>— Team CommerciaL</p>
        </div>
      `,
    });

    return { success: true, info };
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    return { success: false, error: err };
  }
}
