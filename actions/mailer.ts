import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PW,
  },
});

export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
    to,
    subject,
    text,
    html,
  };
console.log("in mailer")
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};
