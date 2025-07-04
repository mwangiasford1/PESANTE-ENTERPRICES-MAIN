const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Inquiry = sequelize.define('Inquiry', {
  name: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Inquiry; 