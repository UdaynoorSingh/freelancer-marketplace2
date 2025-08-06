const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your email for Fiverr Clone",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>`,
  };
  await transporter.sendMail(mailOptions);
};
