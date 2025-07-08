const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./db');
const Property = require('./models/Property');
const Appointment = require('./models/Appointment');
const Inquiry = require('./models/Inquiry');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '110mb' }));

// --- Property Routes ---
app.get('/api/properties', async (req, res) => {
  const props = await Property.findAll();
  res.json(props);
});
app.post('/api/properties', async (req, res) => {
  try {
    const prop = await Property.create(req.body);
    res.json(prop);
  } catch (err) {
    console.error(err); // This will print the error in your terminal
    res.status(500).json({ error: 'Failed to create property', details: err.message });
  }
});
app.put('/api/properties/:id', async (req, res) => {
  const prop = await Property.findByPk(req.params.id);
  if (!prop) return res.status(404).json({ error: 'Not found' });
  await prop.update(req.body);
  res.json(prop);
});
app.delete('/api/properties/:id', async (req, res) => {
  const prop = await Property.findByPk(req.params.id);
  if (!prop) return res.status(404).json({ error: 'Not found' });
  await prop.destroy();
  res.json({ success: true });
});

// --- Appointment Routes ---
app.get('/api/appointments', async (req, res) => {
  const appts = await Appointment.findAll();
  res.json(appts);
});
app.post('/api/appointments', async (req, res) => {
  const appt = await Appointment.create(req.body);
  res.json(appt);
});
app.put('/api/appointments/:id', async (req, res) => {
  const appt = await Appointment.findByPk(req.params.id);
  if (!appt) return res.status(404).json({ error: 'Not found' });
  await appt.update(req.body);
  res.json(appt);
});
app.delete('/api/appointments/:id', async (req, res) => {
  const appt = await Appointment.findByPk(req.params.id);
  if (!appt) return res.status(404).json({ error: 'Not found' });
  await appt.destroy();
  res.json({ success: true });
});

// --- Inquiry Routes ---
app.get('/api/inquiries', async (req, res) => {
  const inqs = await Inquiry.findAll();
  res.json(inqs);
});
app.post('/api/inquiries', async (req, res) => {
  const inq = await Inquiry.create(req.body);
  res.json(inq);
});
app.put('/api/inquiries/:id', async (req, res) => {
  const inq = await Inquiry.findByPk(req.params.id);
  if (!inq) return res.status(404).json({ error: 'Not found' });
  await inq.update(req.body);
  res.json(inq);
});
app.delete('/api/inquiries/:id', async (req, res) => {
  const inq = await Inquiry.findByPk(req.params.id);
  if (!inq) return res.status(404).json({ error: 'Not found' });
  await inq.destroy();
  res.json({ success: true });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `Pesante Contact <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// --- Start Server and Sync DB ---
const PORT = process.env.PORT || 4000;
(async () => {
  await sequelize.sync({ force: true }); // TEMP: force sync to update schema
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
})(); 