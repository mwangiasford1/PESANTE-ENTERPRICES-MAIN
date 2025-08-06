const nodemailer = require('nodemailer');

async function addAppointment(req, res) {
  const { name, phone, property_id, date } = req.body;

  // Configure your email transport
  const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: 'Pesante001@outlook.com',
      pass: process.env.OUTLOOK_PASSWORD, // Store securely in .env
    },
  });

  const mailOptions = {
    from: 'Pesante001@outlook.com',
    to: 'Pesante001@outlook.com',
    subject: 'New Appointment Request',
    text: `
      Name: ${name}
      Phone: ${phone}
      Property ID: ${property_id}
      Date: ${date}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Appointment sent successfully.' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send appointment.' });
  }
}

module.exports = { addAppointment };
