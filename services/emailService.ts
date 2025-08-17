import nodemailer from 'nodemailer';

export async function sendEmail(summary: string, recipients: string[]): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: recipients.join(','),
      subject: 'Shared Meeting Summary',
      text: summary,
      html: `<pre>${summary}</pre>`
    });
  } catch (error) {
    console.error('Email Service error:', error);
    throw new Error('Failed to send email');
  }
}