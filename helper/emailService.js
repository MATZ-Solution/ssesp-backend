// emailService.js
require("dotenv").config();
const { queryRunner } = require("../helper/queryRunner");
const nodemailer = require('nodemailer');

const sendEmail = async (recipientEmail, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MS_EMAIL_HOST,
      port: Number(process.env.MS_EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MS_EMAIL_USER, // Your Gmail address
        pass: process.env.MS_EMAIL_PASS, // Your generated app password
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: true
      }
    });

    const mailOptions = {
      from: process.env.MS_EMAIL_FROM,
      to: recipientEmail,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: 'success'
    };

  } catch (err) {

    console.error('Error sending email:', err.message);

    return {
      success: false,
      error: err.code || 'EMAIL_SEND_FAILED',
      message: err.message || 'Failed to send email'
    };
  }
};

module.exports = { sendEmail };