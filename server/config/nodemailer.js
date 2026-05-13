import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, body) => {
  console.log(to);
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    text: body,
  });
  return response;
};
export default sendEmail;
