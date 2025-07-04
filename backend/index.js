const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./db');
const Property = require('./models/Property');
const Appointment = require('./models/Appointment');
const Inquiry = require('./models/Inquiry');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// --- Property Routes ---
app.get('/api/properties', async (req, res) => {
  const props = await Property.findAll();
  res.json(props);
});
app.post('/api/properties', async (req, res) => {
  const prop = await Property.create(req.body);
  res.json(prop);
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

// --- Start Server and Sync DB ---
const PORT = process.env.PORT || 4000;
(async () => {
  await sequelize.sync();
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
})(); 