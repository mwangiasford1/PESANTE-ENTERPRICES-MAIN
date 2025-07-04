const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Appointment = sequelize.define('Appointment', {
  name: { type: DataTypes.STRING, allowNull: false },
  datetime: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Appointment; 