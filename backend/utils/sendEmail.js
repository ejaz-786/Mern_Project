const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const { email, subject, url } = options;
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICES,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.SMTP_MAIL,
    subject: subject,
    html: ` Your password reset token is:- <br/> ${url} <br/> If you have not requested this email, 
    please Ignore it.<br/><a href="${url}">click here to reset</a>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
