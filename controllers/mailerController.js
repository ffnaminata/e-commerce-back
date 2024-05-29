const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e1592660566e1d",
    pass: "969c0329c04b0c"
  }
});

exports.sendEmail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    const info = await transport.sendMail({
      from: '"Furu Diya" <noreply@furudiya.com>',
      to: to, 
      subject: subject, 
      text: text, 
      html: html, 
    });
    res.status(200).json({ message: 'Email sent', messageId: info.messageId });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email', details: error.message });
  }
};
